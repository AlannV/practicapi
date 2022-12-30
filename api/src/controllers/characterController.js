const { Character } = require("../db");
const { v4: uuidv4 } = require("uuid");

async function addCharacter(req, res, next) {
  try {
    const id = uuidv4();
    let { firstName, lastName, title, family, imageUrl } = req.body;

    const characterCreated = await Character.create({
      id,
      firstName,
      lastName,
      title,
      family,
      imageUrl,
    });
    return res.status(200).json(characterCreated);
  } catch (err) {
    next(err);
  }
}

async function getAllCharacters(req, res, next) {
  try {
    const characters = await Character.findAll();
    return res.status(200).json(characters);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const { id } = req.params;
    const character = await Character.findByPk(id);
    if (character === null) {
      console.log("hello there at getById");
      return res.status(404).json({ message: "Character not found" });
    }
    return res.status(200).json(character);
  } catch (err) {
    next(err);
  }
}

async function getByName(req, res, next) {
  try {
    const { firstName } = req.query;
    const character = await Character.findOne({
      where: {
        firstName: `${firstName}`,
      },
    });

    if (character === null) {
      return res.status(404).json({ message: "Character not found" });
    }

    res.send(character);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  addCharacter,
  getAllCharacters,
  getById,
  getByName,
};
