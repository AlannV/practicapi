require("dotenv").config();
const { API_URL } = process.env;
const axios = require("axios");
const { Character, Family } = require("../db.js");

async function dbFiller(req, res, next) {
  try {
    const { data } = await axios.get(API_URL);
    data.map(async (character) => {
      const { firstName, lastName, title, family, imageUrl } = character;
      await Character.create({
        firstName,
        lastName,
        title,
        family,
        imageUrl,
      });
    });

    const families = data.map((character) => character.family);
    const uniqueFamilies = [...new Set(families)];
    uniqueFamilies.map(async (family) => {
      await Family.create({
        name: family,
      });
    });

    console.log("Data base filled successfully");
  } catch (err) {
    next(err);
  }
}

module.exports = {
  dbFiller,
};
