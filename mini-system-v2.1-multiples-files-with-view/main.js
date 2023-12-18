const { GetFileRecursive, GetFile, verifyIdExistFileInRes, existGabarito, existProva } = require("./new")
const { 
    convertePdfForText, 
    orderQuestions, 
    saveInFile, 
    getGabarito, 
    addGabaritoInQuestions,
    Menu,
    GetInformationsAboutProva,
    getText,
    getQuestionsMultiples,
    GetURLInText,
} = require("./modules.js");
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
function delay(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
}



(async () => {
    try {
        const resAllFiles = GetFileRecursive("./data2");
        let destinoFiles = GetFile("./res")

        for (let i = 0; i < resAllFiles.length; i++) {
            destinoFiles = GetFile("./res")

            const verifyIdExist = verifyIdExistFileInRes(resAllFiles[i], destinoFiles);
            if(!verifyIdExist) {
                if(resAllFiles[i].length >= 3) {
                    console.log(`Quantidade: ${i}/${resAllFiles.length} = ${((i * 100) / resAllFiles.length).toFixed(1)}%`)
                    
                    const inputResponseGaba = existGabarito(resAllFiles[i])
                    let inputResponse = null
                    if(inputResponseGaba){
                        inputResponse = existProva(resAllFiles[i])
                        let modelDatas = {};
        
                        for(let item of resAllFiles[i]){
                            if(item.includes(".txt")) {
                                const textAbout = getText(item)
                                modelDatas = GetInformationsAboutProva(textAbout);
                            }
                        }
                        if(inputResponse !== "exit" && Object.keys(modelDatas).length !== 0) {
                            if(!inputResponse) {
                                inputResponse = resAllFiles[i][parseInt(
                                    await Menu("Defina qual arquivo é o das questões", resAllFiles[i])
                                )]
                            }
                            let fileName = ""
                            if(inputResponse) {
                                fileName = `${i}.${inputResponse.replace(/ - /gi, "-").replace(/ /gi, "-").replace(/\//gi, "-")}`;
                            }
    
                            const responseText = await convertePdfForText(inputResponse);
                            const responseQuestion = getQuestionsMultiples(responseText);

                            const quantQuestions = responseQuestion.length
                
                            const orderQuest = orderQuestions(responseQuestion);
                            const gabaritoText = await convertePdfForText(inputResponseGaba);
                            const gabaritosList = await getGabarito(
                                gabaritoText, 
                                false,
                                quantQuestions,
                                0
                            );
                
                            const questionEnd = addGabaritoInQuestions(orderQuest, gabaritosList)
                            
                            const model = {
                                ...modelDatas,
                                "questoes": questionEnd
                            }
                            saveInFile(model, `/res/${fileName}.json`)
                            saveInFile(resAllFiles[i].join('\n'), `/res/${fileName}-caminhos.txt`, false)
                            
                            // model.questoes.forEach((element) => {
                            //     console.log(element.imagens)
                            //     if(element.imagens.length > 0){
                            //         saveInFile(element.imagens.join('\n'), `/images/${i}.${element.numero_questão}-${Date.now()}.txt`, false);
                            //     }
                            // });

                            const { stdout, stderr } = await exec(`pdfimages -png './${inputResponse}' ./images/${i}--${Date.now()}`)
                            console.log('Saída do comando:', stdout);
                            console.error('Erro:', stderr);
                            await delay(50);
        
                            console.clear();
                            console.log("\u001b[32mProva salva com sucesso!\u001b[37m");
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.log("Algum erro aconteceu");
        console.log(error)
    }
})()
