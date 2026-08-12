import pdfplumber
import sys

def sum_columns():
    adicional_total = 0.0
    servico_total = 0.0
    
    with pdfplumber.open("planilhas/faturamentoecrescimento.pdf") as pdf:
        for page in pdf.pages:
            words = page.extract_words()
            
            # We want to match numbers in specific X ranges
            # For "Adicional": X0 around 430-480
            # For "Serviço": X0 around 490-540
            
            # Let's map lines by top
            lines = {}
            for w in words:
                top = round(w['top'])
                if top not in lines:
                    lines[top] = []
                lines[top].append(w)
                
            for top, line_words in lines.items():
                line_text = " ".join([w['text'] for w in line_words])
                # Skip header/footer
                if "Imóvel" in line_text or "Pagina" in line_text or "Quarta-feira" in line_text:
                    continue
                
                # Check each word
                for w in line_words:
                    text = w['text'].replace('.', '').replace(',', '.')
                    # Must be a valid number (skip R$)
                    try:
                        val = float(text)
                    except ValueError:
                        continue
                        
                    x0 = w['x0']
                    
                    # If it's a data row, Adicional is around 450-475
                    if 435 <= x0 <= 475:
                        adicional_total += val
                    # Serviço is around 505-535
                    elif 495 <= x0 <= 535:
                        servico_total += val
                        
    print(f"Adicional Total: {adicional_total}")
    print(f"Serviço Total: {servico_total}")
    print(f"Soma Faturamento: {adicional_total + servico_total}")

if __name__ == "__main__":
    sum_columns()
