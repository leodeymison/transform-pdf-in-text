import ConverteFileService from "./convert";
import { createInterface } from "readline/promises"
import { lineDuple, lineOne, titleHeader } from "./modules/styleView";
import { startPushDatabase } from "./pushDatabase";

(async () => {
  while(true){
    try {
      const rl = createInterface({
        input: process.stdin,
        output: process.stdout
      });
      titleHeader()
      const pathUrl = await rl.question("Rota do arquivo PDF: ");
      lineOne()
      const questionNumber = await rl.question("Número de questões: ");
      lineOne()
      console.log("MODELOS: ")
      console.log("type01 = 'A) '")
      console.log("type02 = '(A) '")
      console.log("type03 = 'a) '")
      console.log("type04 = '(a) '")
      console.log("type05 = 'A. '")
      console.log("type05 = 'a. '")
      const QuestionModel = await rl.question("Modelo de questão: ");
      lineOne()
      const OptionsModel = await rl.question("Modelo de alternativas: ");
      lineDuple()
    
      const myConvertion = new ConverteFileService(
        `${__dirname}/../res`, // Local que salva o texto
      );
    
      // Converte pdf para text
      const text = await myConvertion.convertePdfForText(pathUrl);

      // Organiza as questões
      const questions = myConvertion.getQuestions(text);
    
      // Remove caracteres indevidos
      const questionsWithoutErros = myConvertion.removeWrongCharacters(questions);
    
      // Separa entre title, opções e imagens
      const ordemQuestion = await myConvertion.orderQuestion(questionsWithoutErros, QuestionModel)
    
      // Salva as questões
      myConvertion.saveInFile(ordemQuestion);
    
      lineDuple()
      if(ordemQuestion.length === parseInt(questionNumber)) {
        console.log("Convertido com sucesso!")
      } else {
        console.log("Erro ao converter arquivo!")
      }
      lineOne()
      let responses = [];
      for(let i = 0; i < ordemQuestion.length - 99; i++) {
        const res = await rl.question(`Alternativa das questão ${i + 1} - [a, b, c, d, ou e]: `);
        if(res === 'a') {responses.push(0)}
        if(res === 'b') {responses.push(1)}
        if(res === 'c') {responses.push(2)}
        if(res === 'd') {responses.push(3)}
        if(res === 'e') {responses.push(4)}
      }
      const nome_prova = await rl.question("Nome da prova: ");
      lineOne()
      const ano = await rl.question("Ano: ");
      lineOne()
      const banca = await rl.question("Banca: ");
      lineOne()
      const orgao = await rl.question("Orgão: ");
      lineOne()
      const area = await rl.question("Area: ");
      lineOne()
      const escolaridade = await rl.question("Escolaridade: ");

      for(let i = 0; i < ordemQuestion.length - 99; i++) {
        startPushDatabase({
          nome_prova,
          ano: parseInt(ano),
          numero_questao: i + 1,
          conteudo: ordemQuestion[i].title,
          imagens: 0,
          alternativas: ordemQuestion[i].options.toString(),
          gabarito: responses[i],
          banca,
          orgao,
          area,
          escolaridade
        })
      }

      lineOne()
      await rl.question("Clique qualquer tecla para continuar... ");
      console.clear()
    } catch (error: any) {
      console.clear()
      console.log(error?.message)
    }
  }
})()
