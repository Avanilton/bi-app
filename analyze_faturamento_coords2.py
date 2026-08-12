import pdfplumber

def get_columns():
    with pdfplumber.open("planilhas/faturamentoecrescimento.pdf") as pdf:
        first_page = pdf.pages[0]
        words = first_page.extract_words()
        
        headers = {}
        for w in words:
            text = w['text']
            if text in ['Adicional', 'Serviço', 'Servio', 'Antecipado', 'Antecipação']:
                headers[text] = (w['x0'], w['x1'])
                
        print("HEADERS X-COORDS:", headers)
        
        last_page = pdf.pages[-1]
        last_words = last_page.extract_words()
        
        # We know the total row starts with R$ and has very large numbers.
        # Let's group all words into lines by their 'top' coordinate
        lines = {}
        for w in last_words:
            top = round(w['top'])
            if top not in lines:
                lines[top] = []
            lines[top].append(w)
            
        # Sort lines by top coordinate
        sorted_tops = sorted(lines.keys())
        # Print the last 5 lines
        for top in sorted_tops[-10:]:
            line_words = sorted(lines[top], key=lambda w: w['x0'])
            line_text = " ".join([w['text'] for w in line_words])
            print(f"Y={top}: {line_text}")
            if "40.031" in line_text or "42.280" in line_text:
                for w in line_words:
                    print(f"   {w['text']:>20}  [X: {w['x0']:.1f} - {w['x1']:.1f}]")
            
if __name__ == "__main__":
    get_columns()
