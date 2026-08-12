import pdfplumber
import sys

def analyze():
    with pdfplumber.open("planilhas/faturamentoecrescimento.pdf") as pdf:
        last_page = pdf.pages[-1]
        tables = last_page.extract_tables()
        print("TABLES:", tables)
        text = last_page.extract_text()
        print("TEXT:", text.split('\n')[-3:])

if __name__ == "__main__":
    analyze()
