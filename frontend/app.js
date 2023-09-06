"use strict";

const artistDatabase = "http://localhost:3333";
let selectedArtist;

window.addEventListener("load", initApp);

async function initApp(params) {
  updateArtistsGrid();

    document.querySelector("#form-create").addEventListener("submit", createArtist);
    document.querySelector("#form-update").addEventListener("submit", updateArtist);
}
async function updateArtistsGrid() {
  const artists = await getArtists();
  displayArtists(artists);
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
      .addEventListener("click", () => deleteArtistClicked(artist.id));
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
  const response = await fetch(`${artistDatabase}/artists/${selectedArtist.id}`, {
    method: "PUT",
    body: artistAsJson,
    headers: {
      "Content-type": "application/json",
    },
  });
  if (response.ok) {
    updateArtistsGrid();
  }
}

// ================== DELETE ============ //
function deleteArtistClicked(artist) {
  if (window.confirm("Are you sure you want to remove this artist?")) {
    deleteArtist(artist);
  }
}
async function deleteArtist(id) {
  const response = await fetch(`${artistDatabase}/artists/${id}`, {
    method: "DELETE",
  });
  if (response.ok) {
    updateArtistsGrid();
  }
}
