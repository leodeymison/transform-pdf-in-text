const { exec } = require('child_process');
const { GetFileRecursive, GetFile, verifyIdExistFileInRes } = require("./new")
const path = require('path');
const fs = require('fs');
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
    Input,
} = require("./modules.js");

(async () => {
    const resAllFiles = GetFileRecursive("./data1");
    let destinoFiles = GetFile("./res")

    for (let i = 0; i < resAllFiles.length; i++) {
        destinoFiles = GetFile("./res")

        const verifyIdExist = verifyIdExistFileInRes(resAllFiles[i], destinoFiles);
        if(!verifyIdExist) {
            if(resAllFiles[i].length >= 3) {
                console.log(`Quantidade: ${i}/${resAllFiles.length} = ${((i * 100) / resAllFiles.length).toFixed(1)}%`)
                // ! Selecionar manuamente quando for maior que 3 arquivos e não tiver 
                // ! em uma arquivo o nome gaba*
                const inputResponse = parseInt(await Menu("Defina qual arquivo é o das questões", resAllFiles[i]))
                const fileName = `${destinoFiles.length + 1}.${resAllFiles[i][inputResponse].replace(/ - /gi, "-").replace(/ /gi, "-").replace(/\//gi, "-")}`;
                
                await new Promise((resolve, reject) => {
                    exec(`xdg-open "${resAllFiles[i][inputResponse]}"`, (err) => {
                      if (err) {
                        reject(err);
                        return;
                      }
                      resolve('Arquivo PDF aberto com sucesso');
                    });
                });
                
                // ! Descobrir a quantidade de questão
                const quantQuestions = parseInt(await Input("Quantidade de questões: "))
                // ! Deixa sem 0 como padrão
                const start0Questions = await Input("9 a 10 inicia em 0[s/n]: ")
                
                // ? Convertendo o pdf da prova em texto
                const responseText = await convertePdfForText(resAllFiles[i][inputResponse]);
    
                // ? Separando questões
                const responseQuestion = getQuestionsMultiples(responseText, quantQuestions, start0Questions)
    
                // ? Ordena questões em json
                const orderQuest = orderQuestions(responseQuestion);
                
                // ! Encontrar o arquivo de baga, se tiver mais de um selecionar
                const inputResponseGaba = parseInt(
                    await Menu("Defina qual o arquivo do gabarito", resAllFiles[i])
                )
                await new Promise((resolve, reject) => {
                    exec(`xdg-open "${resAllFiles[i][inputResponseGaba]}"`, (err) => {
                      if (err) {
                        reject(err);
                        return;
                      }
                      resolve('Arquivo PDF aberto com sucesso');
                    });
                });
                
                const positionGabarito = parseInt(await Input("Posição do gabarito: ")) - 1

                // ! deixar como padrão o sem 0 no início
                const start0Gabarito = parseInt(await Input("9 a 10 inicia em 0[s/n]: "))
                    
                // ? Convertendo o pdf do gabarito em texto
                const gabaritoText = await convertePdfForText(resAllFiles[i][inputResponseGaba]);
    
                // ? Pegando dados da prova para ajuste
                const gabaritosList = await getGabarito(
                    gabaritoText, 
                    start0Gabarito,
                    quantQuestions,
                    positionGabarito
                );
    
                // ? Adicionando gabarito
                const questionEnd = addGabaritoInQuestions(orderQuest, gabaritosList)
                
                // ? Pegando dados da prova para ajuste
                let modelDatas = {};

                for(let item of resAllFiles[i]){
                    if(item.includes(".txt")) {
                        const textAbout = getText(item)
                        modelDatas = GetInformationsAboutProva(textAbout);
                    }
                }
                
                const model = {
                    ...modelDatas,
                    "questoes": questionEnd
                }
    
                // Salvando na pasta res
                saveInFile(model, fileName)

                const pathInputResponseGaba = resAllFiles[i][inputResponseGaba];
                const pathInputQuestion = resAllFiles[i][inputResponse]
                const nomeGaba = path.basename(pathInputResponseGaba);
                const nomeQuestion = path.basename(pathInputQuestion);
                const filePathDestinoGaba = path.join("./res", `${destinoFiles.length + 1}.${nomeGaba}`);
                const filePathDestinoQuestion = path.join("./res", `${destinoFiles.length + 1}.${nomeQuestion}`);

                fs.rename(pathInputResponseGaba, filePathDestinoGaba, err => {
                    if (err) console.error('Erro ao mover o arquivo gabarito:', err);
                });
                fs.rename(pathInputQuestion, filePathDestinoQuestion, err => {
                    if (err) console.error('Erro ao mover o arquivo questão:', err);
                });
                console.clear();
                console.log("\u001b[32mProva salva com sucesso!\u001b[37m")
            }
        }
    }
})()