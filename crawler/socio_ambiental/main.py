from bs4 import BeautifulSoup
import re
import requests
html = requests.get('https://pib.socioambiental.org/pt/L%C3%ADnguas').text
soup = BeautifulSoup(html, 'html.parser')
tables = soup.find_all('table')
for table in tables:
    #capturando o familia
    try:
        familia = re.match(r".*[tT]ronco ([\w\-ê]+)", str(table.caption)).group(1)
    except:
        familia = None
    headers = table.find_all('th')[1:]
    #capturando linguas
    linguas = []
    for header in headers:
        lingua = re.sub(r" (\(família \w+\))", "", header.text)
        linguas.append(lingua)
    linhas = table.find_all('tr')[1:]
    for linha in linhas:
        celulas = linha.find_all('td')
        significado = celulas[0]
        celulas = celulas[1:]
        fix_significado = significado.text.replace('"', ' ')
        fix_significado = re.sub(r" ([\w]+)\s", r"\1 ", fix_significado)
        fix_significado = re.sub(r"\s$", '', fix_significado)
        fix_significado = re.sub(r"\s$", '', fix_significado)
        significados = fix_significado.split(', ')
        for significado in significados:
            print('SIGNIFICADO: '+significado)
            print('TRONCO: '+str(familia))
            print('LINGUAS: ')
            for i in range(0, len(celulas)):
                print(linguas[i] + ' = ' + celulas[i].i.text)