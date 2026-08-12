import pdfplumber

def get_total():
    adicional_total = 0.0
    servico_total = 0.0
    
    try:
        with pdfplumber.open("planilhas/faturamentoecrescimento.pdf") as pdf:
            for page in pdf.pages:
                words = page.extract_words()
                
                lines = {}
                for w in words:
                    # Round top to integer to group words on the same line
                    # Using a slightly larger bin (// 3 * 3) to handle slight Y misalignments
                    top = round(w['top'] / 3) * 3
                    if top not in lines:
                        lines[top] = []
                    lines[top].append(w)
                    
                for top, line_words in lines.items():
                    line_text = " ".join([w['text'] for w in line_words])
                    if "Imóvel" in line_text or "Pagina" in line_text or "Quarta-feira" in line_text or "42.280.072" in line_text or "40.031.712" in line_text:
                        continue
                    
                    for w in line_words:
                        text = w['text'].replace('.', '').replace(',', '.')
                        try:
                            val = float(text)
                        except ValueError:
                            continue
                            
                        x0 = w['x0']
                        
                        # Adicional column numbers are between 425 and 495
                        if 425 <= x0 <= 495:
                            adicional_total += val
                        # Serviço column numbers are between 505 and 540
                        elif 505 <= x0 <= 540:
                            servico_total += val
                            
        total_soma = adicional_total + servico_total
        
        # Format as Brazilian Real without symbol: 1.234.567,89
        formatted = f"{total_soma:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
        print(formatted)
        
    except Exception as e:
        print("0,00")

if __name__ == "__main__":
    get_total()
