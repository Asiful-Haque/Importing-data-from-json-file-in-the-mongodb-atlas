//Customize as your need

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { ObjectId } = require('mongodb'); // Import ObjectId from the mongodb package

// MongoDB Atlas connection URL
const url = 'mongodb+srv://asifulhaquesourav:asiful@firstcluster.hwnsi.mongodb.net/Dictionary?retryWrites=true&w=majority';

// Define a Mongoose schema and model
const wordSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId, // Ensure the schema type matches ObjectId
  sqlId: Number,
  word: String,
  date: Date,
  __v: Number
});

const YourModel = mongoose.model('word of the days', wordSchema); // Collection name should be accurate

// Path to your JSON file
const jsonFilePath = 'C:/Users/USER/Documents/Sourav-Urdu/urdus.word_of_the_days.json';

// Read JSON file and parse
const rawData = fs.readFileSync(jsonFilePath);
const data = JSON.parse(rawData);

// Transform data to handle `$oid`
const transformedData = data.map(item => {
  if (item._id && item._id.$oid) {
    item._id = new ObjectId(item._id.$oid); // Convert to ObjectId
  }
  return item;
});

async function importData() {
  try {
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB Atlas');

    // Insert data into the collection
    const result = await YourModel.insertMany(transformedData);
    console.log('Data imported successfully:', result.length);
  } catch (err) {
    console.error('Error importing data:', err);
  } finally {
    await mongoose.disconnect();
  }
}

importData();
