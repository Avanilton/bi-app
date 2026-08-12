import PyPDF2
import re
import sys

def get_total():
    try:
        with open("planilhas/recebimentos.pdf", "rb") as f:
            reader = PyPDF2.PdfReader(f)
            last_page = reader.pages[-1]
            text = last_page.extract_text()
            
            match = re.search(r'R\$\s*([\d\.,]+)\s*Qtde:', text)
            if match:
                print(match.group(1).strip())
            else:
                print("0,00")
    except Exception as e:
        print("0,00")

if __name__ == "__main__":
    get_total()
