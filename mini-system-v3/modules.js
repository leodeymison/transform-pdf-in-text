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

module.exports = {
  convertePdfForText,
  Menu,
}