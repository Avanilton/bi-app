import pdfplumber

def check_coords():
    with pdfplumber.open("planilhas/faturamentoecrescimento.pdf") as pdf:
        page = pdf.pages[0]
        words = page.extract_words()
        
        lines = {}
        for w in words:
            top = round(w['top'])
            if top not in lines:
                lines[top] = []
            lines[top].append(w)
            
        for top in sorted(lines.keys()):
            if 100 < top < 250:
                print(f"Y={top}")
                for w in sorted(lines[top], key=lambda w: w['x0']):
                    print(f"{w['text']:>15} [X0: {w['x0']:.1f}]")
                print("---")

if __name__ == "__main__":
    check_coords()
