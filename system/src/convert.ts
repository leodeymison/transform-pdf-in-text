import fs from 'fs';
import pdf from 'pdf-parse';

type OrderQuestions = {
  title: string;
  options: Array<string>
}

class ConverteFileService {
  constructor(
    readonly pathSave: string, 
  ){}

  async convertePdfForText(router: string){
    const dataBuffer = fs.readFileSync(router);
    const data = await pdf(dataBuffer);
    return JSON.stringify(data.text);
  }

  getQuestions(text: string){
    const regex = /QUESTÃO \d+/g;
    const encontrados = text.match(regex);
    let list: Array<{
      word: string,
      index: number
    }> = [];

    encontrados?.forEach(element => {
      list.push({
        word: element,
        index: text.indexOf(element),
      })
    })

    let questions: Array<string> = []

    for(let i = 0; i < list.length; i++) {
      questions.push(
        text.slice(list[i].index, list.length - 1 === i ? -1 : list[i + 1].index)
      )
    }

    return questions;
  }

  removeWrongCharacters(questions: Array<string>){
    let newList: Array<string> = [];
    for(let i = 0; i < questions.length; i++) {
      const newText = questions[i]
        .replace(/\\n/g, "")
        .replace(/_{2,}/g, "")
        .replace(/ +\n+ +\n+/g, "");

        newList.push(newText)
    }
    return newList
  }

  async orderQuestion(questions: Array<string>, type: string): Promise<Array<OrderQuestions>>{
    let order: Array<OrderQuestions> = [];

    questions.forEach(async (element) => {
      const body = await this.getOptions(element, type);
      const title = this.getTitle(element, body[0]);

      console.log({
        title,
        questions: body
      })

      order.push({
        title,
        options: body.map(item => item.text)
      })
    });

    return order
  }

  private async getOptions(text: string, type: string): Promise<Array<{
    index: number,
    text: string
  }>> {
    let options = ["A) ", "B) ", "C) ", "D) ", "E) "];
    if(type === "type02") {options = ["(A) ", "(B) ", "(C) ", "(D) ", "(E) "]}
    if(type === "type03") {options = ["a) ", "b) ", "c) ", "d) ", "e) "]}
    if(type === "type04") {options = ["(a) ", "(b) ", "(c) ", "(d) ", "(e) "]}
    if(type === "type05") {options = ["A. ", "B. ", "C. ", "D. ", "E. "]}
    if(type === "type06") {options = ["a. ", "b. ", "c. ", "d. ", "e. "]}

    let listIndexs = [];

    for(let i = 0; i < options.length; i++) {
      const encontrado = text.indexOf(options[i]);
      if(encontrado){
        listIndexs.push(encontrado);
      }
    }

    let listTextAndIndex = [];
    for(let i = 0; i < listIndexs.length; i++) {
      let NewText = "";
      const withoutSplit = text.slice(
        listIndexs[i], 
        listIndexs.length - 1 === i ? -1 : listIndexs[i + 1]
      )

      if(listIndexs.length - 1 === i) {
        const newT = withoutSplit.split("pcimarkpci");
        if(newT.length > 1){
          NewText = newT[0]
        } else {
          NewText = withoutSplit
        }
      } else {
        NewText = withoutSplit
      }
      
      const textCorrections = NewText.trim().replace(/ {2,}/g, " ");
      listTextAndIndex.push({
        index: listIndexs[i],
        text: textCorrections
      })
    }
    
    return listTextAndIndex
  }

  private getTitle(text: string, paramType: {
    index: number,
    text: string
  }): string {
    return text.slice(
      0, 
      paramType.index
    ).replace(/ {2,}/g, " ")
  }

  saveInFile(body: any){
    fs.writeFile(`${__dirname}/../all-questios.json`, JSON.stringify(body, null, 2), (err) => {
      if (err) {
        console.log(err)
      };
    });
  }
}

export default ConverteFileService