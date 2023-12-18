import requests

#url = "https://jfconcursos.com/painel_adm/cadastro_questao/dev/salvar_questao_dev.php"
url = "http://localhost/sistema-jfconcursos/painel_adm/cadastro_questao/dev/salvar_questao_dev.php"


data = {
    "nome_prova": "SERPRO",
    "ano":2015,
    "numero_questao":1,
    "conteudo": "Com base na Lei n.º 5.194/1966, referente à atuação de profissionais e empresas de engenharia no Brasil, julgue os itens subsequentes.",
    "imagens": 0,
    "alternativas": '["51 No caso particular da administração pública, os cargos e funções que exijam conhecimentos de engenharia poderão ser exercidos por quaisquer profissionais, mesmo aqueles que não sejam habilitados de acordo com a Lei n.º 5.194/1966.", "52 O engenheiro estrangeiro que apresentar o currículo e o histórico escolar traduzidos pela embaixada brasileira instalada em seu país de origem estará apto a se registrar em algum Conselho Regional de Engenharia e Agronomia (CREA).", "53 A execução de obras e serviços técnicos pode ser desempenhada tanto por pessoas físicas como por pessoas jurídicas.", "54 A carteira profissional emitida por um Conselho Regional de Engenharia e Agronomia (CREA), para efeitos da Lei n.º 5.194/1966, substitui o diploma de engenheiro."]',
    "gabarito": 1,
    "banca": "CESPE/UnB",
    "orgao": "SERPRO",
    "area": "engenharia_mecânica",
    "escolaridade": "superior"
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





