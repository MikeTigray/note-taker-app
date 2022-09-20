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

const notesRouter = require("./routes/api/notes/notes");
app.use("/api/notes", notesRouter);

app.listen(PORT, () => console.log(`Listening at PORT ${PORT}`));
