/*
 * Table MERN Example 1
 * app back-end JavaScript code
 *
 * Author: Denis Gracanin
 * Version: 2.0
 */

// Import modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Set the web server
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.get('/', (req, res) =>
    res.send('<h1>MERN Example 2: Server</h1>') // Home web page
);


// Connect to MongoDB database
mongoose.Promise = global.Promise;
mongoose.connect("MONGODB_ADDRESS", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.once("open", function() {
  console.log("Connection with MongoDB was successful");
});

// Create routes for database access
const tableSchema = require("./models/model");
const router = express.Router();
app.use('/db', router);

router.route('/find').get(async (req, res) => {
  try {
    console.log("Fetching datasets...");
    const datasets = await tableSchema.find();
    console.log(datasets);
    return res.status(200).json(datasets);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: 'Error fetching data', error });
  }
});

router.route('/find/:caption').get( async (req, res) => {
  tableSchema.find({caption: req.params.caption}, function(err, items) {
    res.json(items);
  });
});

// Added support for post requests. A document is found based on its id. The id is the value of _id property of the document.
router.route('/update/:id').post( async (req, res) => {
  const response = await tableSchema.findByIdAndUpdate(req.params.id, req.body);
  return res.status(200).json(response);
});

// Added support for save requests
router.route('/save').post(async (req, res) => {
  try {
    console.log("Saving new dataset...");
    const newDataset = new tableSchema(req.body);
    const savedDataset = await newDataset.save();
    console.log("Dataset saved: ", savedDataset);
    return res.status(201).json(savedDataset);
  }
  catch (error) {
    console.error("Error saving dataset: ", error);
    res.status(500).json({ message: 'Error saving dataset', error });
  }
});

// Added support for loading specified files
router.route('/findByName/:name').get( async (req, res) => {
  try {
    console.log(`Fetching dataset with name: ${req.params.name}`);
    const dataset = await tableSchema.findOne({ fileName: req.params.name });
    if (dataset) {
      console.log(dataset);
      return res.status(200).json(dataset);
    }
    // If the dataset is not found, return so
    else {
      console.error("Dataset not found.");
      return res.status(404).json({ message: 'Dataset not found' });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: 'Error fetching data', error });
  }
})

// Set the port to 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Export the app to be used in bin/www.js
module.exports = app;
