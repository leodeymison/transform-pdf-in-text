const { readFileJson, addDataInQuery, saveInFile } = require("./utils");
const { AreaQuery, BancaQuery, FormacaoQuery, OrgaoQuery, ProvaNameQuery, QuestionsQuery } = require('./models')

let area = [];  // nome, pai
let banca  =  []; // nome
let materia = [] // nome
let nome_prova =  [] //  nome, anos
let orgao_cargo = [] // nomee, pai
let questoes = []

const datas = readFileJson("./data");


datas.forEach(element => {
    if(!area.filter(item => item.name === element.area).length) {
        area.push({
            name: element.area, 
            pai: "main"
        })
    }

    // ! BANCO
    if(!banca.filter(item => item.name === element.banca).length) {
        banca.push({name: element.banca})
    }

    // ! FORMAÇÃO
    if(!materia.filter(item => item.name === element.materia).length) {
        materia.push({name: element.materia})
    }

    // ! NOME DA PROVA
    const nameProva = nome_prova.filter(item => item.name === element.name_prova)
    if(!nameProva.length) {
        nome_prova.push({
            name: element.name_prova,
            anos: [element.ano]
        })
    } else {
        if(!nameProva[0].anos.includes(element.ano)) {
            nome_prova = nome_prova.map(item => !item.anos.includes(element.ano) ? ({
                ...item,
                anos: [...item.anos, element.ano]
            }) : item)
        }
    }
    
    // ! ORGÃO
    if(!orgao_cargo.includes(element.orgao)) {
        orgao_cargo.push({
            name: element.orgao,
            pai: "main"
        })
    }

    questoes.push({
        cadastrante: 'painel_adm',
        nome_prova: element.name_prova,
        ano: element.ano,
        numero_questao: element['numero_questão'],
        conteudo: element['conteudo_questão'].replace(/"/g, "'"),

        imagens: "",

        alternativas: `'${JSON.stringify(element.alternativas)}'`,

        gabarito: element.gabarito,
        resolucao: "",
        teoria: "",
        banca: element.banca,
        orgao_cargo: element.orgao,
        materia_assunto: element.materia,
        area: element.area,
        escolaridade: "Superior",
        formacao: element.area,
    })
})

let textEnd = "USE if_concursos;\n";


textEnd += `${addDataInQuery(AreaQuery, area, ["name", "pai"])}

`
textEnd += `${addDataInQuery(BancaQuery, banca, ["name"])}

`
textEnd += `${addDataInQuery(FormacaoQuery, materia, ["name"])}

`
textEnd += `${addDataInQuery(ProvaNameQuery, nome_prova.map(item => ({
    ...item,
    anos: JSON.stringify(item.anos)
})), ["name", "anos"])}

`
textEnd += `${addDataInQuery(OrgaoQuery, orgao_cargo, ["name", "pai"])}

`
textEnd += `${addDataInQuery(QuestionsQuery, questoes, [
    "cadastrante",
    "nome_prova",
    "conteudo",
    "imagens",
    "gabarito",
    "resolucao",
    "teoria",
    "banca",
    "orgao_cargo",
    "materia_assunto",
    "area",
    "escolaridade",
    "formacao"
])}

`

saveInFile(textEnd, 'queryEnd.sql', false)