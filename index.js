"use strict";

const serverless = require("serverless-http");
const express = require("express");
const app = express();
const axios = require("axios");
require("dotenv").config();

const {
  createPokemon,
  getPokemon,
  getPokemonById,
  getPokemonByName,
  deletePokemon,
} = require("./dynamo");

const baseUrl = process.env.API_BASE_URL;
const numberOfPokemons = 898;

app.post("/pokemon/all", async (req, res) => {
  for (let i = 1; i <= numberOfPokemons; i++) {
    const {
      data: {
        id,
        name,
        types,
        sprites: { front_default },
      },
    } = await axios.get(baseUrl + i);
    console.log(
      "Pokémon " + i + " of " + numberOfPokemons + " registered - " + name
    );
    let pokemon = { id: id.toString(), pokeName: name, types, front_default };
    try {
      await createPokemon(pokemon);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  res.status(200).json({ message: "Pokédex Completed!" });
});

app.get("/pokemon", async (req, res) => {
  try {
    const pokemon = await getPokemon();
    res.json(pokemon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/pokemon/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const pokemon = await getPokemonById(id);
    res.json(pokemon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/pokemon/name/:name", async (req, res) => {
  const name = req.params.name;
  try {
    const pokemon = await getPokemonByName(name);
    res.json(pokemon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/pokemon/:id", async (req, res) => {
  const { id } = req.params;
  try {
    res.json(await deletePokemon(id));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports.handler = serverless(app);
