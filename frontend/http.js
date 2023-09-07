"use strict";
const artistDatabase = "http://localhost:3333";

// ============ FETCH ============ //
async function getArtists(params) {
  const artistsFromDatabase = await fetch(`${artistDatabase}/artists`);
  console.log(artistsFromDatabase);
  return await artistsFromDatabase.json();
}
// ============ CREATE ============ //
async function createdArtist(newArtist) {
    
    const artistAsJson = JSON.stringify(newArtist);
    const response = await fetch(`${artistDatabase}/artists`, {
      method: "POST",
      body: artistAsJson,
      headers: {
        "Content-type": "application/json",
      },
    });
    return response
}
// ============ UPDATE ============ //

async function updatedArtist(artistToUpdate, id) {
    const artistAsJson = JSON.stringify(artistToUpdate);
    console.log(artistToUpdate);
    const response = await fetch(
    `${artistDatabase}/artists/${id}`,
    {
      method: "PUT",
      body: artistAsJson,
      headers: {
        "Content-type": "application/json",
      },
    }
  );
  return response
}
// ============ DELETE ============ //
async function deleteArtist(id) {
  const response = await fetch(`${artistDatabase}/artists/${id}`, {
    method: "DELETE",
  });
  return response;
}

// ============ FAVORITES ============ //

async function fetchFavorites(params) {
    const response = await fetch(`${artistDatabase}/favorites`);
    console.log(response, "hvad er det her response fra favorite?");
    return response;
}

// adds id to favoritelist
async function addToFavorite(id) {
  const newFavorite = {
    id: id,
  };
  const newFavJson = JSON.stringify(newFavorite);
  const response = await fetch(`${artistDatabase}/favorites`, {
    method: "POST",
    body: newFavJson,
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.ok) {
    return response;
  }
}
// removes id from favoritelist
async function removeFromFavorite(id) {
    console.log(id, "hvilket id er det her");
  const response = await fetch(`${artistDatabase}/favorites/${id}`, {
    method: "DELETE",
  });
  if (response.ok) {
    return response;
  }
}

export {createdArtist, updatedArtist, deleteArtist, getArtists, addToFavorite, removeFromFavorite, fetchFavorites};