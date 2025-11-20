#!/usr/bin/env python3
"""
Script para extrair dados dos contratos em PDF e gerar arquivo JSON
para importação no banco de dados.
"""

import os
import re
import json
from pathlib import Path
import subprocess

def extract_text_from_pdf(pdf_path):
    """Extrai texto de um PDF usando pdftotext"""
    try:
        result = subprocess.run(
            ['pdftotext', pdf_path, '-'],
            capture_output=True,
            text=True,
            check=True
        )
        return result.stdout
    except Exception as e:
        print(f"Erro ao extrair {pdf_path}: {e}")
        return ""

def parse_contract(text, filename):
    """Extrai informações estruturadas do contrato"""
    data = {
        'arquivo': filename,
        'nome_cliente': None,
        'cpf': None,
        'telefone': None,
        'data_fechamento': None,
        'data_evento': None,
        'aniversariante': None,
        'tema': None,
        'numero_convidados': None,
        'horario': None,
        'valor_total': None,
    }
    
    # Extrair nome do cliente
    match = re.search(r'NOME:\s*(.+?)(?:\n|CPF)', text, re.IGNORECASE)
    if match:
        data['nome_cliente'] = match.group(1).strip()
    
    # Extrair CPF
    match = re.search(r'CPF:\s*([\d\.\-/]+)', text, re.IGNORECASE)
    if match:
        data['cpf'] = match.group(1).strip()
    
    # Extrair telefone
    match = re.search(r'TEL:\s*([\d\s/]+)', text, re.IGNORECASE)
    if match:
        telefone = match.group(1).strip().replace(' ', '').replace('//', '/')
        # Pegar primeiro telefone
        data['telefone'] = telefone.split('/')[0] if '/' in telefone else telefone
    
    # Extrair data de fechamento
    match = re.search(r'DATA DO FECHAMENTO:\s*(\d{2}/\d{2}/\d{4})', text, re.IGNORECASE)
    if match:
        data['data_fechamento'] = match.group(1)
    
    # Extrair data do evento
    match = re.search(r'DATA DO EVENTO:\s*(\d{2}/\d{2}/\d{4})', text, re.IGNORECASE)
    if match:
        data['data_evento'] = match.group(1)
    
    # Se não encontrou data do evento, tentar extrair do nome do arquivo
    if not data['data_evento']:
        # Formato: "Nome DDMMYY.pdf"
        match = re.search(r'(\d{6})\.pdf$', filename)
        if match:
            date_str = match.group(1)
            day = date_str[0:2]
            month = date_str[2:4]
            year = date_str[4:6]
            # Determinar século baseado no ano
            if int(year) >= 25:
                full_year = f"20{year}"
            else:
                full_year = f"20{year}"
            data['data_evento'] = f"{day}/{month}/{full_year}"
    
    # Extrair aniversariante
    match = re.search(r'ANIVERSARIANTE:\s*(.+?)(?:\n|\.)', text, re.IGNORECASE)
    if match:
        data['aniversariante'] = match.group(1).strip()
    
    # Extrair tema
    match = re.search(r'TEMA:\s*(.+?)(?:\n)', text, re.IGNORECASE)
    if match:
        data['tema'] = match.group(1).strip()
    
    # Extrair número de convidados
    match = re.search(r'NÚMERO DE CONVIDADOS:\s*(\d+)\+?(\d+)?', text, re.IGNORECASE)
    if match:
        base = int(match.group(1))
        extra = int(match.group(2)) if match.group(2) else 0
        data['numero_convidados'] = base + extra
    
    # Extrair horário
    match = re.search(r'(\d{1,2}h)\s*(?:as|às)\s*(\d{1,2}h)', text, re.IGNORECASE)
    if match:
        data['horario'] = f"{match.group(1)} às {match.group(2)}"
    
    # Extrair valor total
    match = re.search(r'Valor integral.*?:\s*R?\$?\s*([\d\.,]+)', text, re.IGNORECASE)
    if match:
        valor_str = match.group(1).replace('.', '').replace(',', '.')
        try:
            data['valor_total'] = float(valor_str)
        except:
            pass
    
    return data

def process_directory(base_path, output_file):
    """Processa todos os PDFs em um diretório"""
    contracts = []
    
    # Encontrar todos os PDFs
    pdf_files = list(Path(base_path).rglob("*.pdf"))
    
    print(f"Encontrados {len(pdf_files)} arquivos PDF")
    
    for pdf_file in pdf_files:
        # Filtrar apenas PDFs de 2025 e 2026 (festas futuras)
        path_str = str(pdf_file)
        
        # Pular PDFs de 2024 (já importados)
        if '24pfd' in path_str or '24pdf' in path_str or 'Abril 24' in path_str:
            continue
        
        print(f"Processando: {pdf_file.name}")
        
        text = extract_text_from_pdf(str(pdf_file))
        if text:
            contract_data = parse_contract(text, pdf_file.name)
            
            # Validar se tem dados mínimos
            if contract_data['nome_cliente'] and contract_data['data_evento']:
                contracts.append(contract_data)
                print(f"  ✓ {contract_data['nome_cliente']} - {contract_data['data_evento']}")
            else:
                print(f"  ⚠ Dados incompletos")
    
    # Salvar em JSON
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(contracts, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ {len(contracts)} contratos extraídos e salvos em {output_file}")
    return contracts

if __name__ == "__main__":
    base_path = "/home/ubuntu/upload"
    output_file = "/home/ubuntu/festeja-kids-2/scripts/contratos_extraidos.json"
    
    contracts = process_directory(base_path, output_file)
    
    # Estatísticas
    print("\n📊 Estatísticas:")
    print(f"Total de contratos: {len(contracts)}")
    
    # Agrupar por mês
    from collections import defaultdict
    by_month = defaultdict(int)
    
    for contract in contracts:
        if contract['data_evento']:
            month = contract['data_evento'].split('/')[1]
            year = contract['data_evento'].split('/')[2]
            by_month[f"{month}/{year}"] += 1
    
    print("\nPor mês:")
    for month, count in sorted(by_month.items()):
        print(f"  {month}: {count} festas")
