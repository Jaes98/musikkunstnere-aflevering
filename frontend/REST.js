"use strict";

const artistDatabase = "http://localhost;3333";

async function getArtists(params) {
    const artistsFromDatabase = await fetch(`${artistDatabase}/artists`)
}