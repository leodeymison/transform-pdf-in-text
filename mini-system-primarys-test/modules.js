const fs = require('fs');
const pdf = require('pdf-parse');

const convertePdfForText = async (router) => {
  const dataBuffer = fs.readFileSync(router);
  const data = await pdf(dataBuffer);
  return removeTrashText(JSON.stringify(data.text));
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

const saveInFile = (body, name) => {
  fs.writeFile(`${__dirname}/res/${name}.json`, JSON.stringify(body, null, 2), (err) => {
    if (err) {
      console.log(err)
    };
  });
}

const orderQuestions = (questions, formatQuestion, modelDescription) => {
  let list = [];
  for(let i = 0; i < questions.length; i++) {
    list.push({
      "numero_questão": i + 1,
      "conteudo_questão": removeDescriptionInText(questions[i], formatQuestion[0], modelDescription),
      "imagens": [],
      "alternativas": removeQuestionsInText(questions[i], formatQuestion),
      "gabarito": ""
    })
  }

  return list
}

const removeDescriptionInText = (text, primaryQuestion, modelDescription) => {
  return text.slice(0, text.indexOf(primaryQuestion))
}

const removeQuestionsInText = (text, formatQuestion) => {
  let list = [];

  for(let i = 0; i < formatQuestion.length; i++) {
    let question = "";
    
    if((formatQuestion.length - 1) === i) {
      question = text.slice(text.indexOf(formatQuestion[i]) + formatQuestion[i].length, text.length)
    } else {
      question = text.slice(text.indexOf(formatQuestion[i]) + formatQuestion[i].length, text.indexOf(formatQuestion[i+1]))
    }
    
    const questionRemoveTrash = removeTrashText(question);
    list.push(questionRemoveTrash)
  }

  return list
}

const removeTrashText = (text) => {
  return text.replace(/\\n/g, "")
    .replace(/\s{2,}/g, ' ')
    .replace(/ +\n+ +\n+/g, "")
    .trim();
}

const getGabarito = (text, gabaritoModel, gabaritoNum0InSmalls) => {
  let next = true;
  let count = 1;
  let list = [];
  let founds = [];
  
  while (next) {
    const num = gabaritoNum0InSmalls ? `${count}`.padStart(2, '0') : `${count}`
    const format = gabaritoModel.replace("{n}", num);
    const positions = getAllPositions(text, format);

    if(!positions.length) {
      next = false
    } else {
      console.log(`${num} foi encontrados: ${positions.length}`)
      founds.push(positions.length)
      positions.forEach((element, index) => {
        if(list[index]) {
          list[index] = [...list[index], text.slice(element + format.length, element + format.length + 1)]
        } else {
          list[index] = [text.slice(element + format.length, element + format.length + 1)]
        }
      })
      count++;
    }
  }

  founds.forEach((element, index) => {
    if(element !== founds[10] && index < 9) {
      console.log(`\u001b[31mPossível erro no gabarito da questão ${index + 1}, por favor verificar.\u001b[37m`)
    }
  })
  
  return list
}

// const selectGabarito = async (gabaritosList) => {
//   console.log("==================================================");
//   console.log("Qual gabarito você deseja escolhar? \n");
//   gabaritosList.forEach((element, index) => {
//       console.log(`${index}. Com ${element.length} respostas`);
//   })
//   console.log("==================================================");
//   const res = parseInt(await input.question("> "));
//   input.close()
//   return gabaritosList[res]
// }

const addGabaritoInQuestions = (questions, responses) => {
  if(responses) {
    return questions.map((item, index) => ({
      ...item,
      "gabarito": responses[index]
    }))
  } else {
    return questions
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

module.exports = {
  convertePdfForText,
  getQuestions,
  orderQuestions,
  saveInFile,
  getGabarito,
  addGabaritoInQuestions
}