let pessoa = {
    nome: 'Ana',
    idade: 25,
    cidade: 'Exemploville'
  };
  
  Object.keys(pessoa).forEach((chave, i) => {
    console.log(`${chave}${i}: ${pessoa[chave]}`);
  });
  