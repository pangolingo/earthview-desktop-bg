var wallpaper = require('wallpaper');
var earthview  = require('./earthview.json');
var fetch = require('node-fetch');

function sample(collection) {
  var randomIndex = Math.floor(Math.random() * collection.length);
  return collection[randomIndex];
}

var imageUrl = sample(earthview).image;
console.log(imageUrl);

fetch(imageUrl).then(function(response) {
  console.log(response);
  console.log(response.json());
});

setTimeout(function() {}, 5000);
