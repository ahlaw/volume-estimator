// Set environment file
require('dotenv').load();

// Imports the Google Cloud client library
const vision = require('@google-cloud/vision');
const fs = require('fs');
const axios = require('axios');

// Creates a client
const client = new vision.ImageAnnotatorClient();

// Get valid labels
const contents = fs.readFileSync('./labelWhiteList.txt', 'utf8').split('\n');

/**
 * Determines the labels of an image through the Google Vision API
 * @param {string} filepath - Filepath to image file
 */
function getLabels(filepath) {
  let description = '';

  return new Promise((resolve, reject) => {
    client
      .labelDetection(filepath)
      .then(results => {
        const labels = results[0].labelAnnotations;

        labels.forEach(label => {
          if (contents.indexOf(label.description) > -1) {
            description = label.description;
          }
        });

        resolve(description);
      })
      .catch(err => {
        reject('ERROR:' + err);
      });
  });
}

/**
 * Get nutrient facts from API
 * @param {string} item - Item to look up nutrients 
 */
function getNutrients(filepath){
  return new Promise((resolve, reject) => {
    getLabels(filepath)
      .then(item => {
        axios.get(`https://api.edamam.com/api/food-database/parser?nutrition-type=logging&ingr=${item.toString().replace(' ', '%20')}&app_id=${process.env.EDAMAM_APPID}&app_key=${process.env.EDAMAM_APPKEY}`)
          .then(res => {
            // console.log(res.data.hints[0].food.nutrients);
            // resolve(res.data.hints[0].food.nutrients.ENERC_KCAL);

            resolve(res.data.hints[0].food.nutrients);
          })
          .catch(err => {
            eject("Error:" + err);
          });
      });   
  });  
}

module.exports = {
  getLabels,
  getNutrients
}
