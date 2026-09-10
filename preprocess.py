#!/usr/bin/env python3
"""
Quran PDF Asset Preprocessing Script
====================================
Extracts PDF pages as 100% full, uncropped high-quality WebP images
(page_001.webp through page_XXX.webp).

Dependencies:
    pip install PyMuPDF Pillow

Usage:
    python preprocess.py --pdf "C:\path\to\quran.pdf" --output ./public/pages --quality 85
"""

import os
import sys
import argparse
from PIL import Image

def process_pdf_pymupdf(pdf_path, output_dir, quality=85, dpi=200, page_offset=0):
    """
    Extracts PDF pages using PyMuPDF (fitz) - 100% full page, uncropped.
    """
    import fitz # PyMuPDF
    doc = fitz.open(pdf_path)
    total_pages = len(doc)
    print(f"[PyMuPDF Engine] Successfully opened PDF ({total_pages} total pages).")

    zoom = dpi / 72.0
    matrix = fitz.Matrix(zoom, zoom)

    saved_count = 0
    for idx in range(total_pages):
        # Calculate target page index considering optional front-matter offset
        page_num = idx + 1 - page_offset
        if page_num < 1:
            continue

        page = doc.load_page(idx)
        pix = page.get_pixmap(matrix=matrix)
        
        # Convert pixmap to PIL Image (Full, original page uncropped)
        img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
        
        filename = f"page_{page_num:03d}.webp"
        filepath = os.path.join(output_dir, filename)
        img.save(filepath, "WEBP", quality=quality, optimize=True)
        saved_count += 1
        print(f"[{saved_count}/{total_pages - page_offset}] Saved {filename} ({img.width}x{img.height} px)")

    print(f"\n✨ Successfully exported {saved_count} uncropped page images to {output_dir}")

def process_pdf_fallback(pdf_path, output_dir, quality=85, dpi=200, poppler_path=None, page_offset=0):
    """
    Fallback extraction using pdf2image (uncropped).
    """
    from pdf2image import convert_from_path
    kwargs = {"dpi": dpi}
    if poppler_path:
        kwargs["poppler_path"] = poppler_path

    print(f"[pdf2image Engine] Loading PDF: {pdf_path}...")
    pages = convert_from_path(pdf_path, **kwargs)
    total_pages = len(pages)
    print(f"Extracted {total_pages} pages.")

    saved_count = 0
    for idx, page in enumerate(pages, start=1):
        page_num = idx - page_offset
        if page_num < 1:
            continue

        filename = f"page_{page_num:03d}.webp"
        filepath = os.path.join(output_dir, filename)
        page.save(filepath, "WEBP", quality=quality, optimize=True)
        saved_count += 1
        print(f"[{saved_count}/{total_pages - page_offset}] Saved {filename}")

def main():
    parser = argparse.ArgumentParser(description="Quran PDF Asset Preprocessing Script (Uncropped)")
    parser.add_argument("--pdf", type=str, required=True, help="Path to input Quran PDF file")
    parser.add_argument("--output", type=str, default="./public/pages", help="Output directory for WebP page images")
    parser.add_argument("--quality", type=int, default=85, help="WebP compression quality (1-100, default 85)")
    parser.add_argument("--dpi", type=int, default=200, help="DPI for PDF rendering (default 200)")
    parser.add_argument("--page-offset", type=int, default=0, help="Number of introductory front-matter pages to skip")
    parser.add_argument("--poppler-path", type=str, help="Optional path to Poppler bin directory")
    
    args = parser.parse_args()

    pdf_path = os.path.abspath(args.pdf.strip('"').strip("'"))
    
    if not os.path.isfile(pdf_path):
        print(f"Error: PDF file not found at '{pdf_path}'")
        sys.exit(1)

    os.makedirs(args.output, exist_ok=True)

    try:
        process_pdf_pymupdf(pdf_path, args.output, quality=args.quality, dpi=args.dpi, page_offset=args.page_offset)
    except ImportError:
        print("PyMuPDF not installed. Trying pdf2image...")
        try:
            process_pdf_fallback(pdf_path, args.output, quality=args.quality, dpi=args.dpi, poppler_path=args.poppler_path, page_offset=args.page_offset)
        except Exception as e:
            print(f"Extraction Error: {e}")
            sys.exit(1)

if __name__ == "__main__":
    main()
