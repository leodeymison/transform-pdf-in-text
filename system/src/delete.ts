import axios from "axios";

const startPushDatabase = async (
    id: number,
) => {
    try {
        const { data } = await axios.post(
            "https://jfconcursos.com/painel_adm/cadastro_questao/dev/excluir_dev.php",
            {
                id
            },
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
        console.log(data)
    } catch (error) {
        console.log(error)
    }
}

startPushDatabase(19)
startPushDatabase(20)