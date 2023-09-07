"use strict";

import { createdArtist, updatedArtist, deleteArtist, getArtists, addToFavorite, removeFromFavorite, fetchFavorites } from "./http.js";

let selectedArtist;
let listOfArtists;
let favoriteIds;

window.addEventListener("load", initApp);

// ============ Start app ============ //
async function initApp(array) {
  console.log("kører den?");
  const artists = await getArtists();
  listOfArtists = artists;
  updateArtistsGrid(artists);
  eventListenersAdd();
}

// ============ Adds eventlisteners ============ //
function eventListenersAdd(params) {
  document
    .querySelector("#form-create")
    .addEventListener("submit", createArtist);
  document
    .querySelector("#form-update")
    .addEventListener("submit", updateArtist);
  document.querySelector("#sort-by").addEventListener("change", setSort);
  document.querySelector("#filter-by").addEventListener("change", chosenFilter);
  document
    .querySelector("#favoritesCheckBox")
    .addEventListener("change", favoritesClicked);
}
async function updateArtistsGrid(list) {
  console.log(list, "det her sendes til display");
  favoriteIds = await getFavorites();
  displayArtists(list);
}

// ============ Shows artists on grid ============ //
function displayArtists(artistList) {
  document.querySelector("#artists-grid").innerHTML = "";
  for (const artist of artistList) {
    document.querySelector("#artists-grid").insertAdjacentHTML(
      "beforeend",
      /*html*/ `
            <article class="artist">
    <div><b>Artist name:</b> ${artist.name}</div>
    <div><img src="${artist.image}"></div>
    <div><b>Birthdate:</b>${artist.birthdate}</div>
    <div><b>Active since: </b>${artist.activeSince}</div>
    <div><b>Genres: </b>${artist.genres}</div>
    <div><b>Labels: </b>${artist.labels}</div>
    <div><b>Website:</b>${artist.website}</div>
    <div><b>About the artist: </b>${artist.shortDescription}</div>
    <button class="update-btn">Update artist</button>
    <button class="delete-btn">Remove artist</button>
    <button class="addFavorites-btn">Add to Favorites</button>
		<button class="removeFavorites-btn">Remove from Favorites</button>
    </article>
        `
    );
    document
      .querySelector("#artists-grid article:last-child .delete-btn")
      .addEventListener("click", () => deleteArtistClicked(artist.id));
    document
      .querySelector("#artists-grid article:last-child .update-btn")
      .addEventListener("click", () => selectArtist(artist));
      document
        .querySelector("#artists-grid article:last-child .addFavorites-btn")
        .addEventListener("click", () => addToFavorite(artist.id));
      document
        .querySelector("#artists-grid article:last-child .removeFavorites-btn")
        .addEventListener("click", () => removeFromFavorite(artist.id));
  }
}
function displayFavoritesById(ids) {
  
}
// ============ CREATE ============ //
async function createArtist(event) {
  event.preventDefault();
  const name = event.target.name.value;
  const image = event.target.image.value;
  const birthdate = event.target.birthdate.value;
  const activeSince = event.target.activeSince.value;
  const genres = event.target.genres.value;
  const labels = event.target.labels.value;
  const website = event.target.website.value;
  const shortDescription = event.target.shortDescription.value;
  const favorite = false
  const newArtist = {
    name,
    image,
    birthdate,
    activeSince,
    genres,
    labels,
    website,
    shortDescription,
    favorite
  };
  const response = await createdArtist(newArtist);
  if (response.ok) {
    updateArtistsGrid();
  }
}
// ============ UPDATE ============ //
async function updateArtist(event) {
  event.preventDefault();
  const name = event.target.name.value;
  const image = event.target.image.value;
  const birthdate = event.target.birthdate.value;
  const activeSince = event.target.activeSince.value;
  const genres = event.target.genres.value;
  const labels = event.target.labels.value;
  const website = event.target.website.value;
  const shortDescription = event.target.shortDescription.value;
  const favorite = event.target.favorite.checked
  const artistToUpdate = {
    name,
    image,
    birthdate,
    activeSince,
    genres,
    labels,
    website,
    shortDescription,
    favorite
  };
  const id = selectedArtist.id
  console.log(id, "vis id på update target");
  const response = await updatedArtist(artistToUpdate, id);
  if (response.ok) {
    updateArtistsGrid();
  }
}
function selectArtist(artist) {
  selectedArtist = artist;
  const form = document.querySelector("#form-update");
  form.name.value = artist.name;
  form.image.value = artist.image;
  form.birthdate.value = artist.birthdate;
  form.activeSince.value = artist.activeSince;
  form.genres.value = artist.genres;
  form.labels.value = artist.labels;
  form.website.value = artist.website;
  form.shortDescription.value = artist.shortDescription;
  form.scrollIntoView({ behavior: "smooth" });
}

// ================== DELETE ============ //
function deleteArtistClicked(artistID) {

  if (window.confirm("Are you sure you want to remove this artist?")) {
    deleteArtistYes(artistID);
  }
}
function deleteArtistYes(id) {
  const response = deleteArtist(id);
  if (response.ok) {
    updateArtistsGrid();
  }
}

// ============ Sortering og filtrering ============ //
async function showArtistsAll() {
  const listOfAll = await getArtists();
 console.log(listOfAll, "liste til filter&sort her");
  const sortedList = sortArtists(listOfAll);
  console.log(sortedList, "sorteret liste her");
  const filteredList = filterList(sortedList);
  console.log(filteredList, "filtered liste her");
  updateArtistsGrid(filteredList);
}

// Sortering
let valueToSortBy = "";
function setSort() {
  valueToSortBy = document.querySelector("#sort-by").value;
  showArtistsAll();
}
function sortArtists(listOfArtists) {
  if (valueToSortBy === "") {
    return listOfArtists;
  }
  if (valueToSortBy === "name") {
    return listOfArtists.sort((artistA, artistB) =>
      artistA.name.localeCompare(artistB.name)
    );
  }
  if (valueToSortBy === "birthdate") {
    return listOfArtists.sort((artistA, artistB) =>
      new Date(artistA.birthdate).getTime() - new Date(artistB.birthdate).getTime());
  }
  if (valueToSortBy === "activeSince") {
    return listOfArtists.sort((artistA, artistB) =>
      artistA.activeSince.localeCompare(artistB.activeSince)
    );
  }
}

// Filtrering
let valueToFilterBy = "";
function chosenFilter() {
  valueToFilterBy = document.querySelector("#filter-by").value;
  showArtistsAll();
}
function filterList(sortedList) {

  if (valueToFilterBy === "") return sortedList;
  if (valueToFilterBy === "Pop")
    return sortedList.filter((artist) =>
      artist.genres.includes(valueToFilterBy)
    );
  else if (valueToFilterBy === "Rap")
    return sortedList.filter((artist) =>
      artist.genres.includes(valueToFilterBy)
    );
  else if (valueToFilterBy === "Reggae")
    return sortedList.filter((artist) =>
      artist.genres.includes(valueToFilterBy)
    );
  else if (valueToFilterBy === "Hiphop")
    return sortedList.filter((artist) =>
      artist.genres.includes(valueToFilterBy)
    );
  else if (valueToFilterBy === "R&B")
    return sortedList.filter((artist) =>
      artist.genres.includes(valueToFilterBy)
    );
  else
    return sortedList
}

// ============ FAVORITES ============ //
async function favoritesClicked(event) {
  const isChecked = event.target.checked;
  console.log(isChecked);
  if (isChecked) {
    displayArtists(favoriteIds);
  } else {
    const artists = await getArtists();
    updateArtistsGrid(artists);
  }
}
async function getFavorites() {
  const response = await fetchFavorites();
  const data = await response.json();
  return data;
}