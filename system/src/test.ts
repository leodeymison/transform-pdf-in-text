import { startPushDatabase } from "./pushDatabase"

(async () => {
    try {
        const  options = [
            "A) “a triunfante sensação de respirar sobre a terra”",
            "B) “o zunzum de todos os dias acentuava-se”",
            "C) “Começavam a fazer compras na venda”",
            "D) “O rumor crescia, condensando-se”",
            "E) “ouviam-se gargalhadas e pragas”"
        ]
        const { data } = await startPushDatabase({
            nome_prova: "Prova test",
            ano: 2023,
            numero_questao: 1,
            conteudo: "QUESTÃO 01 O cortiço O rumor crescia, condensando-se; o zunzum de todos os dias acentuava-se; já se não destacavam vozes dispersas, mas um só ruído compacto que enchia todo o cortiço. Começavam a fazer compras na venda; ensarilhavam-se discussões e rezingas; ouviam-se gargalhadas e pragas; já se não falava, gritava-se. Sentia-se naquela fermentação sanguínea, naquela gula viçosa de plantas rasteiras que mergulhavam os pés vigorosos na lama preta e nutriente da vida o prazer animal de existir, a triunfante sensação de respirar sobre a terra. AZEVEDO, Aluísio. O cortiço. São Paulo: Ática, 1970. p. 28. No texto, há uma expressão zoomórfica. Assinale a alternativa que exemplifica essa expressão. ",
            imagens: 0,
            alternativas: options.toString(),
            gabarito: 2,
            banca: "COPEVE/UFAL",
            orgao: "TCE/AL",
            area: "engenharia civil",
            escolaridade: "'superior",
        });
        console.log(data)
    } catch (error: any) {
        console.clear()
        console.log(error?.message)
    }
})()
