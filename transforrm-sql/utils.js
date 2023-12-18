const fs = require('fs');
const path = require('path');

function readFileJson(pathRouter) {
  const files = fs.readdirSync(pathRouter);
  const fileJSON = files.filter(arquivo => arquivo.endsWith('.json'));
  const objectJSON = [];

  fileJSON.forEach(file => {
    const pathFile = path.join(pathRouter, file);
    const conteudoArquivo = fs.readFileSync(pathFile, 'utf8');
    const objeto = JSON.parse(conteudoArquivo);
    objectJSON.push(objeto);
  });

  return objectJSON;
}

function addDataInQuery(model, datas, paramsString){
  let text = `${model}`;
  datas.forEach((element, index) => {
    let list = "\n("
    Object.keys(element).forEach((chave, i) => {
      if((Object.keys(element).length - 1) === i) {
        if(paramsString.includes(chave)){
          list += `"${element[chave]}"`
        } else {
          list += `${element[chave]}`
        }
      } else {
        if(paramsString.includes(chave)){
          list += `"${element[chave]}", `
        } else {
          list += `${element[chave]}, `
        }
      }
    });
    text += `${list}${(datas.length - 1) === index ? ");" : "),"}`
  });
  return text
}

const saveInFile = (body, file, json = true) => {
  fs.writeFile(`${__dirname}/${file}`,
  json ? JSON.stringify(body, null, 2) : body, 
  (err) => {
    if (err) {
      console.log(err)
    };
  });
}

module.exports = {
  readFileJson,
  addDataInQuery,
  saveInFile
}