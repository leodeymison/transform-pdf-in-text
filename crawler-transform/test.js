function getMultiplesIndex(texto, palavra) {
    let indices = [];
    let index = texto.indexOf(palavra);
  
    while (index !== -1) {
      indices.push(index);
      index = texto.indexOf(palavra, index + 1);
    }
  
    return indices;
}

console.log(getMultiplesIndex('sdfsdfsd src= aadasddass  aasrc= asdasdda ssrc=c', 'src='))