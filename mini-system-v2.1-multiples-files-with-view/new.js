const fs = require('fs');
const path = require('path');

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

module.exports = {
  GetFileRecursive,
  GetFile,
  verifyIdExistFileInRes,
  existGabarito,
  existProva
}