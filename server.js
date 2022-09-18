const express = require("express");
const PORT = process.env.PORT || 3001;
const path = require("path");
const fs = require("fs");
const app = express();

app.use(express.static("public"));

app.get("/api/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.listen(PORT, () => console.log(`Listening at PORT ${PORT}`));
