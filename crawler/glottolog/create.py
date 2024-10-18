import requests

def get_family_id(family_name):
    response = requests.get('http://localhost:8000/familias')
    if response.status_code == 200:
        families = response.json()
        for family in families:
            if family['nome'] == family_name:
                return family['id_familia']
    return None  # Family not found

def create_family(family_name):
    payload = {
        "nome": family_name
    }
    response = requests.post('http://localhost:8000/familias', json=payload)
    if response.status_code == 201:
        return response.json().get('id_familia')
    else:
        print(f"Failed to create family '{family_name}': {response.text}")
        return None  # Failed to create family

def parse_lingua_data(lines):
    lingua = {}
    current_family = None  # Track the current family

    for line in lines:
        if line.startswith("Língua:"):
            if lingua:  # If there is already a lingua, yield it before starting a new one
                yield lingua, current_family
                lingua = {}
            lingua["nome"] = line.split(":", 1)[1].strip()
        elif line.startswith("Posição Geográfica:"):
            posicao = line.split(":", 1)[1].strip()
            latitude, longitude = posicao.split()
            lingua["latitude"] = float(latitude)  # Convert latitude to float
            lingua["longitude"] = float(longitude)  # Convert longitude to float
        elif line.startswith("Familia:"):
            current_family = line.split(":", 1)[1].strip()  # Update the current family

    if lingua:  # Yield the last collected lingua if there is one
        yield lingua, current_family

def main():
    with open('output.txt', 'r') as file:
        lines = file.readlines()

    for lingua_data, current_family in parse_lingua_data(lines):
        # Get or create family ID
        if current_family:
            id_familia = get_family_id(current_family)
            if id_familia is None:
                id_familia = create_family(current_family)

        # Prepare the payload for creating a new lingua
        lingua_payload = {
            "nome": lingua_data["nome"],
        }

        lingua_response = requests.post('http://localhost:8000/linguas', json=lingua_payload)
        print('Lingua Response:', lingua_response.json())

        # Add a new localidade if latitude and longitude are valid
        if 'latitude' in lingua_data and 'longitude' in lingua_data:
            localidade_payload = {
                "latitude": lingua_data["latitude"],
                "longitude": lingua_data["longitude"]
            }

            localidade_response = requests.post('http://localhost:8000/localidades', json=localidade_payload)
            print('Localidade Response:', localidade_response.json())

            # Connect a lingua with a localidade
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
            print(f"Skipping localidade for '{lingua_data['nome']}': POSIÇÃO GEOGRÁFICA INVALIDA OU INDISPONIVEL")

if __name__ == "__main__":
    main()
