#!/usr/bin/env python3
"""
Script to inline full SVG content into hero1.html and hero3.html
Replaces the trimmed SVG placeholders with complete SVG layer content
"""

import re
from pathlib import Path

def extract_svg_inner_content(svg_path):
    """Extract content between <svg> and </svg> tags"""
    with open(svg_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find content between <svg...> and </svg>
    match = re.search(r'<svg[^>]*>(.*)</svg>', content, re.DOTALL)
    if match:
        return match.group(1).strip()
    return None

def inline_svgs_in_html(html_path, top_right_svg_path, bottom_left_svg_path):
    """Replace trimmed SVG content with full content in HTML file"""
    
    # Read the HTML file
    with open(html_path, 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    # Extract SVG inner content
    top_right_inner = extract_svg_inner_content(top_right_svg_path)
    bottom_left_inner = extract_svg_inner_content(bottom_left_svg_path)
    
    if not top_right_inner or not bottom_left_inner:
        print(f"Error: Could not extract SVG content")
        return False
    
    # Replace top-right SVG content
    # Find the pattern: <!-- (trimmed) full top-right-new.svg content begins -->...<!-- (trimmed) full top-right-new.svg content ends -->
    top_right_pattern = r'<!-- \(trimmed\) full top-right-new\.svg content begins -->.*?<!-- \(trimmed\) full top-right-new\.svg content ends -->'
    top_right_replacement = f'<!-- Full top-right-new.svg content begins -->\n    {top_right_inner}\n    <!-- Full top-right-new.svg content ends -->'
    html_content = re.sub(top_right_pattern, top_right_replacement, html_content, flags=re.DOTALL)
    
    # Replace bottom-left SVG content
    bottom_left_pattern = r'<!-- \(trimmed\) full bottom-left-new\.svg content begins -->.*?<!-- \(trimmed\) full bottom-left-new\.svg content ends -->'
    bottom_left_replacement = f'<!-- Full bottom-left-new.svg content begins -->\n    {bottom_left_inner}\n    <!-- Full bottom-left-new.svg content ends -->'
    html_content = re.sub(bottom_left_pattern, bottom_left_replacement, html_content, flags=re.DOTALL)
    
    # Write back the HTML file
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print(f"✓ Successfully inlined SVG content in {html_path.name}")
    return True

def main():
    # Define paths
    base_path = Path(__file__).parent
    top_right_svg = base_path / 'assets' / 'svg' / 'top-right-new.svg'
    bottom_left_svg = base_path / 'assets' / 'svg' / 'bottom-left-new.svg'
    hero1_html = base_path / 'hero1.html'
    hero3_html = base_path / 'hero3.html'
    
    # Verify files exist
    for filepath in [top_right_svg, bottom_left_svg, hero1_html, hero3_html]:
        if not filepath.exists():
            print(f"Error: {filepath} not found")
            return 1
    
    print("Starting SVG inlining process...")
    print(f"Top-right SVG: {top_right_svg}")
    print(f"Bottom-left SVG: {bottom_left_svg}")
    print()
    
    # Inline SVGs in hero1.html
    success1 = inline_svgs_in_html(hero1_html, top_right_svg, bottom_left_svg)
    
    # Inline SVGs in hero3.html
    success2 = inline_svgs_in_html(hero3_html, top_right_svg, bottom_left_svg)
    
    if success1 and success2:
        print()
        print("=" * 60)
        print("✓ All SVGs successfully inlined!")
        print("=" * 60)
        print()
        print("Next steps:")
        print("1. Open hero1.html or hero3.html in your browser")
        print("2. Check console for 'GSAP breathing animation initialized'")
        print("3. Verify smooth per-circle breathing animation")
        return 0
    else:
        print("✗ Some operations failed")
        return 1

if __name__ == '__main__':
    exit(main())
