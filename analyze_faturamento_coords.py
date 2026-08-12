import pdfplumber

def get_columns():
    with pdfplumber.open("planilhas/faturamentoecrescimento.pdf") as pdf:
        first_page = pdf.pages[0]
        words = first_page.extract_words()
        
        headers = {}
        for w in words:
            text = w['text']
            if text in ['Adicional', 'Serviço', 'Antecipado', 'Antecipação', 'Perda', 'IR', 'CSLL', 'Cofins', 'Pis']:
                headers[text] = (w['x0'], w['x1'])
                
        print("HEADERS X-COORDS:", headers)
        
        last_page = pdf.pages[-1]
        last_words = last_page.extract_words()
        
        # The total row is at the very bottom (max y0/bottom)
        # find the bottom-most words that start with "R$" or contain numbers
        # Sort words by bottom, descending
        # Actually just print all words on the last page that are at the same Y as the max Y of "R$"
        r_words = [w for w in last_words if "R$" in w['text'] or w['text'].replace(',','').replace('.','').isdigit()]
        r_words.sort(key=lambda w: w['top'])
        
        # the total row is the last row of numbers
        max_top = max([w['top'] for w in r_words])
        total_row = [w for w in r_words if abs(w['top'] - max_top) < 5]
        
        print("TOTAL ROW WORDS:")
        for w in sorted(total_row, key=lambda w: w['x0']):
            print(f"{w['text']:>20}  [X: {w['x0']:.1f} - {w['x1']:.1f}]")
            
if __name__ == "__main__":
    get_columns()
