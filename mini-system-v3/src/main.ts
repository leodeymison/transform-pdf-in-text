import { ChatGPTUnofficialProxyAPI } from "chatgpt";

(async () => {
    const api = new ChatGPTUnofficialProxyAPI({
        accessToken: "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"
    })

    const res = await api.sendMessage('Hello World!')
    console.log(res.text)

    // const resAllFiles = GetFileRecursive("./data1");

    // for (let i = 0; i < resAllFiles.length; i++) {
    //     if(resAllFiles[i].length >= 3) {

    //         const inputResponse = parseInt(await Menu("Defina qual arquivo é o das questões", resAllFiles[i]))
    //         const fileName = `${i + 1}.${resAllFiles[i][inputResponse].replace(/ - /gi, "-").replace(/ /gi, "-").replace(/\//gi, "-")}`;

    //         const responseText = await convertePdfForText(resAllFiles[i][inputResponse]);

    //         saveInFile(model, fileName)
    //     }
    // }
})()