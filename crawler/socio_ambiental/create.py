import requests

def get_language_id(language_name):
    """Fetch the language ID from the /linguas endpoint."""
    response = requests.get('http://localhost:8000/linguas')
    if response.status_code == 200:
        linguas = response.json()
        for lingua in linguas:
            if lingua['nome'] == language_name:
                return lingua['id_lingua']
    return None

def send_palavra_data(nome, id_lingua, significado):
    """Send data to the /palavras endpoint."""
    url = f'http://localhost:8000/palavras/{id_lingua}'

    payload = {
        'nome': nome,
        'id_lingua': id_lingua,
        'significado': significado
    }
    
    response = requests.post(url, json=payload)
    
    if response.status_code == 200:
        print(f"Data sent successfully: {response.json()}")
    else:
        print(f"Failed to send data. Status code: {response.status_code}, Response: {response.text}")

def process_file(file_path):
    """Process the input file and send data to the /palavras endpoint."""
    significado = None

    with open(file_path, 'r') as file:
        for line in file:
            line = line.strip()

            if line.startswith("SIGNIFICADO:"):
                significado = line.split(":", 1)[1].strip()
            elif line.startswith("TRONCO:"):
                continue
            elif line.startswith("LINGUAS:"):
                continue
            elif "=" in line:
                language_name = line.split("=", 1)[0].strip()
                language_id = get_language_id(language_name)
                print(language_id)
                word_name = line.split("=", 1)[1].strip()
                
                if language_id and significado:
                    send_palavra_data(word_name, language_id, significado)

file_path = 'output.txt'
process_file(file_path)
