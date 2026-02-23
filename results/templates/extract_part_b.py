#!/usr/bin/env python3
"""
Extract Part B template structure, instructions, and table contents from the
ERC Part-B-Template.docx file. Produces a clean text file suitable for
injection into an AI prompt as context.
"""

from pathlib import Path
from lxml import etree
from docx import Document
from docx.oxml.ns import qn


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def run_is_italic(run_elem):
    """Check if a <w:r> element is italic by inspecting rPr/i."""
    rPr = run_elem.find(qn("w:rPr"))
    if rPr is None:
        return False
    i_elem = rPr.find(qn("w:i"))
    if i_elem is None:
        return False
    val = i_elem.get(qn("w:val"))
    # If <w:i/> present with no val or val="true"/"1", it's italic
    if val is None or val in ("true", "1"):
        return True
    return False


def get_paragraph_text_with_italic(p_elem):
    """
    Given a <w:p> element, return formatted text with [ITALIC] markers.
    """
    parts = []
    current_italic = None
    buf = []

    for run_elem in p_elem.findall(qn("w:r")):
        # Get all text nodes in this run (w:t elements)
        texts = []
        for t in run_elem.findall(qn("w:t")):
            if t.text:
                texts.append(t.text)
        if not texts:
            continue
        run_text = "".join(texts)
        is_italic = run_is_italic(run_elem)

        if is_italic != current_italic:
            if buf:
                joined = "".join(buf)
                if current_italic:
                    parts.append(f"[ITALIC]{joined}[/ITALIC]")
                else:
                    parts.append(joined)
                buf = []
            current_italic = is_italic
        buf.append(run_text)

    if buf:
        joined = "".join(buf)
        if current_italic:
            parts.append(f"[ITALIC]{joined}[/ITALIC]")
        else:
            parts.append(joined)

    return "".join(parts)


def get_heading_level(p_elem):
    """Determine heading level from <w:pPr><w:pStyle> value."""
    pPr = p_elem.find(qn("w:pPr"))
    if pPr is None:
        return 0
    pStyle = pPr.find(qn("w:pStyle"))
    if pStyle is None:
        return 0
    style_val = (pStyle.get(qn("w:val")) or "").lower()
    if "heading1" in style_val or style_val == "heading1" or style_val == "title":
        return 1
    if "heading2" in style_val or style_val == "heading2":
        return 2
    if "heading3" in style_val or style_val == "heading3":
        return 3
    if "heading4" in style_val or style_val == "heading4":
        return 4
    # Try numeric suffix
    for i in range(1, 7):
        if style_val.endswith(str(i)) and "heading" in style_val:
            return i
    if "heading" in style_val:
        return 5
    return 0


def extract_table_from_elem(tbl_elem):
    """Extract table rows from a <w:tbl> element."""
    lines = []
    lines.append("")
    lines.append("[TABLE START]")

    rows = tbl_elem.findall(qn("w:tr"))
    for row_idx, row in enumerate(rows):
        cells_text = []
        for cell in row.findall(qn("w:tc")):
            cell_paragraphs = []
            for p in cell.findall(qn("w:p")):
                text = get_paragraph_text_with_italic(p).strip()
                if text:
                    cell_paragraphs.append(text)
            cells_text.append(" / ".join(cell_paragraphs) if cell_paragraphs else "")
        lines.append(" | ".join(cells_text))
        if row_idx == 0:
            lines.append("-" * 60)

    lines.append("[TABLE END]")
    lines.append("")
    return lines


# ---------------------------------------------------------------------------
# Main extraction
# ---------------------------------------------------------------------------

def extract(docx_path: str, output_path: str):
    doc = Document(docx_path)
    body = doc.element.body
    output_lines = []

    output_lines.append("=" * 70)
    output_lines.append("ERC PART B TEMPLATE — EXTRACTED STRUCTURE & INSTRUCTIONS")
    output_lines.append("=" * 70)
    output_lines.append("")
    output_lines.append("Legend:")
    output_lines.append("  [ITALIC]...[/ITALIC]  = Template instructions / guidance text (italic in original)")
    output_lines.append("  [TABLE START]...[TABLE END] = Table structure")
    output_lines.append("  #, ##, ### = Heading levels")
    output_lines.append("")
    output_lines.append("-" * 70)
    output_lines.append("")

    for child in body:
        tag = etree.QName(child.tag).localname if isinstance(child.tag, str) else ""

        if tag == "p":
            text = get_paragraph_text_with_italic(child).strip()
            if not text:
                if output_lines and output_lines[-1] != "":
                    output_lines.append("")
                continue
            level = get_heading_level(child)
            if level > 0:
                prefix = "#" * level + " "
            else:
                prefix = ""
            output_lines.append(f"{prefix}{text}")

        elif tag == "tbl":
            table_lines = extract_table_from_elem(child)
            output_lines.extend(table_lines)

    # Write output
    out = Path(output_path)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text("\n".join(output_lines), encoding="utf-8")
    print(f"Extracted {len(output_lines)} lines to {out}")
    print(f"File size: {out.stat().st_size:,} bytes")


if __name__ == "__main__":
    DOCX = "/Users/evgeniyareshkin/Desktop/projects/researcher/results/templates/Part-B-Template.docx"
    OUT  = "/Users/evgeniyareshkin/Desktop/projects/researcher/results/templates/part-b-structure.txt"
    extract(DOCX, OUT)
