const { Family } = require("../db");

async function getAllFamilies(req, res, next) {
  try {
    const families = await Family.findAll();
    return res.status(200).json(families);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllFamilies,
};
