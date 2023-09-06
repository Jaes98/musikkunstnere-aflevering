"use strict";

const artistDatabase = "http://localhost;3333";

window.addEventListener("load", initApp);

function initApp(params) {
    
}


async function getArtists(params) {
  const artistsFromDatabase = await fetch(`${artistDatabase}/artists`);
}