import { Browser, launch } from 'puppeteer';
import { 
  saveInFile, 
  AddClick, 
  GetHTMLInList, 
  GetInnerHTML, 
  GetTextInList, 
  OpenPage, 
  clickInButtonInList, 
  delay, 
  GetInnerText
} from './models';

const GetDatasFunc = async (browser: Browser, start: number, end: number) => {
  const pageContent = await OpenPage(browser, "https://www.tecconcursos.com.br/questoes/filtrar")
  console.log('- Abriu página de conteúdo');

  await delay(60000) // Adicionar os filtros
  const getQuantQ = await GetInnerHTML(pageContent, ".questao-cabecalho-informacoes-numero span");
  if(getQuantQ?.length){
    const getQuantQuestion = parseInt(getQuantQ.slice(
      getQuantQ.indexOf("de ") + 3, 
      getQuantQ.length
    ))
    console.log("- Pegou a quantidade de questões, igual a: ", getQuantQuestion)
    
    // ?  Clica em mudar página
    await pageContent.waitForSelector(".questao-rg-area-coluna-2.ng-scope .ng-scope .questao-navegacao-botao.questao-navegacao-botao-ir-para-cinza.ng-isolate-scope");
    await AddClick(pageContent, ".questao-rg-area-coluna-2.ng-scope .ng-scope .questao-navegacao-botao.questao-navegacao-botao-ir-para-cinza.ng-isolate-scope");
    await delay(1000)
    const inputNoPopup = await pageContent.waitForSelector('.ajs-content .ajs-input');
    if(inputNoPopup){
      // ? Adiciona número da página
      await inputNoPopup.type(`${start}`);
      // ? Clica em ok
      await pageContent.waitForSelector(".ajs-button.ajs-ok");
      await AddClick(pageContent, ".ajs-button.ajs-ok");
    }
    await delay(12000)

    for(let i = start - 1; i < end; i++){
      await clickInButtonInList(pageContent, ".questao-cabecalho-botoes button");
      await delay(100)
      
      await pageContent.waitForSelector(".item-detalhe div.ng-binding");
      const informations = await GetTextInList(pageContent, ".item-detalhe div.ng-binding");
      
      await delay(100)
      const existAlert = await GetInnerHTML(pageContent, ".box-warning");
      if(!existAlert && informations !== null){
        const materia = await GetInnerText(pageContent, ".questao-cabecalho-informacoes-materia a.ng-binding");
        const assunto = await GetInnerText(pageContent, ".questao-cabecalho-informacoes-assunto.ng-scope span.ng-scope");

        const orgao = informations[0].content;
        const area = JSON.stringify(
          informations[1].content
        ).replace(/"/gi, "'").replace(/\\n/gi, "").replace(/\\/gi, "");
        const ano = parseInt(informations[3].content.trim());
        const banca = informations[4].content;
      
        const content = await GetInnerHTML(pageContent, ".questao-enunciado-texto.embonitar.espacamento-3");
  
        await pageContent.waitForSelector(".questao-enunciado-alternativa.espacamento-3");
        await pageContent.click(".questao-enunciado-alternativa.espacamento-3");
        await delay(100)
        await pageContent.waitForSelector(".btn.btn-tec.botao-resolver.ng-scope.ng-isolate-scope");
        await pageContent.click(".btn.btn-tec.botao-resolver.ng-scope.ng-isolate-scope");
        await delay(4000)
    
        const questionsCorrect = await GetHTMLInList(pageContent, ".questao-enunciado-alternativas li.ng-scope");
    
        let gabarito = null;
        questionsCorrect.forEach(((element, index) => {
          if(element.classe.includes("correcao") || element.classe.includes("acerto")){
            gabarito = index
          }
        }))
  
        const questions = await GetHTMLInList(pageContent, ".questao-enunciado-alternativa-texto.questao-enuncado-alternativa-texto-espacamento");
        
        if(gabarito !== null){
          saveInFile({
            name_prova: area,
            ano: ano,
            banca: banca,
            orgao: orgao,
            area: area,
            escolaridade: "Superior",
            numero_questão: i + 1,
            conteudo_questão: content,
            questions: questions.map(item => item.content),
            gabarito: gabarito,
            materia: materia,
            assunto: assunto
          },`/../data/${i + 1}.question.json`);

          console.log(`Salvando questão: N°${i + 1}`)
        }
        
        await delay(50)
      }

      await AddClick(pageContent, ".questao-navegacao.ng-scope .questao-navegacao-botao.questao-navegacao-botao-proxima");

      await delay(6000 + (Math.floor(Math.random() * (1000 - 50 + 1)) + 50))
    }
  }
};

(async () => {
  const browser = await launch({
    headless: false,
  });
  const pageLogin = await OpenPage(browser, 'https://www.tecconcursos.com.br/login');

  console.log('- Abriu página de login');
  // ?  login
  // await (await pageLogin.$("#email"))?.type("leodeymisonbasquete@gmail.com");
  // await (await pageLogin.$("#senha"))?.type("basquete1");

  await (await pageLogin.$("#email"))?.type("jurandifig@gmail.com");
  await (await pageLogin.$("#senha"))?.type("10421683");

  await delay(20000)
  
  await pageLogin.close();
  console.log('- Fechou  login');

  const argumentos = process.argv.slice(2);

  await GetDatasFunc(browser, parseInt(argumentos[0]), parseInt(argumentos[1]))
})();

