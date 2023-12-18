const fs = require('fs');
const path = require('path');
const axios = require('axios');

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

const saveBase64 = (base64String, routerSave) => {
  const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (matches.length !== 3) {
    throw new Error('String base64 inválida');
  }

  const imageType = matches[1]; 
  const imageData = matches[2];

  const decodedImage = Buffer.from(imageData, 'base64');

  fs.writeFile(routerSave, decodedImage, 'base64', (err) => {
    if (err) {
      throw err;
    }
    console.log('Imagem convertida e salva com sucesso!');
  });
}

const mimeToExtension = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
};

const dowloadImage = async (urlImage, routerSave, nameImage) => {
  try {
    const response = await axios.get(urlImage, {
      responseType: "arraybuffer"
    });

    const contentType = response.headers['content-type'];
    const extension = mimeToExtension[contentType] || 'png';
    const timestamp = Date.now();
    const nameFile = `${nameImage}.image_${timestamp}.${extension}`;
    const pathComplete = path.join(routerSave, nameFile);

    fs.writeFileSync(pathComplete, response.data);
    return nameFile
  } catch (error) {
    console.error('#### Erro ao baixar e salvar a imagem:', urlImage);
  }
}

function getMultiplesIndex(texto, palavra) {
  let indices = [];
  let index = texto.indexOf(palavra);

  while (index !== -1) {
    indices.push(index);
    index = texto.indexOf(palavra, index + 1);
  }

  return indices;
}

module.exports = {
  readFileJson,
  addDataInQuery,
  saveInFile,
  saveBase64,
  dowloadImage,
  getMultiplesIndex
}