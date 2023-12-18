const { 
    convertePdfForText, 
    getQuestions, 
    orderQuestions, 
    saveInFile, 
    getGabarito, 
    addGabaritoInQuestions
} = require("./modules.js");

const configs = {
    title: "12.Engenharia-Civil-Analista-Ambiental-Engenharia Civil-CPRHPE-prova12",
    quantQuestion: 50,
    questionModel: "{n}. ",
    provaNum0InSmalls: true,
    gabaritoModel: "{n} ",
    gabaritoNum0InSmalls: true,
    urlProva: "./data1/Engenharia Civil/Analista Ambiental - Engenharia Civil - FAMAI - Pref. ItajaíSC/analista_amb_eng_civil.pdf",
    urlGabarito: "./data1/Engenharia Civil/Analista Ambiental - Engenharia Civil - FAMAI - Pref. ItajaíSC/gabarito_oficial_definitivo.pdf",
    formatQuestions: ["A) ", "B) ", "C) ", "D) ", "E) "],
    exceptionsStartQuestions: [
        {
            num: 1,
            except: "TEXTO 01 para as questões 01, 02 e 03."
        },
        {
            num: 4,
            except: "TEXTO 02 para a questão 04"
        },
        {
            num: 5,
            except: "TEXTO 03 para as questões de 05 a 15."
        },
    ],
    model: {
        "name_prova": "Analista Ambiental - Engenharia Civil",
        "ano": "2008",
        "banca": "UPENET/IAUPE",
        "orgão": "CPRH/PE",
        "area": "Engenharia Civil",
        "escolaridade": "Superior",
    },
    gabaritoRes: 7
};

(async () => {
    const responseText = await convertePdfForText(configs.urlProva);
    const responseQuestion = getQuestions(
        responseText, 
        configs.questionModel, 
        configs.quantQuestion,
        configs.provaNum0InSmalls,
        configs.exceptionsStartQuestions
    );
    const orderQuest = orderQuestions(
        responseQuestion, 
        configs.formatQuestions, 
        configs.questionModel
    );

    const gabaritoText = await convertePdfForText(configs.urlGabarito);
    const gabaritosList = getGabarito(
        gabaritoText, 
        configs.gabaritoModel, 
        configs.gabaritoNum0InSmalls
    );

    const questionEnd = addGabaritoInQuestions(orderQuest, gabaritosList[configs.gabaritoRes])
    const model = {
        ...configs.model,
        "questoes": questionEnd
    }

    saveInFile(model, configs.title)
})()