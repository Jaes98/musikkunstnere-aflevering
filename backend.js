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

// -- REST Ruter --
app.get("/", (request, response) => {
  response.send("Velkommen");
});

app.get("/artists", async (request, response) => {
  const data = await fs.readFile("data.json");
  const artists = JSON.parse(data);
  console.log(artists);

  artists.sort((a, b) => a.name.localeCompare(b.name));
  if (!data) {
    response.status(400).json({ error: "Artists can't be found" });
  } else {
    response.json(artists);
  }
});

app.get("/artists:id", async (request, response) => {
  const id = Number(request.body.id);
  const artists = await fs.readFile("data.json");
  const result = artists.find((artist) => artist.id === id);
  console.log(result);
  if (!result) {
    response.status(404).json({ error: "Artist not found" });
  } else response.json(result);
});

app.post("/artists", async (request, response) => {
  const newArtist = request.body;
  newArtist.id = new Date().getTime();
  console.log(newArtist);

  const data = await fs.readFile("data.json");
  const artists = JSON.parse(data);

  artists.push(newArtist);
  console.log(newArtist);

//   fs.writeFile("data.json", JSON.stringify(artists));
      try {
        await fs.writeFile("data.json", JSON.stringify(artists));
        response.json(artists);
      } catch (err) {
        response.status(500).json({error: "Server could'nt handle"})
        console.error("Error writing to file:", err);
      }
//   response.json(artists);
});

app.put("/artists/:id", async (request, response) => {
  const id = Number(request.params.id);
  console.log(id);

  const data = await fs.readFile("data.json");
  const artists = JSON.parse(data);
  console.log(artists);

  let artistToUpdate = artists.find((artist) => artist.id === id);
  console.log(artistToUpdate);

  const body = request.body;
  console.log(body);
  artistToUpdate.name = body.name;
  artistToUpdate.birthday = body.birthday;
  artistToUpdate.genre = body.genre;
  artistToUpdate.latestAlbum = body.latestAlbum;
  artistToUpdate.image = body.image;

  fs.writeFile("data.json", JSON.stringify(artists));
  if (!artistToUpdate) {
    return response.status(404).json({ error: "Artist not found" });
  } else {
    response.json(artists);
  }
});

app.delete("/artists/:id", async (request, response) => {
  const id = Number(request.params.id);
  console.log(id);
  const data = await fs.readFile("data.json");
  const artists = JSON.parse(data);
  const newArtist = artists.filter((artist) => artist.id !== id);
  console.log(artists);
  console.log(newArtist);
  fs.writeFile("data.json", JSON.stringify(newArtist));
  if (!newArtist) {
    response.status(404).json({ error: "Artist not found" });
  } else {
    response.json(newArtist);
  }
});
