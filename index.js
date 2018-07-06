import fs from 'fs';
import fetch from 'node-fetch';
import wallpaper from 'wallpaper';
import earthview  from './earthview.json';

function sample(collection) {
  var randomIndex = Math.floor(Math.random() * collection.length);
  return collection[randomIndex];
}

function getFilename(uri) {
  const uriArray = uri.split('/');
  return uriArray[uriArray.length - 1];
}

function downloadImage(uri, path) {
  return new Promise((resolve, reject) => {
    fetch(imageUri).then(function(response) {
      const fileStream = fs.createWriteStream(path);
      response.body.pipe(fileStream);
      response.body.on('error', reject);
      response.body.on('finish', resolve);
    });
  });
}

function setDesktopBg(imagePath) {
  wallpaper.set(imagePath)
    .then(() => console.log(`set desktop background to ${imagePath}`))
    .catch(() => console.log(`could not set background to ${imagePath}`));
}

function getAndSetDesktopBg(imageUri) {
  const directory = './images';
  if (!fs.existsSync(directory)) fs.mkdirSync(directory);

  const imageName = getFilename(imageUri);
  const imagePath = `${directory}/${imageName}`;

  downloadImage(imageUri, imagePath)
    .then(() => setDesktopBg(imagePath))
    .catch(() => console.log(`could not download image ${imageUri} to ${imagePath}`));
}

const imageUri = sample(earthview).image;
getAndSetDesktopBg(imageUri);
