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

module.exports = {
    GetFileRecursive
}