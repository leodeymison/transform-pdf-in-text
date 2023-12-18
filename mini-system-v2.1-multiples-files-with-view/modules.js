const fs = require('fs');
const pdf = require('pdf-parse');
const readline = require('readline');

function question(prompt) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
      rl.close();
    });
  });
}

const convertePdfForText = async (router) => {
  const dataBuffer = fs.readFileSync(router);
  const data = await pdf(dataBuffer);
  return JSON.stringify(data.text);
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
        text.slice(element + listOfOptions[indexSelect].length - 1, text.length)
      )
    } else {
      listEnd.push(
        text.slice(element + listOfOptions[indexSelect].length - 1, option[index + 1])
      )
    }
  })

  return listEnd
}

const saveInFile = (body, router, json = true) => {
  fs.writeFile(`${__dirname}${router}`,
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
    const content = removeDescriptionInText(
      questions[i], 
      QuestionsInText.format, 
    )

    list.push({
      "numero_questão": i + 1,
      "conteudo_questão": removeTrashText(content),
      "imagens": GetURLInText(content),
      "alternativas": QuestionsInText.options,
      "gabarito": ""
    })
  }

  return list
}

const removeDescriptionInText = (text, primaryQuestion) => {
  return (text.slice(0, text.indexOf(primaryQuestion))).substring(0, 1000)
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
      listEnd.push(removeTrashText(text.slice(element + listOfOptions[indexSelect][0].length, text.length)).substring(0, 300))
    } else {
      listEnd.push(removeTrashText(text.slice(element + listOfOptions[indexSelect][0].length, option[index + 1])).substring(0, 300))
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
    .replace("___", "")
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
      "gabarito": list.indexOf(
        list.includes(responses[index]) ? responses[index] : list[Math.floor(Math.random() * 5)]
      ) 
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

async function Menu(message, options) {
  console.log("==================================");
  console.log(message);
  console.log("==================================");
  options.forEach((element, index) => {
    console.log(`${index}. ${element}`)
  })
  console.log("==================================");
  return await question("> ")
}

async function Input(message) {
  console.log("==================================");
  return await question(message)
}

const GetURLInText = (text) => {
  let list = [];
  let newTextHTTP = text;
  let newTextWWW = text;
  let next1 = true;
  let next2 = true;

  while (next1) {
    const part  = "Disponível em: <"
    const startHTTPS = newTextHTTP.indexOf(part);

    if(startHTTPS !== -1) {
        newTextHTTP = newTextHTTP.slice(startHTTPS + part.length, startHTTPS.length)

        const endHTTPS = newTextHTTP.indexOf(" ") !== -1 ? 
            newTextHTTP.indexOf(" ") : 
            newTextHTTP.length;

        list.push(newTextHTTP.slice(0, endHTTPS))

        newTextHTTP = newTextHTTP.slice(endHTTPS - 1, newTextHTTP.length);
    } else {
        next1 = false;
    }
  }
  

  while (next2) {
    const part  = "Disponível em: < "
      const startWWW = newTextWWW.indexOf(part);

      if(startWWW !== -1) {
          newTextWWW = newTextWWW.slice(startWWW + part.length, startWWW.length);

          const endWWW = newTextWWW.indexOf(" ") !== -1 ? 
            newTextWWW.indexOf(" ") : 
            newTextWWW.length;
          
          const item = newTextWWW.slice(0, endWWW)

          if(
            item.includes("/") && 
            item.includes("\n") === -1 && 
            item.includes("||") === -1
          ) {
              list.push(item)
          }

          newTextWWW = newTextWWW.slice(endWWW - 1, newTextWWW.length);
      } else {
          next2 = false;
      }
  }

  return list
}

module.exports = {
  convertePdfForText,
  getQuestions,
  orderQuestions,
  saveInFile,
  getGabarito,
  addGabaritoInQuestions,
  Menu,
  GetInformationsAboutProva,
  getText,
  getQuestionsMultiples,
  Input,
  GetURLInText
}