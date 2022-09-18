const express = require("express");
const PORT = process.env.PORT || 3001;
const path = require("path");
const fs = require("fs");
const db = require("./db/db.json");
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  res.json(db);
});

app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;

  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
    };

    // Write the string to a file
    fs.readFile("./db/db.json", "utf-8", (err, data) => {
      err ? console.log(err) : data;

      //   Parse the database json object array
      const originalData = JSON.parse(data);

      //   Push the new note into the array
      originalData.push(newNote);

      //   Stringify the new updated array
      const result = JSON.stringify(originalData);

      //   Then rewrite the db file
      fs.writeFile("./db/db.json", result, (err) =>
        err ? console.error(err) : console.log(`Modified array: ${result}`)
      );
    });

    const response = {
      status: "success",
      body: newNote,
    };

    res.status(201).json(response);
  } else {
    res.status(500).json("Error in posting review");
  }
});

app.listen(PORT, () => console.log(`Listening at PORT ${PORT}`));
