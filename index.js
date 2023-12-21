const express = require('express');
const mongoose = require('mongoose');
const Document = require('./models/document');
const { gatherFormFields, printFormFields, fillFormFields } = require('./pdf_parsing');
const app = express();
const PORT = 8080;

// MongoDB Connection URL
const url = 'mongodb://127.0.0.1:27017/shenfa-backend';

app.use(express.raw({ type: 'application/pdf', limit: '10mb' }));
app.use(express.json());

// Connect to MongoDB with Mongoose
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Error occurred while connecting to MongoDB...\n', err);
    process.exit(1);
  });

const db = mongoose.connection;

app.get('/redtail/credentials/api_key', (req, res) => {
  res.status(200).send({
    api_key: '1234'
  });
});

// POST /documents/:filename - Receive a pdf document and save it to the documents collection with a filename
app.post('/documents/:filename', async (req, res) => {
  const { filename } = req.params;
  const data = req.body; // Expect base64 encoded pdf document

  try {
    const fieldJson = await gatherFormFields(Buffer.from(data));
    const document = new Document({
      pdf_binary: Buffer.from(data),
      filename: filename,
      field_json: fieldJson
    });

    await document.save();
    res.status(200).send({
      message: 'Document uploaded successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: 'Error occurred while uploading document'
    });
  }
});


app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));