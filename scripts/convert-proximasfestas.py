#!/usr/bin/env python3
import pandas as pd
import json

# Ler planilha
df = pd.read_excel('/home/ubuntu/upload/Próximasfestas.xlsx', sheet_name='Próximas Festas', skiprows=2)

# Remover linhas vazias
df = df.dropna(subset=['Código'])

# Converter para lista de dicionários
festas = []
for _, row in df.iterrows():
    festa = {
        'codigo': str(row['Código']) if pd.notna(row['Código']) else '',
        'cliente': str(row['Cliente']) if pd.notna(row['Cliente']) else '',
        'data_fechamento': str(row['Data de Fechamento']) if pd.notna(row['Data de Fechamento']) else '',
        'data_festa': str(row['Data da Festa']) if pd.notna(row['Data da Festa']) else '',
        'valor_festa': float(row['Valor da Festa']) if pd.notna(row['Valor da Festa']) else 0,
        'valor_recebido': float(row['Valor Recebido']) if pd.notna(row['Valor Recebido']) else 0,
        'convidados': int(row['Convidados']) if pd.notna(row['Convidados']) else 0,
        'telefone': str(row['Telefone']) if pd.notna(row['Telefone']) else ''
    }
    festas.append(festa)

# Salvar em JSON
with open('/home/ubuntu/festeja-kids-2/scripts/proximasfestas.json', 'w', encoding='utf-8') as f:
    json.dump(festas, f, ensure_ascii=False, indent=2)

print(f"✅ {len(festas)} festas convertidas para JSON")
