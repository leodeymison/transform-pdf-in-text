const { randomUUID } = require("crypto");
const { readFileJson, saveBase64, dowloadImage, getMultiplesIndex, saveInFile } = require("./utils");
const datas = readFileJson("./data");

const baseUrl = "https://jfconcursos.com/imagens_questoes";

(async () => {
    let quantBase64 = 0;
    let quantURL = 0;
    for(let i = 0; i < datas.length; i++) {
        const content = datas[i]['conteudo_questão'];
        const listSrc = getMultiplesIndex(content, "src=");
        let contentCurrent = datas[i]['conteudo_questão'];
        if(listSrc.length){
            for(let i2 = 0; i2 < listSrc.length; i2++) {
                const nextStart = content.slice(listSrc[i2], content.length);
                
                const aspasStart = nextStart.indexOf('\"');
                const aspasEnd = nextStart.indexOf('\"', aspasStart + 1);
                const fileUrlOrBase64 = nextStart.slice(aspasStart + 1, aspasEnd);
                if(fileUrlOrBase64.includes("data:image/png;base64")){
                    const nameFile = randomUUID();
                    const nameImage = `${datas[i]["numero_questão"]}-${i2 + 1}.${nameFile}.png`
                    saveBase64(fileUrlOrBase64, `./images/${nameImage}.png`);
                    contentCurrent = contentCurrent.replace(fileUrlOrBase64, `${baseUrl}/${nameImage}`);
                    ++quantBase64;
                    console.log(`${datas[i]["numero_questão"]}-${i2 + 1}.${nameImage}`);
                } else {
                    const nameImage = await dowloadImage(fileUrlOrBase64, "./images", `${datas[i]["numero_questão"]}-${i2 + 1}`);
                    contentCurrent = contentCurrent.replace(fileUrlOrBase64, `${baseUrl}/${nameImage}`)
                    ++quantURL;
                    console.log(`${datas[i]["numero_questão"]}-${i2 + 1}.${nameImage}`);
                }
            }
        }

        saveInFile({
            ...datas[i],
            "conteudo_questão": contentCurrent
        }, `./res/${datas[i]["numero_questão"]}.question.json`, true)

    };
    console.log(`Base 64: ${quantBase64} imagens baixadas!`);
    console.log(`URL: ${quantURL} imagens baixadas!`);
    console.log(`Total: ${quantBase64 + quantURL} imagens baixadas!`);
})()