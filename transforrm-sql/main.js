
const { readFileJson, addDataInQuery, saveInFile } = require("./utils");
const {
    QuestionsQuery,
    AreaQuery,
    BancaQuery,
    FormacaoQuery,
    ProvaNameQuery,
    OrgaoQuery
} = require("./models")

let area = [];  // nome, pai
let banca  =  []; // nome
let formacao = [] // nome
let nome_prova =  [] //  nome, anos
let orgao_cargo = [] // nomee, pai
let questoes = []


const datas = readFileJson("./data");
const datasMock = [
    {
        name_prova: 'Agente Técnico - Engenharia Civil',
        ano: '2013',
        banca: 'VUNESP',
        'orgão': 'MPE/ES',
        area: 'Engenharia Civil',
        escolaridade: 'Superior',
        questoes: []
    },
    {
        name_prova: 'Agente Técnico - Engenharia mecânicas',
        ano: '2013',
        banca: 'VUNESP',
        'orgão': 'MPE/ES',
        area: 'Engenharia Civil',
        escolaridade: 'Superior',
        questoes: []
    },
    {
        name_prova: 'Agente Técnico - Engenharia Civil',
        ano: '2011',
        banca: 'VUNESP',
        'orgão': 'MPE/ES',
        area: 'Engenharia Civil',
        escolaridade: 'Superior',
        questoes: []
    }
]
datas.forEach(element => {
    const newArea = element.name_prova.slice(0, " - ") ? 
        element.name_prova.slice(0, " - ") : 
        element.name_prova.slice(0, element.name_prova.length);

    if(!area.filter(item => item.name === newArea).length) {
        area.push({
            name: newArea, 
            pai: "main"
        })
    }
    if(!banca.filter(item => item.name === element.banca).length) {
        banca.push({name: element.banca})
    }
    if(!formacao.filter(item => item.name === element.area).length) {
        formacao.push({name: element.area})
    }
    const nameProva = nome_prova.filter(item => item.name === element.banca)
    const ano = parseInt(element.ano)
    if(!nameProva.length) {
        nome_prova.push({
            name: element.banca,
            anos: [ano]
        })
    } else {
        if(!nameProva[0].anos.includes(ano)) {
            nome_prova = nome_prova.map(item => !item.anos.includes(ano) ? ({
                ...item,
                anos: [...item.anos, ano]
            }) : item)
        }
    }
    if(!orgao_cargo.includes(element["orgão"])) {
        orgao_cargo.push({
            name: element["orgão"],
            pai: "main"
        })
    }

    element.questoes.forEach(item => {
        if(!item.alternativas.includes("Nenhuma opção")) {
            questoes.push({
                cadastrante: 'painel_adm',
                nome_prova: element.banca,
                ano: element.ano,
                numero_questao: item['numero_questão'],
                conteudo: item['conteudo_questão'].replace(/\\/g, "").replace(/"/g, "'"),

                imagens: "",

                alternativas: `'${JSON.stringify(
                    item.alternativas.map(item => item.replace(/'/g, ""))
                ).replace(/"/g, '\\\"')}'`.replace(/\\\\/g, ""),

                gabarito: item.gabarito,
                resolucao: "",
                teoria: "",
                banca: element.banca,
                orgao_cargo: element["orgão"],
                materia_assunto: "",
                area: newArea,
                escolaridade: "Superior",
                formacao: element.area,
            })
        }
    });
});
let textEnd = "USE if_concursos;\n";


textEnd += `${addDataInQuery(AreaQuery, area, ["name", "pai"])}

`
textEnd += `${addDataInQuery(BancaQuery, banca, ["name"])}

`
textEnd += `${addDataInQuery(FormacaoQuery, formacao, ["name"])}

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