#!/usr/bin/env python3
"""
Fetch grant call data from the EU Funding & Tenders Portal SEDIA REST API.

Usage:
    python3 fetch-eu-grants.py                          # Fetch preconfigured grants
    python3 fetch-eu-grants.py HORIZON-CL4-2026-01-MAT-PROD-01 ROB4GREEN  # Fetch specific IDs

Output:
    results/grants/<identifier>-raw.json    (full API response)
    results/grants/<identifier>-text.txt    (cleaned text for agent input)
"""

import json
import os
import re
import sys
import urllib.request
import urllib.parse
from pathlib import Path
from typing import Optional

ROOT = Path(__file__).parent
GRANTS_DIR = ROOT / "results" / "grants"
GRANTS_DIR.mkdir(parents=True, exist_ok=True)

API_BASE = "https://api.tech.ec.europa.eu/search-api/prod/rest/search"
API_KEY = "SEDIA"

# Default identifiers to fetch if none provided via CLI
DEFAULT_IDENTIFIERS = [
    "HORIZON-CL4-2026-01-MAT-PROD-01",
    "HORIZON-CL4-2026-01-MAT-PROD-13",
    "HORIZON-CL4-2026-01-MAT-PROD-45",
    "ROB4GREEN",
]


def strip_html(html: str) -> str:
    """Remove HTML tags and normalize whitespace."""
    text = re.sub(r'<br\s*/?>', '\n', html)
    text = re.sub(r'</p>', '\n\n', text)
    text = re.sub(r'</li>', '\n', text)
    text = re.sub(r'<li[^>]*>', '- ', text)
    text = re.sub(r'<h\d[^>]*>', '\n### ', text)
    text = re.sub(r'</h\d>', '\n', text)
    text = re.sub(r'<[^>]+>', '', text)
    text = re.sub(r'&amp;', '&', text)
    text = re.sub(r'&lt;', '<', text)
    text = re.sub(r'&gt;', '>', text)
    text = re.sub(r'&quot;', '"', text)
    text = re.sub(r'&#?\w+;', '', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()


def fetch_topic(identifier: str) -> Optional[dict]:
    """Fetch a single topic/call from the SEDIA API. Returns the English result metadata."""
    encoded_id = urllib.parse.quote(f'"{identifier}"')
    url = f"{API_BASE}?apiKey={API_KEY}&text={encoded_id}&pageSize=30"

    # Determine type filter based on identifier
    if identifier.startswith("HORIZON-") or identifier.startswith("ERC-") or identifier.startswith("MSCA-"):
        types = ["1", "2"]
    else:
        types = ["0", "1", "2", "8"]

    query = {
        "bool": {
            "must": [
                {"terms": {"type": types}},
                {"terms": {"status": ["31094501", "31094502", "31094503"]}},
                {"terms": {"language": ["en"]}},
            ]
        }
    }

    req = urllib.request.Request(
        url,
        data=json.dumps(query).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        print(f"  ERROR fetching {identifier}: {e}")
        return None

    # Find the English result
    for result in data.get("results", []):
        meta = result.get("metadata", {})
        lang = meta.get("language", [""])[0]
        if lang == "en":
            return {"api_response": data, "metadata": meta, "summary": result.get("summary", "")}

    print(f"  WARNING: No English result found for {identifier}")
    return None


def format_grant_topic(meta: dict) -> str:
    """Format a standard grant topic (type 1/2) as plain text."""
    lines = []

    title = meta.get("title", [""])[0]
    identifier = meta.get("identifier", [""])[0]
    deadline = meta.get("deadlineDate", [""])[0]
    action_type = meta.get("typesOfAction", [""])[0]
    call_id = meta.get("callIdentifier", [""])[0]
    call_title = meta.get("callTitle", [""])[0]
    deadline_model = meta.get("deadlineModel", [""])[0]
    dest_desc = meta.get("destinationDescription", [""])[0]

    lines.append(f"GRANT CALL: {title}")
    lines.append(f"Identifier: {identifier}")
    lines.append(f"Call: {call_id} — {call_title}")
    lines.append(f"Type of Action: {action_type}")
    lines.append(f"Deadline: {deadline}")
    lines.append(f"Submission: {deadline_model}")
    lines.append("")

    # Budget overview
    budget_raw = meta.get("budgetOverview", [""])[0]
    if budget_raw:
        try:
            budget = json.loads(budget_raw) if isinstance(budget_raw, str) else budget_raw
            lines.append("=== BUDGET ===")
            lines.append(json.dumps(budget, indent=2))
            lines.append("")
        except (json.JSONDecodeError, TypeError):
            pass

    # Destination description
    if dest_desc:
        lines.append("=== DESTINATION ===")
        lines.append(strip_html(dest_desc))
        lines.append("")

    # Main description
    desc = meta.get("descriptionByte", [""])[0]
    if desc:
        lines.append("=== DESCRIPTION (Expected Outcome & Scope) ===")
        lines.append(strip_html(desc))
        lines.append("")

    # Topic conditions (eligibility, evaluation criteria)
    cond = meta.get("topicConditions", [""])[0]
    if cond:
        lines.append("=== CONDITIONS (Eligibility & Evaluation) ===")
        lines.append(strip_html(cond))
        lines.append("")

    # Additional info
    add_info = meta.get("additionalInfos", [""])[0]
    if add_info:
        lines.append("=== ADDITIONAL INFORMATION ===")
        try:
            info = json.loads(add_info) if isinstance(add_info, str) else add_info
            if isinstance(info, dict) and "staticAdditionalInfo" in info:
                lines.append(strip_html(info["staticAdditionalInfo"]))
            else:
                lines.append(strip_html(str(info)))
        except (json.JSONDecodeError, TypeError):
            lines.append(strip_html(str(add_info)))
        lines.append("")

    # Links
    links_raw = meta.get("links", [""])[0]
    if links_raw:
        try:
            links = json.loads(links_raw) if isinstance(links_raw, str) else links_raw
            if links:
                lines.append("=== DOCUMENT LINKS ===")
                for link in links:
                    if isinstance(link, dict):
                        lines.append(f"- {link.get('criterionDescription', '')}: {link.get('url', '')}")
                lines.append("")
        except (json.JSONDecodeError, TypeError):
            pass

    return "\n".join(lines)


def format_competitive_call(meta: dict) -> str:
    """Format a competitive call (type 8) as plain text."""
    lines = []

    ca_name = meta.get("caName", meta.get("callTitle", [""]))[0] if isinstance(meta.get("caName", meta.get("callTitle", [""])), list) else meta.get("caName", "")
    title = meta.get("title", [""])[0]
    identifier = meta.get("identifier", [""])[0]
    deadline = meta.get("deadlineDate", [""])[0]
    budget = meta.get("budget", [""])[0] if isinstance(meta.get("budget"), list) else meta.get("budget", "")
    duration = meta.get("duration", [""])[0] if isinstance(meta.get("duration"), list) else meta.get("duration", "")
    acronym = meta.get("projectAcronym", [""])[0] if isinstance(meta.get("projectAcronym"), list) else meta.get("projectAcronym", "")
    project_name = meta.get("projectName", [""])[0] if isinstance(meta.get("projectName"), list) else meta.get("projectName", "")

    lines.append(f"COMPETITIVE CALL: {ca_name}")
    lines.append(f"Parent Project: {acronym} — {project_name}")
    lines.append(f"Original Topic: {identifier}")
    lines.append(f"Deadline: {deadline}")
    lines.append(f"Total Budget: €{budget:,}" if isinstance(budget, (int, float)) else f"Total Budget: {budget}")
    lines.append(f"Duration: {duration}")
    lines.append("")

    # Beneficiary administration / destination details (usually contains full call description)
    for field in ["beneficiaryAdministration", "destinationDetails"]:
        raw = meta.get(field, [""])[0] if isinstance(meta.get(field), list) else meta.get(field, "")
        if raw:
            lines.append(f"=== CALL DETAILS ===")
            lines.append(strip_html(raw))
            lines.append("")
            break  # They're often duplicates

    # Further information
    further = meta.get("furtherInformation", [""])[0] if isinstance(meta.get("furtherInformation"), list) else meta.get("furtherInformation", "")
    if further:
        lines.append("=== FURTHER INFORMATION ===")
        lines.append(strip_html(further))
        lines.append("")

    return "\n".join(lines)


def process_identifier(identifier: str) -> bool:
    """Fetch, format, and save data for one identifier. Returns True on success."""
    print(f"\n--- Fetching: {identifier} ---")

    result = fetch_topic(identifier)
    if not result:
        return False

    meta = result["metadata"]
    topic_type = meta.get("type", [""])[0]

    # Save raw JSON
    safe_name = identifier.lower().replace(" ", "-")
    raw_path = GRANTS_DIR / f"{safe_name}-raw.json"
    with open(raw_path, "w") as f:
        json.dump(result["api_response"], f, indent=2, ensure_ascii=False)
    print(f"  Raw JSON: {raw_path} ({raw_path.stat().st_size / 1024:.1f} KB)")

    # Format as text
    if topic_type == "8":
        text = format_competitive_call(meta)
    else:
        text = format_grant_topic(meta)

    # Save text
    text_path = GRANTS_DIR / f"{safe_name}-text.txt"
    with open(text_path, "w") as f:
        f.write(text)
    print(f"  Text: {text_path} ({len(text)} chars)")

    # Print summary
    title = meta.get("title", meta.get("caName", ["Unknown"]))[0] if isinstance(meta.get("title", meta.get("caName", [""])), list) else meta.get("title", "Unknown")
    deadline = meta.get("deadlineDate", [""])[0]
    print(f"  Title: {title}")
    print(f"  Deadline: {deadline}")

    return True


def main():
    identifiers = sys.argv[1:] if len(sys.argv) > 1 else DEFAULT_IDENTIFIERS

    print("=" * 60)
    print("  EU F&T Portal Grant Fetcher (SEDIA API)")
    print("=" * 60)
    print(f"\nFetching {len(identifiers)} grant(s)...")

    success = 0
    failed = 0

    for identifier in identifiers:
        if process_identifier(identifier):
            success += 1
        else:
            failed += 1

    print(f"\n{'=' * 60}")
    print(f"  Done: {success} fetched, {failed} failed")
    print(f"  Output: {GRANTS_DIR}")
    print(f"{'=' * 60}")


if __name__ == "__main__":
    main()
