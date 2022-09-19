const express = require("express");
const PORT = process.env.PORT || 3001;
const path = require("path");
const fs = require("fs");
const uniqueId = require("uniqid");
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

// Gets notes stored json data
app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    err ? console.log(err) : res.json(JSON.parse(data));
  });
});

// Posts notes to json data
app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;

  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      id: uniqueId(`note-`),
    };

    // Write the string to a file
    fs.readFile("./db/db.json", "utf-8", (err, data) => {
      err ? console.log(err) : data;

      //   Parse the database array
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

app.delete("/api/notes/:id", (req, res) => {
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    err ? console.log(err) : data;
    const array = JSON.parse(data);

    const chosenNote = array.find((element) => element.id === req.params.id);
    console.log(chosenNote);
    if (!chosenNote) {
      res.status(404).json({
        status: "fail",
        message: "Invalid Id",
      });
    } else {
      const index = array.indexOf(chosenNote);
      array.splice(index, 1);

      fs.writeFile("./db/db.json", JSON.stringify(array), (err) =>
        err ? console.error(err) : res.json(array)
      );
    }
    // array.forEach((element) => {
    //   const currentId = element.id;
    //   const selectedId = req.params.id;
    //   //   console.log(currentId, selectedId);

    //   if (currentId == selectedId) {
    //     return res.status(204).json({
    //       status: "success",
    //       message: `${element} was deleted!`,
    //     });
    //   } else {

    //   }
    // });
  });
});

app.listen(PORT, () => console.log(`Listening at PORT ${PORT}`));
