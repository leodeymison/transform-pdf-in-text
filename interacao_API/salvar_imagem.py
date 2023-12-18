import requests

url = "https://jfconcursos.com/painel_adm/cadastro_questao/dev/salvar_img_dev.php"
#url = "http://localhost/sistema-jfconcursos/painel_adm/cadastro_questao/dev/salvar_img_dev.php"


caminho_da_imagem = "img1.jpg"

# Abra a imagem e leia seu conteúdo em binário
with open(caminho_da_imagem, "rb") as arquivo_imagem:
    dados_imagem = arquivo_imagem.read()

# Crie um dicionário com os dados da imagem para enviar como payload
payload = {
    "arquivo": ("nome_prova-ano-numero_questao-numero_imagem.jpg", dados_imagem)
}
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
    "Referer": "https://www.google.com/",  # Um URL referenciando um site conhecido
    "Upgrade-Insecure-Requests": "1",
}
response = requests.post(url, files=payload, headers=headers)

if response.status_code == 200:
    print("Imagem enviada com sucesso!")
else:
    print("Erro ao enviar a imagem. Código de status:", response.status_code)
    print(response.text)
