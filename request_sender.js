const fs = require('fs');
const axios = require('axios');

const filePath = '/Users/ethanbuckner/Development/shenfa/backend/client_information.pdf';
const url = 'http://localhost:8080/documents/client_information.pdf';

fs.readFile(filePath, (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    axios.post(url, data, {
        headers: {
            'Content-Type': 'application/pdf'
        }
    })
    .then(response => {
        console.log('POST request successful:', response.data);
    })
    .catch(error => {
        console.error('Error sending POST request:', error);
    });
});
