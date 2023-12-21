const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema
const documentSchema = new mongoose.Schema({
    // Define your schema fields here
    pdf_binary: Buffer,
    filename: String,
    field_json: Schema.Types.Mixed
});

// Create the model
const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
