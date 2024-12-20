const mongoose = require('mongoose');

const generalSchema = new mongoose.Schema({}, { strict: false });

// const Dataset = mongoose.model('Dataset', datasetSchema, 'Datasets');
module.exports = mongoose.model('tableSchema', generalSchema, 'Datasets');


