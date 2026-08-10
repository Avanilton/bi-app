import PyPDF2
import re
import json

path = r"C:\Users\Administrador\.gemini\antigravity-ide\brain\15af35e7-575c-457c-bdd6-4178cc503d92\media__1786042133021.pdf"
boleto_ids = set()

# Pattern: idBoleto is a large number at start of line followed by date (dd/mm/yyyy)
boleto_pattern = re.compile(r'^(\d{5,8})\s+\d{2}/\d{2}/\d{4}', re.MULTILINE)

with open(path, "rb") as f:
    reader = PyPDF2.PdfReader(f)
    print(f"Total pages: {len(reader.pages)}")
    for i, page in enumerate(reader.pages):
        text = page.extract_text()
        for match in boleto_pattern.finditer(text):
            boleto_ids.add(int(match.group(1)))

print(f"Extracted {len(boleto_ids)} unique boleto IDs from PDF")
print("Sample:", list(boleto_ids)[:10])

with open("pdf_boletos.json", "w") as out:
    json.dump(list(boleto_ids), out)
