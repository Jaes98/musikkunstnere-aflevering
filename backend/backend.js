// -- Imports --
import express from "express";
import fs from "fs/promises";
import cors from "cors";

const app = express();
const port = 3333;

// -- Middleware --
app.use(express.json());
app.use(cors());

app.listen(port, () => {
  console.log(`App running on http://localhost;${port}`);
});

// -- REST Ruter til artists --
app.get("/", (request, response) => {
  response.send("Velkommen");
});


app.get("/artists", async (request, response) => {
  const artists = getArtists();

  if (!artists) {
    response.status(400).json({ error: "Artists can't be found" });
  } else {
    response.json(artists);
  }
});

app.get("/artists/:id", async (request, response) => {
  const artists = getArtists();
  console.log("Artists er fetched");


  if (!artists) {
    response.status(400).json({ error: "Artists can't be found" });
  } else {
    const id = Number(request.params.id);
    const findArtist = artists.find((artist) => artist.id === id);
    response.json(findArtist);
  }
});


app.post("/artists", async (request, response) => {
  const newArtist = request.body;
  newArtist.id = new Date().getTime();

  const artists = getArtists();

  artists.push(newArtist);

      try {
        await fs.writeFile("data.json", JSON.stringify(artists));
        response.json(artists);$
      } catch (err) {
        response.status(500).json({error: "Server could'nt handle"})
        console.error("Error writing to file:", err);
      }
//   response.json(artists);
});

app.put("/artists/:id", async (request, response) => {
  const id = Number(request.params.id);
  console.log(id, "id på specifikt artist til PUT");

  const artists = getArtists();

  let artistToUpdate = artists.find((artist) => artist.id === id);

  if (!artistToUpdate) {
    return response.status(404).json({ error: "Artist not found" });
  }

  const body = request.body;
  artistToUpdate.name = body.name;
  artistToUpdate.image = body.image;
  artistToUpdate.birthdate = body.birthdate;
  artistToUpdate.activeSince = body.activeSince;
  artistToUpdate.genres = body.genres;
  artistToUpdate.labels = body.labels;
  artistToUpdate.website = body.website;
  artistToUpdate.shortDescription = body.shortDescription;

  await fs.writeFile("data.json", JSON.stringify(artists));
  response.json(artists);
});

app.delete("/artists/:id", async (request, response) => {
  const id = Number(request.params.id);
  console.log(id, "specifik artist id delete");
  const artists = getArtists();
  const newArtist = artists.filter((artist) => artist.id !== id);
  fs.writeFile("data.json", JSON.stringify(newArtist));
  if (!newArtist) {
    response.status(404).json({ error: "Artist not found" });
  } else {
    response.json(newArtist);
  }
});


// -- Rest ruter til favorites --

// get request til favorites
app.get("/favorites", async (request, response) => {
  const favoriteIds = await getFavorites();
  const artists = await getArtists();

  const listFavorites = artists.filter((artist) => favoriteIds.includes(artist.id));

  response.json(listFavorites)
})

// -- post rute til favorites --
app.post("/favorites", async (request, response) => {
  const favID = request.body.id;
  const favorites = await getFavorites();

  if (!favorites.includes(favID)) {
    favorites.push(favID);
    fs.writeFile("favorites.json",JSON.stringify(favorites));
  }

  const artists = await getArtists();
  const listOfFavorites = artists.filter((artist) => favorites.includes(artist.id));
  response.json(listOfFavorites)
});

// -- delete rute til favorites --
app.delete("/favorites/:id", async (request, response) => {
  const favId = Number(request.params.id);
  const listOfFavorites = await getFavorites();

  if (listOfFavorites.includes(favId)) {
    const newFavs = listOfFavorites.filter((id) => id !== favId);
    fs.writeFile("favorites.json", JSON.stringify(newFavs));

    const artists = await getArtists();
    const favorites = artists.filter((artist) => newFavs.includes(artist.id));

    response.json(favorites);
  } else {
    response.status(404).json({ error: "Fejl i systemet" });
  }
});

// Helperfunctions til backend
async function getArtists() {
  const data = await fs.readFile("data.json");
  return JSON.parse(data);
}
async function getFavorites() {
  const data = await fs.readFile("favorites.json");
  return JSON.parse(data);
}