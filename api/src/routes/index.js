const { Router } = require("express");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const characterController = require("../controllers/characterController.js");
const familyController = require("../controllers/familyController.js");

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.post("/characters", characterController.addCharacter);
router.get("/characters", characterController.getAllCharacters);
router.get("/characters/:id", characterController.getById);
router.get("/byName/", characterController.getByName);
router.get("/families", familyController.getAllFamilies);

module.exports = router;
