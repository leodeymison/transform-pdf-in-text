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

const newGetQuestions = (text, questionModel, quantQuestion, provaNum0InSmalls) => {
  let questions = [];

  for(let i = 0; i < quantQuestion; i++) {
    let locationCurrent = undefined
    let locationFuture = -1

    // Início
    const numStart = provaNum0InSmalls ? `${i + 1}`.padStart(2, '0') : `${i + 1}`
    const formatStart = questionModel.replace("{n}", numStart);
    const locationC = text.indexOf(formatStart);
    if(locationC >= 0) {
      locationCurrent = locationC
    }

    // Fim
    if(i !== (quantQuestion - 1)) {
      const numEnd = provaNum0InSmalls ? `${i + 2}`.padStart(2, '0') : `${i + 2}`
      const formatEnd = questionModel.replace("{n}", numEnd);
      const locationF = text.indexOf(formatEnd)
      if(locationF >= 0) {
        locationFuture = locationF
      }
    }
    if(locationCurrent) {
      const save = text.slice(locationCurrent + formatStart.length, locationFuture);
      questions.push(save)
    } else {
      questions.push('')
    }

  }

  return questions;
}

const getQuestionsMultiples = (text, quantQuestions, start0Questions) => {
  let list = [];
  let listEnd = [];
  const startZero = start0Questions === 's' ? true : false
  const listOfQuestions = [
    ["{n}. ", startZero],
    ["{n} ", startZero],
    ["{n} - ", startZero], 
    ["{n}) ", startZero], 
    ["Questão {n}", startZero],  
    ["QUESTÃO {n}", startZero], 
  ]

  for(let i = 0; i < listOfQuestions.length; i++) {
    const res = newGetQuestions(text, listOfQuestions[i][0], quantQuestions, listOfQuestions[i][1]);
    res.forEach((element, index) => {
      if((index + 1) > 9){
        if(!list[i]) list[i] = []
        if(element.length){
          list[i].push("ok")
        }
      }
      if(!listEnd[i]) listEnd[i] = []
      listEnd[i].push(element)
    });
  }
  let bigIndex = 0
  let bigData = 0
  for(let i = 0; i < list.length; i++) {
    if(list[i].length >= bigData) {
      bigIndex = i;
      bigData = list[i].length
    }
  }
  return listEnd[bigIndex]
}

const saveInFile = (body, name) => {
  fs.writeFile(`${__dirname}/res/${name}.json`, JSON.stringify(body, null, 2), (err) => {
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
  return text.slice(0, text.indexOf(primaryQuestion))
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
  ]

  let list = [];
  for(let i1 = 0; i1 < listOfOptions.length; i1++) {
    if(!list[i1]) list[i1] = [];

    for(let i2 = 0; i2 < listOfOptions[i1].length; i2++) {
      let questionOpen = "";
      if((listOfOptions[i1].length - 1) === i2) {
        const start = text.indexOf(listOfOptions[i1][i2]) + listOfOptions[i1][i2].length;
        if(start >= 0) {
          questionOpen = text.slice(start, text.length)
        }
      } else {
        const start = text.indexOf(listOfOptions[i1][i2]) + listOfOptions[i1][i2].length
        const end = text.indexOf(listOfOptions[i1][i2+1])
        if(start >= 0) {
          questionOpen = text.slice(start, end)
        }
      }
      
      list[i1].push(removeTrashText(questionOpen))
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

  return {
    format: listOfOptions[indexSelect][0],
    options: option
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
  console.log(responses)
  if(responses) {
    return questions.map((item, index) => ({
      ...item,
      "gabarito": responses[index]
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
  Input
}