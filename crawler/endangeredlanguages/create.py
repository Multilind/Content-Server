import requests

def parse_lingua_data(lines):
    lingua = {}
    for line in lines:
        if line.startswith("LINGUA:"):
            if lingua:  # If there is already a lingua, yield it before starting a new one
                yield lingua
                lingua = {}
            lingua["nome"] = line.split(":", 1)[1].strip()
        elif line.startswith("TAMBÉM CONHECIDA COMO:"):
            # Join the alternative names into a single string
            lingua["nomes_alternativos"] = line.split(":", 1)[1].strip()
        elif line.startswith("POSICAO GEOGRAFICA:"):
            posicao = line.split(":", 1)[1].strip()
            if posicao == "INVALIDA OU INDISPONIVEL":
                lingua["latitude"] = None
                lingua["longitude"] = None
            else:
                latitude, longitude = posicao.split()
                lingua["latitude"] = float(latitude)  # Convert latitude to float
                lingua["longitude"] = float(longitude)  # Convert longitude to float

    if lingua:  # Yield the last collected lingua if there is one
        yield lingua

def main():
    with open('output.txt', 'r') as file:
        lines = file.readlines()

    for lingua_data in parse_lingua_data(lines):
        # 1. Add a new lingua
        lingua_payload = {
            "nome": lingua_data["nome"],
            "nomes_alternativos": lingua_data.get("nomes_alternativos", "")
        }

        lingua_response = requests.post('http://localhost:8000/linguas', json=lingua_payload)
        print('Lingua Response:', lingua_response.json())

        # 2. Add a new localidade if latitude and longitude are valid
        if lingua_data.get("latitude") is not None and lingua_data.get("longitude") is not None:
            localidade_payload = {
                "latitude": lingua_data["latitude"],
                "longitude": lingua_data["longitude"]
            }

            localidade_response = requests.post('http://localhost:8000/localidades', json=localidade_payload)
            print('Localidade Response:', localidade_response.json())

            # 3. Connect a lingua with a localidade
            id_lingua = lingua_response.json().get('id')  # Get the ID of the created lingua
            id_localidade = localidade_response.json().get('id')  # Get the ID of the created localidade

            if id_lingua and id_localidade:
                idioma_payload = {
                    "id_localidade": id_localidade,
                    "id_lingua": id_lingua
                }

                idioma_response = requests.post('http://localhost:8000/idiomas', json=idioma_payload)
                print('Idioma Response:', idioma_response.json())
            else:
                print('Error: Could not get IDs from responses.')
        else:
            print(f"Skipping localidade for '{lingua_data['nome']}': POSICAO GEOGRAFICA INVALIDA OU INDISPONIVEL")

if __name__ == "__main__":
    main()
