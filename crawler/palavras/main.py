from numpy.core.numeric import NaN
import pandas as pd
import requests
import json

HOST = "http://localhost:8000"

csv = pd.read_csv('palavras_anari.csv')
index = list(csv.columns)[1:]
familias = requests.get(f"{HOST}/familias").json()
linguas = requests.get(f"{HOST}/linguas").json()
palavras = csv['Palavra em Português']
print(palavras)
for i in index:
    id_lingua = None
    id_familia = None
    lingua, familia = i.split('/')
    if(len(familia)>0):
        for familia in familias:
            if(familia['nome'] == familia):
                id_familia = familia['id_familia']
        if(not id_familia):
            create_familia = requests.post(f"{HOST}/familia", data=json.dumps({'nome': familia}), headers={'content-type': 'application/json'})
            id_familia = create_familia.json()['id_familia']
    for l in linguas:
        if l['nome'] == lingua:
            id_lingua = l['id_lingua']
    if(not id_lingua):
        create_lingua = requests.post(f"{HOST}/lingua", data=json.dumps({'nome': lingua, 'id_familia': id_familia}), headers={'content-type': 'application/json'}).json()
        id_lingua = create_lingua['id_lingua']
    row = 0
    for palavra in palavras:
        all_palavras = palavra.split(', ')
        print(all_palavras)
        for palavra in all_palavras:
            if(type(palavra)==str and type(csv[i][row])==str):
                palavra_response = requests.post(f"{HOST}/palavra/{id_lingua}", data=json.dumps({'nome': csv[i][row].lower().strip(), 'significado': palavra.lower().strip()}), headers={'content-type': 'application/json'})
                print(palavra_response.text)
        row+=1