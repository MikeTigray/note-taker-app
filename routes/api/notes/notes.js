const express = require("express");
const path = require("path");
const fs = require("fs");
const uniqueId = require("uniqid");
const router = express.Router();

// Gets notes stored json data
router.get("/", (req, res) => {
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    err ? console.log(err) : res.json(JSON.parse(data));
  });
});

// Posts notes to json data
router.post("/", (req, res) => {
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

router.delete("/:id", (req, res) => {
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    err ? console.log(err) : data;
    const array = JSON.parse(data);

    const chosenNote = array.find((element) => element.id === req.params.id);

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
  });
});
module.exports = router;
