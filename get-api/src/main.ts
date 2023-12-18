import axios from "axios";
import { saveInFile } from "./models";

const api = axios.create({
   baseURL: "https://www.tecconcursos.com.br/api"
});


(async () => {
    for(let i = 0; i < 1; i++) {
        try {
            // ? Pega questão
            const response = await api.get("/questoes/2/deslogado", {
                headers: {
                    "Date": "Mon, 18 Dec 2023 11:27:28 GMT",
                    "Content-Type": "application/json;charset=UTF-8",
                    "Transfer-Encoding": "chunked",
                    "Connection": "keep-alive",
                    "Set-Cookie": "AWSALB=wi+sfrtRVk5aGREHWJ5lqd3JpzuXsKaJLGug2skb7uqHDRkUzRNJhYat5AH01T7SSnLmYoafM0JBPg8CzuuGyNhRJuWRVQth3Dnf3EAJnx9S8sUWSCETYsTBvtbxxPpKmIzVxFJsU5DdPGzrQB/bsmu23CRO90DHbyvf8ldYjY0JfQE23d3Rw2ahn7H5Sg==; Expires=Mon, 25 Dec 2023 11:38:45 GMT; Path=/ AWSALBCORS=wi+sfrtRVk5aGREHWJ5lqd3JpzuXsKaJLGug2skb7uqHDRkUzRNJhYat5AH01T7SSnLmYoafM0JBPg8CzuuGyNhRJuWRVQth3Dnf3EAJnx9S8sUWSCETYsTBvtbxxPpKmIzVxFJsU5DdPGzrQB/bsmu23CRO90DHbyvf8ldYjY0JfQE23d3Rw2ahn7H5Sg==; Expires=Mon, 25 Dec 2023 11:38:45 GMT; Path=/; SameSite=None; Secure",
                    "Server": "nginx/1.18.0",
                    "Vary": "Accept-Encoding",
                    "Cache-Control": "no-cache",
                    "X-debug-message": "172.30.0.128",
                    "Content-Encoding": "gzip"
                }
            });

            saveInFile(response.data, "/data/file.json", true)
            // ? Ver qual é a certa

            // ? Salvar arquivo
        } catch (error){
            console.log('Error: ', error);
        }
    }
})()

