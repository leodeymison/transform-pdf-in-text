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

module.exports = {
  GetFileRecursive,
  GetFile,
  verifyIdExistFileInRes
}