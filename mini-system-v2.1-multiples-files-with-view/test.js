const fs = require('fs');
const PDFParser = require('pdf2json');

const pdfParser = new PDFParser();

// Substitua 'nome_do_arquivo.pdf' pelo nome do seu arquivo PDF
const pdfFilePath = './data1/Engenharia Civil/Agente de Fiscalização - Engenharia Civil - TCMSP/105_t_a.pdf';

pdfParser.loadPDF(pdfFilePath);

pdfParser.on('pdfParser_dataError', errData => console.error(errData.parserError));
pdfParser.on('pdfParser_dataReady', pdfData => {
    const textContent = pdfParser.getRawTextContent();
    const images = pdfData.formImage;

    // Salvar o texto em um arquivo
    fs.writeFile('texto_extraido.txt', textContent, err => {
        if (err) {
            console.error('Erro ao salvar o texto extraído:', err);
        } else {
            console.log('Texto extraído salvo com sucesso!');
        }
    });

    // Verificar se há imagens
    if (Array.isArray(images) && images.length > 0) {
        // Salvar as imagens em arquivos separados
        images.forEach((image, index) => {
            if (image && image['ImageData']) {
                const imageBuffer = Buffer.from(image['ImageData'], 'base64');
                const imageFileName = `imagem_${index}.png`; // ou .jpg, dependendo do formato

                fs.writeFile(imageFileName, imageBuffer, err => {
                    if (err) {
                        console.error(`Erro ao salvar a imagem ${imageFileName}:`, err);
                    } else {
                        console.log(`Imagem ${imageFileName} salva com sucesso!`);
                    }
                });
            } else {
                console.error(`Erro ao processar a imagem ${index}.`);
            }
        });
    } else {
        console.log('Não foram encontradas imagens no PDF.');
    }
});