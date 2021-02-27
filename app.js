const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(morgan("common"));

const apps = require("./playstore.js");

app.get("/apps", (req, res) => {
  const { genre = "", sort } = req.query;

  let results = apps;

  if (genre) {
    if (
      !["Action", "Puzzle", "Strategy", "Casual", "Arcade", "Card"].includes(
        genre
      )
    ) {
      return res
        .status(400)
        .send(
          "Genre must be one of Action, Puzzle, Strategy, Casual, Arcade, or Card"
        );
    }
    results = results.filter((app) =>
      app.Genres.toLowerCase().includes(genre.toLowerCase())
    );
  }

  if (sort) {
    if (!["Rating", "App"].includes(sort)) {
      return res.status(400).send("Sort must be one of Rating or App");
    }
    results.sort((a, b) => {
      if (sort === "App") {
        return a[sort].toLowerCase() > b[sort].toLowerCase()
          ? 1
          : a[sort].toLowerCase() < b[sort].toLowerCase()
          ? -1
          : 0;
      } else {
        return b[sort] - a[sort];
      }
    });
  }

  res.json(results);
});

module.exports = app;
