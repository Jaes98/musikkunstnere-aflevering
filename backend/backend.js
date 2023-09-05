// -- Imports --
import express from "express";
import fs from "fs/promises";
import cors from "cors";

const app = express();
const port = 3333;

app.use(express.json())
app.use(cors());
// app.use(())

app.listen(port, () => {
    console.log(`App running on http://localhost;${port}`);
});

// -- REST Ruter --
app.get("/", (request, response) => {
    response.send("Velkommen");
});

app.get("/test", (request, response) =>  {
    response.send("siuu");
});

app.get("/artists", async (request, response) => {
    const data = await fs.readFile("data.json");
    const artists = JSON.parse(data)
    console.log(artists);

    // sorterer listen der bliver sendt tilbage til frontenden
    artists.sort((a, b) => a.name.localeCompare(b.name));
    if (!artists) {
        return res.status(400).json({ error: "User already exists" });
    } else {
         response.json(artists)
    } 
})
app.post("/artists", async (request, response) => {
    const newArtists = request.body;
    newArtists.id = new Date().getTime();
    console.log(newArtists);

    const data = await fs.readFile("data.json");
    const artists = JSON.parse(data)

    artists.push(newArtists);
    console.log(newArtists);

    fs.writeFile("data.json", JSON.stringify(artists));

    response.json(artists);
});

app.patch("/artists/:id", async (request, response) => {
    const id = Number(request.params.id);
    console.log(id);

    const data = await fs.readFile("data.json");
    const artists = JSON.parse(data);

    let artistToUpdate = artists.find(artist => artist.id === id)

    const body = request.body;
    console.log(body);
    artistToUpdate.name = body.name;
    artistToUpdate.birthday = body.birthday;
    artistToUpdate.genre = body.genre
    artistToUpdate.latestAlbum = body.latestAlbum
    artistToUpdate.image = body.image;

    fs.writeFile("data.json", JSON.stringify(artists));
    response.json(artists);

})

app.delete("/artists/:id", async (request, response) => {
    const id = Number(request.params.id);
    console.log(id);

    const data = await fs.readFile("data.json");
    const artists = JSON.parse(data);

    const newartists = artists.filter(artist => artist.id !==id)

    fs.writeFile("data.json", JSON.stringify(newartists));

    response.json(artists);
})



