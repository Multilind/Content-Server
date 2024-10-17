from datetime import time
from bs4 import BeautifulSoup
from selenium import webdriver
import os
import time
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service 
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import re
import requests
import json

def create_browser():
    chrome_options = webdriver.ChromeOptions()
    # Commented out the line for headless mode for debugging
    # chrome_options.add_argument('--headless')  # Run without headless mode for testing
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")  # Bypass OS security model
    chrome_options.add_argument("--disable-dev-shm-usage")  # Overcome limited resource problems
    #chrome_options.add_argument("--shm-size=1024m")

    chrome_options.add_experimental_option("prefs", {
        "download.default_directory": os.path.abspath(os.path.curdir) + "/downloads",
        "download.directory_upgrade": True,
        "safebrowsing.enabled": True
    })

    # Use the Service class and pass it to webdriver.Chrome
    service = Service(ChromeDriverManager().install())
    browser = webdriver.Chrome(service=service, options=chrome_options)
    
    return browser

HOST = "http://localhost:8000"

main_url = "http://sii.funai.gov.br/funai_sii/index.wsp"
saiba_mais_url = "informacoes_indigenas/visao/visao_povos_indigenas.wsp"

# Create the browser
browser = create_browser()
browser.set_window_size(1440,900)

# Load the main page
browser.get(main_url)

# Use WebDriverWait to ensure the element is loaded before trying to click it
wait = WebDriverWait(browser, 10)

try:
    # Wait for the "saiba mais" link to be available and click it
    element = wait.until(EC.presence_of_element_located((By.XPATH, f'//a[@href="{saiba_mais_url}"]')))
    element.click()

    # Proceed with the rest of your scraping logic
    browser.find_element(By.XPATH, '//area[@mapaimagem="Todos.jpg"]').click()
    time.sleep(5)

    # Collecting links
    links = browser.find_elements(By.XPATH, '//td[@title="Clique aqui para obter informações sobre respectiva Etnia"]')
    ids_funai = []
    
    # Extracting Funai IDs
    for link in links:
        funai_id = re.match(r"povos\((\d+)\);", link.get_attribute('onclick')).group(1)
        # print(funai_id)
        ids_funai.append(funai_id)
    
    ids_funai = list(dict.fromkeys(ids_funai))

    for funai_id in ids_funai:
        # Navigating to the etnia page
        etnia_url = f"http://sii.funai.gov.br/funai_sii/informacoes_indigenas/visao/povos_indigenas.wsp?tmp.edt.etnia_codigo={funai_id}"
        browser.get(etnia_url)
        time.sleep(1)

        # Regex for etnia and language family
        etnia_regex = r"<td>\n+\s+([A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ\s´^~äëïöüÄËÏÖÜ-]+)\n+\s+<\/td>"
        lingua_familia_regex = r'<td valign=\"top\">([A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ-]+)<\/td>'

        # Extracting data
        etnia = re.search(etnia_regex, browser.page_source).group(1) if re.search(etnia_regex, browser.page_source) else None
        lingua_familia_familia = re.findall(lingua_familia_regex, browser.page_source)

        # Handling language and family data
        lingua_name = lingua_familia_familia[0] if len(lingua_familia_familia) > 0 else None
        familia_name = lingua_familia_familia[1] if len(lingua_familia_familia) > 1 else None

        # API calls for data processing
        familias = requests.get(f"{HOST}/familias").json()
        familia_escolhido = familia_name if familia_name else None
        id_familia = None
        id_lingua = None
        print(f'Família: {familia_escolhido}')

        if familia_escolhido:
            for familia in familias:
                if familia['nome'] == familia_escolhido:
                    id_familia = familia['id_familia']
            if not id_familia:
                create_familia = requests.post(f"{HOST}/familias", data=json.dumps({'nome': familia_escolhido}), headers={'content-type': 'application/json'})
                if create_familia.status_code == 200 and 'id_familia' in create_familia.json():
                    id_familia = create_familia.json()['id_familia']
                else:
                    # Print the response for debugging
                    print(f"Error: {create_familia.status_code}")
                    print(f"Response: {create_familia.text}")
                    # Optional: handle specific validation error
                    if create_familia.status_code == 400:  # Assuming 400 for validation errors
                        print(f"Validation error: {create_familia.json().get('error')}")

        print(f'ID Funai: {funai_id}')
        print(f'Etnia: {etnia}')

        if not etnia:
            print('#######################ETNIA NÃO ENCONTRADA#####################')

        print(f'Língua: {lingua_name}')

        if lingua_name != 'Desconhecida':
            linguas = requests.get(f"{HOST}/linguas").json()
            for lingua in linguas:
                if lingua['nome'] == lingua_name:
                    id_lingua = lingua['id_lingua']

            if not id_lingua:
                create_lingua = requests.post(f"{HOST}/linguas", data=json.dumps({'nome': lingua_name, 'id_familia': id_familia}), headers={'content-type': 'application/json'})
                id_lingua = create_lingua.json()['id_lingua']
                print(create_lingua.text)

        create_etnia = requests.post(f"{HOST}/etnia", data=json.dumps({'nome': etnia}), headers={'content-type': 'application/json'})
        print(create_etnia.text)

        try:
            id_etnia = create_etnia.json()['id_etnia']
            if id_etnia and id_lingua:
                create_dialeto = requests.post(f"{HOST}/dialeto", data=json.dumps({'id_etnia': id_etnia, 'id_lingua': id_lingua}), headers={'content-type': 'application/json'})
                print(create_dialeto.text)
        except:
            pass

finally:
    # Close the browser after execution
    browser.quit()
