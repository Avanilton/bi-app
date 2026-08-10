import PyPDF2
import re

path = r"C:\Users\Administrador\.gemini\antigravity-ide\brain\15af35e7-575c-457c-bdd6-4178cc503d92\media__1786042133021.pdf"

with open(path, "rb") as f:
    reader = PyPDF2.PdfReader(f)
    # Print first 2 pages raw text to understand format
    for i in range(min(2, len(reader.pages))):
        text = reader.pages[i].extract_text()
        print(f"=== PAGE {i+1} ===")
        print(text[:3000])
        print("...")
