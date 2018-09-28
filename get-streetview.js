const url = require('url');
import { sign } from './google-signing';
import fetch from 'node-fetch';

const KEY = process.env.GOOGLE_MAPS_API_KEY
const SIGNING_SECRET = process.env.GOOGLE_MAPS_API_SIGNING_SECRET
// we use a large search radius because we keep landing in the ocean :(
// this make us biased to coastal views - which could be a bug or a feature
const RADIUS = 100000;


function getRandomInRange(from, to, fixed) {
  return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
}

/**
 * 
 * @param {number} width - width of the final image
 * @param {number} height - height of the final image
 * @param {string} location - text string (Chagrin Falls, OH) or lat/lng value (40.457375,-80.009353)
 *    Will snap to the panorama photographed closest to this location.
 *    When address is provided, API may use a different camera location to better display the specified location.
 *    When a lat/lng is provided,  API searches a 50 meter radius for a photograph closest to this location.
 *    Because Street View imagery is periodically refreshed, and photographs may be taken from slightly
 *     different positions each time, it's possible that your location may snap to a different panorama when imagery is updated.

 */
export const getStreetviewURL = (_width, _height, location) => {
  const u =  new url.URL('https://maps.googleapis.com/maps/api/streetview');
  u.searchParams.append('key', KEY);

  // free version only supports 640x640
  const width = _width > 640 ? 640 : _width;
  const height = _height > 640 ? 640 : _height;

  u.searchParams.append('size', `${width}x${height}`);
  u.searchParams.append('radius', RADIUS);
  u.searchParams.append('location', location);
  return sign(u.toString(), SIGNING_SECRET);
}

export const checkThatStreetviewExists = async (location) => {
  const u = new url.URL('https://maps.googleapis.com/maps/api/streetview/metadata');
  u.searchParams.append('key', KEY);
  u.searchParams.append('radius', RADIUS);
  u.searchParams.append('location', location);
  const signedUrl = sign(u.toString(), SIGNING_SECRET);

  const json = await fetch(signedUrl).then(res => res.json())
  console.log(json.status);
  switch(json.status) {
    case 'OK':
      return true;
    case 'NOT_FOUND':
    case 'ZERO_RESULTS':
      return false;
    default:
      throw new Error('Problem getting street view metadata', json.toString())
  }
}

// generate random points until we find one with a street view
export const search = () => {
  const randPoint = `${getRandomInRange(-180, 180, 3)},${getRandomInRange(-180, 180, 3)}`;
  console.log('checking point', randPoint);
  return checkThatStreetviewExists(randPoint).then(success => {
    if(success) {
      console.log('Point is valid')
      const streetview = getStreetviewURL(1800, 1200, randPoint);
      console.log(streetview);
      return streetview;
    } else {
      return search();
    }
  });
}
