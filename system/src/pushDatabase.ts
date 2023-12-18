import axios from "axios";

type ListQuestionType = {
    nome_prova: string;
    ano: number;
    numero_questao: number
    conteudo: string
    imagens: number;
    alternativas: string;
    gabarito: number;
    banca: string;
    orgao: string;
    area: string;
    escolaridade: string;
}
export const startPushDatabase = async (
    body: ListQuestionType,
) => {
    return await axios.post(
        "https://jfconcursos.com/painel_adm/cadastro_questao/dev/salvar_questao_dev.php",
        body,
        {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.9",
                "Accept-Encoding": "gzip, deflate, br",
                "Connection": "keep-alive",
                "Referer": "https://www.google.com/",
                "Upgrade-Insecure-Requests": "1",
            }
        }
    )
}
