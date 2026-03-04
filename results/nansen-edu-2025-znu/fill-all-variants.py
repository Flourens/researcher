#!/usr/bin/env python3
"""
Fill the Nansen EDU 2025 Project Description DOCX template
for all Smart Grid variants (EN + UA where available).
"""

import json
import os
import copy
from docx import Document
from docx.shared import Pt, RGBColor

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATE_PATH = os.path.join(SCRIPT_DIR, 'templates', 'project-description.docx')
VARIANTS_DIR = os.path.join(SCRIPT_DIR, 'smartgrid-variants')

VARIANT_META = {
    'variant-a': {
        'title': "AI-Powered Smart Grid Education for Ukraine's Energy Resilience",
        'acronym': 'AI-SmartGrid',
    },
    'variant-b': {
        'title': "Smart and Resilient Energy Systems for Ukraine's Post-War Reconstruction",
        'acronym': 'SmartEnergy-UA',
    },
    'variant-c': {
        'title': "Digital Twins and AI for Flexible Energy Systems Education",
        'acronym': 'DigiTwin-Energy',
    },
    'variant-d': {
        'title': "Smart Grid and Green Energy Transition Education for Ukraine",
        'acronym': 'SmartGreen-UA',
    },
}


def fill_template(proposal, variant_id, lang, output_path):
    """Fill the DOCX template with proposal content."""
    doc = Document(TEMPLATE_PATH)
    meta = VARIANT_META[variant_id]

    # --- Fill Cover Table ---
    cover_table = doc.tables[0]
    cover_table.rows[1].cells[1].text = f"{meta['title']} ({meta['acronym']})"
    cover_table.rows[2].cells[1].text = "NTNU — Norwegian University of Science and Technology"

    # --- Delete guideline tables (Tables 1–14) ---
    for idx in reversed(range(1, min(15, len(doc.tables)))):
        table = doc.tables[idx]
        table._element.getparent().remove(table._element)

    # --- Map sections to "► Delete..." markers ---
    section_map = {
        '1.1': proposal['section1_1_background'],
        '1.2': proposal['section1_2_alignment'],
        '2.1': proposal['section2_1_activities'],
        '2.2': proposal['section2_2_risks'],
        '3.1': proposal['section3_1_personnel'],
        '3.2': proposal['section3_2_collaboration'],
        '4.1': proposal['section4_1_impact'],
        '4.2': proposal['section4_2_sustainability'],
    }

    current_section = None
    for para in doc.paragraphs:
        text = para.text.strip()

        if text.startswith('1.1'):
            current_section = '1.1'
        elif text.startswith('1.2'):
            current_section = '1.2'
        elif text.startswith('2.1'):
            current_section = '2.1'
        elif text.startswith('2.2'):
            current_section = '2.2'
        elif text.startswith('3.1'):
            current_section = '3.1'
        elif text.startswith('3.2'):
            current_section = '3.2'
        elif text.startswith('4.1'):
            current_section = '4.1'
        elif text.startswith('4.2'):
            current_section = '4.2'
        elif '► Delete' in text and current_section in section_map:
            content = section_map[current_section]
            paragraphs_text = [p.strip() for p in content.strip().split('\n\n') if p.strip()]

            # Replace marker with first paragraph
            para.text = paragraphs_text[0]
            para.style = doc.styles['Normal']
            for run in para.runs:
                run.font.name = 'Arial'
                run.font.size = Pt(11)
                run.font.color.rgb = RGBColor(0, 0, 0)

            # Insert remaining paragraphs
            current_element = para._element
            for ptext in paragraphs_text[1:]:
                new_para = doc.add_paragraph()
                new_para.text = ptext
                new_para.style = doc.styles['Normal']
                for run in new_para.runs:
                    run.font.name = 'Arial'
                    run.font.size = Pt(11)
                    run.font.color.rgb = RGBColor(0, 0, 0)
                current_element.addnext(new_para._element)
                current_element = new_para._element

            current_section = None

    # --- Fill References ---
    references = proposal.get('references', [])
    ref_indices = []
    for i, para in enumerate(doc.paragraphs):
        if para.text.strip() in ('[Reference]', '[...]'):
            ref_indices.append(i)

    if ref_indices and references:
        first_ref_para = doc.paragraphs[ref_indices[0]]
        first_ref_para.text = references[0]
        first_ref_para.style = doc.styles['Normal']
        for run in first_ref_para.runs:
            run.font.name = 'Arial'
            run.font.size = Pt(10)

        current_element = first_ref_para._element
        for ref in references[1:]:
            new_para = doc.add_paragraph()
            new_para.text = ref
            new_para.style = doc.styles['Normal']
            for run in new_para.runs:
                run.font.name = 'Arial'
                run.font.size = Pt(10)
            current_element.addnext(new_para._element)
            current_element = new_para._element

        # Remove old placeholders
        for idx in ref_indices[1:]:
            para = doc.paragraphs[idx]
            if para.text.strip() in ('[Reference]', '[...]'):
                para._element.getparent().remove(para._element)

    # Clean remaining placeholders
    for para in list(doc.paragraphs):
        t = para.text.strip()
        if t in ('[Reference]', '[...]'):
            para._element.getparent().remove(para._element)
        elif 'List of references referred to in the project description' in t:
            para.text = ''

    doc.save(output_path)
    return output_path


def main():
    print('=' * 60)
    print('FILLING DOCX TEMPLATES FOR ALL SMART GRID VARIANTS')
    print('=' * 60)

    results = []

    for variant_id, meta in VARIANT_META.items():
        variant_dir = os.path.join(VARIANTS_DIR, variant_id)
        if not os.path.exists(variant_dir):
            print(f'\n  ✗ {meta["acronym"]}: directory not found')
            continue

        print(f'\n--- {meta["acronym"]} ({meta["title"][:50]}...) ---')

        # English
        en_json = os.path.join(variant_dir, 'project-description-en.json')
        if os.path.exists(en_json):
            proposal = json.load(open(en_json, 'r', encoding='utf-8'))
            out = os.path.join(variant_dir, f'{meta["acronym"]}-Project-Description-EN.docx')
            fill_template(proposal, variant_id, 'en', out)

            words = sum(len(proposal[k].split()) for k in proposal if k != 'references' and isinstance(proposal[k], str))
            print(f'  ✓ EN: {os.path.basename(out)} (~{words} words)')
            results.append((meta['acronym'], 'EN', words, out))
        else:
            print(f'  ✗ EN: no JSON found')

        # Ukrainian
        uk_json = os.path.join(variant_dir, 'project-description-uk.json')
        if os.path.exists(uk_json):
            proposal = json.load(open(uk_json, 'r', encoding='utf-8'))
            out = os.path.join(variant_dir, f'{meta["acronym"]}-Project-Description-UA.docx')
            fill_template(proposal, variant_id, 'uk', out)

            words = sum(len(proposal[k].split()) for k in proposal if k != 'references' and isinstance(proposal[k], str))
            print(f'  ✓ UA: {os.path.basename(out)} (~{words} words)')
            results.append((meta['acronym'], 'UA', words, out))
        else:
            print(f'  — UA: no JSON (not yet generated)')

    # Summary
    print(f'\n{"=" * 60}')
    print('SUMMARY')
    print(f'{"=" * 60}')
    print(f'{"Variant":<20} {"Lang":<5} {"Words":<8} {"File"}')
    print('-' * 60)
    for acronym, lang, words, path in results:
        print(f'{acronym:<20} {lang:<5} ~{words:<7} {os.path.basename(path)}')

    # Also load review scores
    print(f'\n{"=" * 60}')
    print('REVIEW SCORES')
    print(f'{"=" * 60}')
    print(f'{"Variant":<20} {"Score":<8} {"Qualifies":<10} {"Criteria Scores"}')
    print('-' * 60)
    for variant_id, meta in VARIANT_META.items():
        review_path = os.path.join(VARIANTS_DIR, variant_id, 'review-results.json')
        if os.path.exists(review_path):
            review = json.load(open(review_path, 'r', encoding='utf-8'))
            scores = ', '.join(f'{cs["score"]}/7' for cs in review.get('criterionScores', []))
            print(f'{meta["acronym"]:<20} {review["overallScore"]}/7    {"YES" if review.get("qualifiesForFunding") else "NO":<10} [{scores}]')

    print(f'\nAll DOCX files saved to: {VARIANTS_DIR}/')


if __name__ == '__main__':
    main()
