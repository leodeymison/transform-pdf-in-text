import requests

url = "https://jfconcursos.com/painel_adm/cadastro_questao/dev/excluir_dev.php"
#url = "http://localhost/sistema-jfconcursos/painel_adm/cadastro_questao/dev/excluir_dev.php"


data = {
    "id": 8,   #para excluir a questão
    "nome":  "nome_prova-ano-numero_questao1.jpg"  #para excluir a imagem   (opcional)
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

response = requests.post(url, data=data, headers=headers)

print(response.text)
