# Earthview Desktop Background

Inspired by [Earth View from Google
Earth](https://chrome.google.com/webstore/detail/earth-view-from-google-ea/bhloflhklmhfpedakmangadcdofhnnoh?hl=en)
I wanted to have an easy way to set my desktop background to a random Earth View
picture;

## Instructions

- clone this repository
- run `npm install` to install dependencies
- run `npm start` to set your desktop background to a random google earth image

## Mac OS

To run this script every time you log in on mac OS:
- copy the `com.user.loginscript.plist` file from this repo into
  `~/Library/LaunchAgents`
- update the `Program` and `WorkingDirectory` paths to reflect the location of
  this repository
- in rare cases, you may need to update the `PATH` value to reflect your
  machine's setup
