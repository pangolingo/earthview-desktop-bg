import fs from 'fs';
import fetch from 'node-fetch';
import wallpaper from 'wallpaper';
import earthview  from './earthview.json';
import { search } from './get-streetview';

function sample(collection) {
  var randomIndex = Math.floor(Math.random() * collection.length);
  return collection[randomIndex];
}

function getFilename(uri) {
  return `${(new Date()).valueOf()}.jpg`;
}

function downloadImage(uri, path) {
  return new Promise((resolve, reject) => {
    fetch(uri).then(function(response) {
      const fileStream = fs.createWriteStream(path);
      response.body.pipe(fileStream);
      response.body.on('error', reject);
      response.body.on('finish', resolve);
    });
  });
}

function setDesktopBg(imagePath) {
  wallpaper.set(imagePath, { scale: 'fill' })
    .then(() => console.log(`set desktop background to ${imagePath}`))
    .catch(() => console.log(`could not set background to ${imagePath}`));
}

function getAndSetDesktopBg(imageUri) {
  const directory = './images';
  if (!fs.existsSync(directory)) fs.mkdirSync(directory);

  const imageName = getFilename(imageUri);
  const imagePath = `${directory}/${imageName}`;

  if (fs.existsSync(imagePath)) {
    setDesktopBg(imagePath)
  } else {
    downloadImage(imageUri, imagePath)
      .then(() => setDesktopBg(imagePath))
      .catch((e) => { console.log(`could not download image ${imageUri} to ${imagePath}`); console.log(e)});
  }
}

if(process.argv[2] === 'pretty') {
  const imageUri = sample(earthview).image;
  getAndSetDesktopBg(imageUri);
} else {
  search().then(u => getAndSetDesktopBg(u))
}
