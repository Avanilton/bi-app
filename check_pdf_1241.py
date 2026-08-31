import re
import mysql.connector

# OCR Text (abridged, just using regex to extract document numbers)
ocr_text = """
179402 - IRAN DA SILVA GOMES - CARTEIRA
Vecto Valor Total
BLOCO 01-101
Documento Ref.
7362020 08/2026 10/08/2026 R$ 359,62 R$ 359,62
Total cliente: R$ 359,62
""" # We will just use the fact that I can fetch it from DB and find the one that doesn't match the sum.

def check_db():
    conn = mysql.connector.connect(
        host="sistemasnovacorp.com.br",
        port=5643,
        user="Intelligence",
        password="@bv2026@",
        database="novacorpconect"
    )
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT idBoleto, total, origem, dataVecto
        FROM TbBoleto
        WHERE idImovel = 1241 
          AND idEmpresa = 75 
          AND pago = 0 
          AND cancelado = 0
          AND (origem IS NULL OR origem NOT IN (3,5))
    """)
    rows = cursor.fetchall()
    
    app_total = 0
    valid_boletos = []
    
    import datetime
    today = datetime.datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    
    for r in rows:
        dt = r['dataVecto']
        if dt and dt < today:
            app_total += float(r['total'])
            valid_boletos.append(r)
            
    print(f"Total in App: {app_total}")
    # Now I will print all valid boletos so I can compare manually, or find subsets summing to ~850.54
    
    print(f"Total boletos no App: {len(valid_boletos)}")
    
    # Let's find single or pairs of boletos summing to ~850.54
    diff = 850.54
    for r in valid_boletos:
        if abs(float(r['total']) - diff) < 0.10:
            print(f"Boleto exato encontrado! idBoleto: {r['idBoleto']} - valor: {r['total']}")
            
    # Pairs
    for i in range(len(valid_boletos)):
        for j in range(i+1, len(valid_boletos)):
            if abs(float(valid_boletos[i]['total']) + float(valid_boletos[j]['total']) - diff) < 0.10:
                print(f"Par encontrado! idBoletos: {valid_boletos[i]['idBoleto']} e {valid_boletos[j]['idBoleto']} - valores: {valid_boletos[i]['total']} e {valid_boletos[j]['total']}")
                
if __name__ == '__main__':
    check_db()
