const fs = require('fs');
const pdf = require('pdf-parse');
const path = require('path');

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

function GetFileRecursive(caminhoPasta) {
  const arquivosEncontrados = [];

  function buscarRecursivamente(pasta) {
    const conteudo = fs.readdirSync(pasta);

    conteudo.forEach(item => {
      const itemPath = path.join(pasta, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        buscarRecursivamente(itemPath);
      } else {
        if (!arquivosEncontrados[pasta]) {
          arquivosEncontrados[pasta] = [];
        }
        arquivosEncontrados[pasta].push(itemPath);
      }
    });
  }

  buscarRecursivamente(caminhoPasta);

  // Transforma o objeto em um array de arrays
  return Object.values(arquivosEncontrados);
}
function GetFile(path){
  return fs.readdirSync(path);
}

function verifyIdExistFileInRes(listFile, listFileRes){
  let exist = false;
  listFile.forEach(element => {
    const fileName = `${element.replace(/ - /gi, "-").replace(/ /gi, "-").replace(/\//gi, "-")}.json`;
    listFileRes.forEach(element2 => {
      const fileName2 = element2.substring(element2.indexOf('.') + 1);
      if(fileName === fileName2){
        exist = true
      }
    })
  })
  return exist
}

function existGabarito(fileNames){
  let listGabaritos = []
  fileNames.forEach((element) => {
    if(element.indexOf('gab') !== -1 || element.indexOf('Gab') !== -1) {
      listGabaritos.push(element)
    }
  });
  return listGabaritos[0]
}

function existProva(fileNames){
  let list = [];
  let exist = null
  fileNames.forEach((element) => {
    if(element.indexOf('gab') !== -1 || element.indexOf('Gab') !== -1) {
      list.push(element);
    } else if(element.indexOf('.txt') !== -1) {
      list.push(element);
    } else if(
      element.indexOf('discursiva') !== -1 || 
      element.indexOf('Discursiva') !== -1 || 
      element.indexOf('DISCURSIVA') !== -1 ||
      element.indexOf('disc_') !== -1 || 
      element.indexOf('DISC_') !== -1
    ){
      list.push(element);
    }
  });
  if(list.length === fileNames.length) {
    return "exit"
  }
  if(list.length >= 2) {
    const res = fileNames.filter(item => !list.includes(item) && item);
    return res[0]
  } else {
    return exist
  }
}

const convertePdfForText = async (router) => {
  const dataBuffer = fs.readFileSync(router);
  const data = await pdf(dataBuffer);
  return removeTrashText(JSON.stringify(data.text));
}

const getText = (router) => {
  return fs.readFileSync(router, 'utf8')
}

const getQuestions = (text, questionModel, quantQuestion, provaNum0InSmalls, exceptionsStartQuestions) => {
  let questions = [];

  for(let i = 0; i < quantQuestion; i++) {
    let locationCurrent = 0;
    let locationFuture = locationCurrent + 1;
    
    // Início
    if(exceptionsStartQuestions.filter(item => item.num === (i + 1))[0]){
      const exist = exceptionsStartQuestions.filter(item => item.num === (i + 1))[0].except
      locationCurrent = text.indexOf(exist)
    } else {
      const num = provaNum0InSmalls ? `${i + 1}`.padStart(2, '0') : `${i + 1}`
      const format = questionModel.replace("{n}", num);
      locationCurrent = text.indexOf(format) + format.length;
    }

    // Fim
    if(i !== (quantQuestion - 1)) {
      if(exceptionsStartQuestions.filter(item => item.num === (i + 2))[0]){
        const exist = exceptionsStartQuestions.filter(item => item.num === (i + 2))[0].except
        locationFuture = text.indexOf(exist)
      } else {
        const num = provaNum0InSmalls ? `${i + 2}`.padStart(2, '0') : `${i + 2}`
        const formatFuture = questionModel.replace("{n}", num);
        locationFuture = text.indexOf(formatFuture)
      }
    }

    const save = text.slice(locationCurrent, locationFuture);

    questions.push(save)
  }

  return questions;
}

const getQuestionsMultiples = (text) => {
  const listOfOptions = [
    "{n}. ", "{n} ", "{n} - ", "{n}) ", "Questão {n}", "QUESTÃO {n}"
  ]

  let list = [];

  for(let i1 = 0; i1 < listOfOptions.length; i1++) {
    let cont = true;
    let index = 0;
    while(cont) {
      const numStart = `${index + 1}`.padStart(2, '0')
      const formatStart = listOfOptions[i1].replace("{n}", numStart);
      const locationC = text.indexOf(formatStart);
      if(!list[i1]) {
        list[i1] = []
      }
      if(locationC !== -1) {
        list[i1].push(locationC)
      } else {
        if(index >= 21) {
          cont = false
        } else {
          list[i1].push("")
        }
      }
      ++index;
    }
  }

  let option = [];
  let big = 0;
  let indexSelect = 0;
  list.forEach((element, index) => {
    if(element.filter(item => item && item).length >= big) {
      big = element.length;
      option = element
      indexSelect = index
    }
  })

  let listEnd = []
  option.forEach((element, index) => {
    if((option.length - 1) === index) {
      listEnd.push(
        removeTrashText(
          text.slice(element + listOfOptions[indexSelect].length - 1, text.length)
          .substring(0, 1000)
        )
      )
    } else {
      listEnd.push(
        removeTrashText(
          text.slice(element + listOfOptions[indexSelect].length - 1, option[index + 1])
          .substring(0, 1000)
        )
      )
    }
  })

  return listEnd
}

const saveInFile = (body, name, extension, json = true) => {
  fs.writeFile(`${__dirname}/res/${name}${extension}`,
  json ? JSON.stringify(body, null, 2) : body, 
  (err) => {
    if (err) {
      console.log(err)
    };
  });
}

const orderQuestions = (questions) => {
  let list = [];

  for(let i = 0; i < questions.length; i++) {
    const QuestionsInText = removeQuestionsInText(questions[i]);

    list.push({
      "numero_questão": i + 1,
      "conteudo_questão": removeDescriptionInText(
        questions[i], 
        QuestionsInText.format, 
      ),
      "imagens": [],
      "alternativas": QuestionsInText.options,
      "gabarito": ""
    })
  }

  return list
}

const removeDescriptionInText = (text, primaryQuestion) => {
  return (removeTrashText(text.slice(0, text.indexOf(primaryQuestion)))).substring(0, 1000)
}

const removeQuestionsInText = (text) => {
  const listOfOptions = [
    ['A) ', 'B) ', 'C) ', 'D) ', 'E) '],
    ['a) ', 'b) ', 'c) ', 'd) ', 'e) '],
    ['(A) ', '(B) ', '(C) ', '(D) ', 'E) '],
    ['(a) ', '(b) ', '(c) ', '(d) ', '(e) '],
    ['a. ', 'b. ', 'c. ', 'd. ', 'e. '],
    ['A. ', 'B. ', 'C. ', 'D. ', 'E. '],
    ['A - ', 'b - ', 'c - ', 'd - ', 'e - '],
    ['A - ', 'B - ', 'C - ', 'D - ', 'E - '],
    ['[A] ', '[B] ', '[C] ', '[D] ', '[E] '],
  ]

  let list = [];

  for(let i1 = 0; i1 < listOfOptions.length; i1++) {
    for(let i2 = 0; i2 < listOfOptions[i1].length; i2++) {
      if(!list[i1]) {
        list[i1] = []
      }
      if(text.indexOf(listOfOptions[i1][i2]) !== -1) {
        list[i1].push(text.indexOf(listOfOptions[i1][i2]))
      }
    }
  }

  let option = [];
  let big = 0;
  let indexSelect = 0;
  list.forEach((element, index) => {
    if(element.filter(item => item && item).length >= big) {
      big = element.length;
      option = element
      indexSelect = index
    }
  })

  let listEnd = []
  option.forEach((element, index) => {
    if((option.length - 1) === index) {
      listEnd.push(removeTrashText(text.slice(element + listOfOptions[indexSelect][0].length, text.length).substring(0, 300)))
    } else {
      listEnd.push(removeTrashText(text.slice(element + listOfOptions[indexSelect][0].length, option[index + 1]).substring(0, 300)))
    }
  })
  while (listEnd.length < 5) {
    listEnd.push("Nenhuma opção");
  }
  return {
    format: listOfOptions[indexSelect][0],
    options: listEnd
  }
}

const removeTrashText = (text) => {
  return text.replace(/\\n/g, "")
    .replace(/\s{2,}/g, ' ')
    .replace(/ +\n+ +\n+/g, "")
    .trim();
}

const getGabarito = async (text, gabaritoNum0InSmalls, quantQuestions, positionGabarito) => {
  let list = [];
  
  const modelsGabarito = ["{n} ", "{n} - ", "{n}. "]
  
  for(let i1 = 0; i1 < modelsGabarito.length; i1++){
    
    for(let i2 = 0; i2 < quantQuestions; i2++) {
      const num = gabaritoNum0InSmalls ? `${i2 + 1}`.padStart(2, '0') : `${i2 + 1}`
      const format = modelsGabarito[i1].replace("{n}", num);
      const positions = getAllPositions(text, format);

      if(!list[i1]) list[i1] = [];

      if(positions[positionGabarito]) {
        if(i2 === (modelsGabarito - 1)) { // É o ultimo
          const numNext = gabaritoNum0InSmalls ? `${i2 + 1}`.padStart(2, '0') : `${i2 + 1}`
          const formatNext = modelsGabarito[i1].replace("{n}", numNext);
          const positionsNext = getAllPositions(text, formatNext);

          const textSelect = (text.slice(positions[positionGabarito] + format.length, positionsNext[positionGabarito])).trim()
          list[i1].push(textSelect)
        } else {
          const textSelect = (text.slice(positions[positionGabarito] + format.length, positions[positionGabarito] + format.length + 2)).trim()
          list[i1].push(textSelect)
        }
      } else {
        list[i1].push(undefined)
      }
    }
  }

  let option = [];
  let big = 0;
  list.forEach((element, index) => {
    if(element.filter(item => item && item).length >= big) {
      big = element.length;
      option = element
    }
  })

  return option
}

const addGabaritoInQuestions = (questions, responses) => {
  const list = ["A", "B", "C", "D", "E"]
  if(responses) {
    return questions.map((item, index) => ({
      ...item,
      "gabarito": list.includes(responses[index]) ? responses[index] : list[Math.floor(Math.random() * 5)]
    }))
  } else {
    return questions
  }
}

const GetInformationsAboutProva = (text) => {
  const Cargo = removeTrashText(text.slice(text.indexOf("Cargo:") + 6, text.indexOf("Ano:")))
  const Ano = removeTrashText(text.slice(text.indexOf("Ano:") + 4, text.indexOf("Órgão:")))
  const Orgao = removeTrashText(text.slice(text.indexOf("Órgão:") + 6, text.indexOf("Instituição:")))
  const Instituicao = removeTrashText(text.slice(text.indexOf("Instituição:") + 12, text.indexOf("Nível:")))
  const area = removeTrashText(Cargo.slice(Cargo.indexOf("- ") + 2, Cargo.length))

  return {
    "name_prova": Cargo,
    "ano": Ano,
    "banca": Instituicao,
    "orgão": Orgao,
    "area": area,
    "escolaridade": "Superior",
  }
}

function getAllPositions(text, item) {
  let posicoes = [];
  const regex = new RegExp(item, 'g');
  let resultado;
  
  while ((resultado = regex.exec(text)) !== null) {
    posicoes.push(resultado.index);
  }
  
  return posicoes;
}

const Main = () => {
    const progressbar = document.getElementById("progress_bar_span")
    const progressText = document.getElementById("progress_text")
    document.getElementById("progress").style.display = "flex"
    (async () => {
        try {
            const resAllFiles = GetFileRecursive("./data2");
            let destinoFiles = GetFile("./res")

            for (let i = 0; i < resAllFiles.length; i++) {
                destinoFiles = GetFile("./res")

                const verifyIdExist = verifyIdExistFileInRes(resAllFiles[i], destinoFiles);
                if(!verifyIdExist) {
                    if(resAllFiles[i].length >= 3) {

                        progressbar.style.width = `${((i * 100) / resAllFiles.length).toFixed(1)}%`
                        progressbar.innerHTML = `${((i * 100) / resAllFiles.length).toFixed(1)}%`
                        progressText.innerHTML = `${i}/${resAllFiles.length}`
                        
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
                                saveInFile(model, fileName, ".json")
                                saveInFile(resAllFiles[i].join('\n'), `${fileName}-caminhos`, ".txt", false)
                                await delay(300);
            
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
}

