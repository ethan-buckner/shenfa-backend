const fs = require('fs');
const PDFParser = require('pdf2json');
const { PDFDocument } = require('pdf-lib');

async function gatherFormFields(pdfBytes) {
    return new Promise((resolve, reject) => {
        const pdfParser = new PDFParser();

        pdfParser.on('pdfParser_dataError', errData => reject(errData.parserError));
        pdfParser.on('pdfParser_dataReady', pdfData => {
            console.log('PDF data ready');
            let formFields = {};
            for (let page of pdfData['Pages']) {
                for (let field of page['Fields']) {
                    formFields[field['id']['Id']] = {
                        'value': field['V'],
                        'x': field['x'],
                        'y': field['y'],
                        'w': field['w'],
                        'h': field['h'],
                        'autofill': null
                    };
                }
            }
            resolve(formFields);
        });

        pdfParser.parseBuffer(pdfBytes);
    });
}

// Function to print form field names with pdf-lib
async function printFormFields(pdfBytes) {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();
    const fields = form.getFields();
    for (let field of fields) {
        console.log(field.getName());
    }
}   

async function fillFormFields(pdfBytes, field_mapping) {
    const pdfDoc = await PDFDocument.load(pdfBytes)
    const form = pdfDoc.getForm()
    for (let key in field_mapping) {
        form.getTextField(key).setText(field_mapping[key])
    }
    const filledPdfBytes = await pdfDoc.save()
    return filledPdfBytes;
}

module.exports = {
    gatherFormFields,
    printFormFields,
    fillFormFields
};