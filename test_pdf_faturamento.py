import PyPDF2
import sys

def get_last_page_text(path):
    with open(path, "rb") as f:
        reader = PyPDF2.PdfReader(f)
        last_page = reader.pages[-1]
        text = last_page.extract_text()
        
        print("--- EXTRACTED TEXT FATURAMENTO ---")
        print(text)
        
get_last_page_text("planilhas/faturamentoecrescimento.pdf")
