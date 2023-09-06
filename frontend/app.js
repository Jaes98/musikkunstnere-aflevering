"use strict";

const artistDatabase = "http://localhost:3333";
let selectedArtist;
let listOfArtists;

window.addEventListener("load", initApp);

async function initApp(array) {
  console.log("kører den?");
  const artists = await getArtists();
    listOfArtists = artists;
    updateArtistsGrid(artists);
    eventListenersAdd();
}

function eventListenersAdd(params) {
  document
    .querySelector("#form-create")
    .addEventListener("submit", createArtist);
  document
    .querySelector("#form-update")
    .addEventListener("submit", updateArtist);
  document.querySelector("#sort-by").addEventListener("change", setSort);
  document.querySelector("#filter-by").addEventListener("change", chosenFilter);
}
async function updateArtistsGrid(list) {
  console.log(list, "det her sendes til display");
  displayArtists(list);
}

async function getArtists(params) {
  const artistsFromDatabase = await fetch(`${artistDatabase}/artists`);
  console.log(artistsFromDatabase);
  return await artistsFromDatabase.json();
}

function displayArtists(artistList) {
  // reset <section id="artists-grid" class="grid-container">...</section>
  document.querySelector("#artists-grid").innerHTML = "";
  //loop through all artists and create an article with content for each
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
    </article>
        `
    );
    document
      .querySelector("#artists-grid article:last-child .delete-btn")
      .addEventListener("click", () => deleteArtist(artist.id));
    document
      .querySelector("#artists-grid article:last-child .update-btn")
      .addEventListener("click", () => selectArtist(artist));
  }
}

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
  const newArtist = {
    name,
    image,
    birthdate,
    activeSince,
    genres,
    labels,
    website,
    shortDescription,
  };
  const artistAsJson = JSON.stringify(newArtist);
  const response = await fetch(`${artistDatabase}/artists`, {
    method: "POST",
    body: artistAsJson,
    headers: {
      "Content-type": "application/json",
    },
  });

  if (response.ok) {
    updateArtistsGrid();
  }
}

// ============ UPDATE ============ //
function selectArtist(artist) {
  // Set global varaiable
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
  // update artist
  const artistToUpdate = {
    name,
    image,
    birthdate,
    activeSince,
    genres,
    labels,
    website,
    shortDescription,
  };
  const artistAsJson = JSON.stringify(artistToUpdate);
  const response = await fetch(
    `${artistDatabase}/artists/${selectedArtist.id}`,
    {
      method: "PUT",
      body: artistAsJson,
      headers: {
        "Content-type": "application/json",
      },
    }
  );
  if (response.ok) {
    updateArtistsGrid();
  }
}

// ================== DELETE ============ //
// function deleteArtistClicked(artist) {
//   if (window.confirm("Are you sure you want to remove this artist?")) {
//     deleteArtist(artist);
//   }
// }
async function deleteArtist(id) {
  const response = await fetch(`${artistDatabase}/artists/${id}`, {
    method: "DELETE",
  });
  if (response.ok) {
    updateArtistsGrid();
  }
}

/* Sortering & Filtrering */
async function showArtistsAll() {
  const listOfAll = await getArtists();
 console.log(listOfAll, "liste til filter&sort her");
  const sortedList = sortArtists(listOfAll);
  console.log(sortedList, "sorteret liste her");
  const filteredList = filterList(sortedList);
  console.log(filteredList, "filtered liste her");
  // if (filteredList.length === 0) {
  //   const noResultsHtml = /* html */ `<p>Ingen resultater fundet.</p>`;
  //   document.querySelector("#artists-grid").innerHTML = noResultsHtml;
  // } else 
  updateArtistsGrid(filteredList);
}

let valueToSortBy = "";
function setSort() {
  valueToSortBy = document.querySelector("#sort-by").value;
  showArtistsAll();
}
let valueToFilterBy = "";
function chosenFilter() {
  valueToFilterBy = document.querySelector("#filter-by").value;
  showArtistsAll();
}

// Sortering
function sortArtists(listOfArtists) {
  console.log("sorterer vi?");
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
      artistA.birthdate.localeCompare(artistB.birthdate)
    );
  }
  if (valueToSortBy === "activeSince") {
    return listOfArtists.sort((artistA, artistB) =>
      artistA.activeSince.localeCompare(artistB.activeSince)
    );
  }
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