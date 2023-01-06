FASE 1 CREACION DE MODELS

Character model

```JS
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("character", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    family: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};
```

Family model

```JS
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("family", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};
```

CREAMOS EL .ENV CON LOS SIGUIENTES DATOS

```JS
DB_USER="" <- aca va tu usuario de postgres
DB_PASSWORD="" <-aca va tu contraseña de postgres
DB_HOST="localhost"
DB_NAME="game_of_thrones"
```

IMPORTAMOS LOS MODELS EN EL DB.JS

```JS
const { Character, Family } = sequelize.models;
```

CREAMOS LAS RELACIONES

```JS
Character.belongsToMany(Family, { through: "familyCharacter" });
Family.belongsToMany(Character, { through: "familyCharacter" });
```

ABRIMOS EL PG ADMIN E INICIALIZAMOS LA BASE DE DATOS

Una vez abierto el pgAdmin4 corremos npm start y arrancamos nuestro back

CREAMOS NUESTRO PRIMER CONTROLADOR, EL CHARACTERCONTROLLER
Y CREAMOS NUESTRA PRIMER FUNCION ADDCHARACTER

```JS
const { Character, Temperament } = require("../db");
const axios = require("axios");
require("dotenv").config();
const { API_URL } = process.env;
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

module.exports = {
  addCharacter,
};
```

CREAMOS LA PRIMER RUTA PARA COMPROBAR QUE ESTE FUNCIONANDO 

```JS
const { Router } = require("express");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const characterController = require("../controllers/characterController.js");

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.post("/characters", characterController.addCharacter);

module.exports = router;
```

CREAMOS LA SEGUNDA RUTA, PARA QUE NOS DEVUELVA EL CHARACTER QUE ACABAMOS DE CREAR

```JS
router.get("/characters", characterController.getAllCharacters);
```

Y SU RESPECTIVO CONTROLADOR

```JS
async function getAllCharacters(req, res, next) {
  try {
    const characters = await Character.findAll();
    return res.status(200).json(characters);
  } catch (err) {
    next(err);
  }
}
```

UNA VEZ QUE TENGAMOS EL CREATE, VAMOS A LLENAR LA BASE DE DATOS CON LOS CHARACTERS
QUE VIENEN DE LA API EXTERNA PARA ESO, VAMOS A CREAR UN UNA FUNCION QUE EN ESTE 
CASO SE VA A LLAMAR DBFILLER

```JS
require("dotenv").config();
const { API_URL } = process.env;
const axios = require("axios");
const { Character } = require("../db.js");

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
  } catch (err) {
    next(err);
  }
}

module.exports = {
  dbFiller,
};
```

UNA VEZ CREADA, LO APLICAMOS EN EL INDEX.JS, TENIENDO EN CUENTA QUE SOLO
DEBE EJECUTARSE UNA VEZ AL INICIAR EL SERVER

```JS
const dbFiller = require("./controllers/dbFiller.js");

var isExecuted = false;

if (!isExecuted) {
  isExecuted = true;
  dbFiller.dbFiller();
}
```

CON ESTO YA TENDRIAMOS TANTO LA RUTA DE GET, COMO LA DE POST, ASI QUE PASAREMOS
A CREAR LAS QUE FALTAN, PRIMERO VAMOS A CREAR UNA RUTA PARA LLAMAR UN PERSONAJE 
UTILIZANDO SU ID
```JS
async function getById(req, res, next) {
  try {
    const { id } = req.params;
    const character = await Character.findByPk(id);
    if (character === null) {
      return res.status(404).json({ message: "Character not found" });
    }
    return res.status(200).json(character);
  } catch (err) {
    next(err);
  }
}
```
CREAMOS LA RUTA CORRESPONDIENTE PARA CHEQUEAR QUE ESTE FUNCIONANDO

```JS
router.get("/characters/:id", characterController.getById);
```

AHORA CREAMOS EL CONTROLADOR Y LA RUTA PARA BUSCAR UN PERSONAJE POR NOMBRE

```JS
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
```

```JS
router.get("/byName/", characterController.getByName);

```

AHORA PARA LA ULTIMA RUTA, NECESITAMOS AGREGAR A NUESTRO DBFILLER UNA FUNCION
QUE TOME LOS NOMBRES DE LAS FAMILIAS, FILTRE LOS DUPLICADOS Y LOS GUARDE EN LA BASE DE 
DATOS, PARA ASI LUEGO PODER CREAR UNA RUTA QUE NOS DEVUELVA SOLO LAS FAMILIAS

```JS
const { Character, Family } = require("../db.js");

//AGREGAMOS ESTO DENTRO DEL TRY EXISTENTE
    const families = data.map((character) => character.family);
    const uniqueFamilies = [...new Set(families)];
    uniqueFamilies.map(async (family) => {
      await Family.create({
        name: family,
      });
    });
```

AHORA CREAMOS EN EL CONTROLLER 

```JS
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

```

AGREGAMOS LA RUTA CORRESPONDIENTE

```JS
router.get("/families", familyController.getAllFamilies);
```

CON ESTO YA TENDRIAMOS EL BACK COMPLETO, DETALLES MAS, DETALLES MENOS
SIEMPRE SE PUEDE MEJORAR, O MODIFICAR PARA LOGRAR LO QUE NECESITEN O 
QUIERAN USTEDES

AHORA PASAMOS AL FRONT

VAMOS A EMPEZAR CREANDO LOS COMPONENTES BASE QUE VAMOS A NECESITAR PARA 
LAS RUTAS, EL LANDING, EL HOME, EL CREATE Y EL DETAIL Y LA CARD, UNA VEZ 
QUE LOS TENEMOS COMPLETOS HACEMOS EL RUTEO EN EL ARCHIVO APP.JS


```JS
import "./App.css";
import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Landing from "./Components/Landing/Landing";
import Home from "./Components/Home/Home";
import CharacterCreate from "./Components/CharacterCreate/CharacterCreate";
import Detail from "./Components/Detail/Detail";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route exact path="/home" component={Home} />
          <Route exact path="/characterCreate" component={CharacterCreate} />
          <Route exact path="/detail/:id" component={Detail} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
```

UNA VEZ QUE TENEMOS EL RUTEO FUNCIONANDO, PASAMOS A ARMAR LA ESTRUCTURA
DE REDUX, PRIMERO CREAMOS LAS CARPETAS ACTIONS, ACTIONTYPES, REDUCER, STORE
UNA VEZ CREADOS TODOS LOS ARCHIVOS, VAMOS A CREAR NUESTRO REDUCER PARA PODER
ARMAR NUESTRA STORE Y EMPEZAR A TRABAJAR CON ESTADOS GLOBALES

REDUCER.JS
```JS
const initialState = {
  characters: [],
  families: [],
};

export default function rootReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}

```

UNA VEZ CREADO EL REDUCER VAMOS A CREAR NUESTRA STORE

```JS
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import reducer from "../reducer/reducer";

export const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(thunk))
);
```

YA QUE TENGAMOS TANTO EL REDUCER COMO EL STORE, PODEMOS PASAR
A ENVOLVER NUESTRA APP EN EL PROVIDER PARA COMENZAR A UTILIZAR
REDUX, ESTO LO HACEMOS EN EL ARCHIVO INDEX.JS

```JS
import { Provider } from "react-redux";
import { store } from "./Redux/store/store";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
```

YA TENEMOS UNA SUERTE DE MAQUETA FUNCIONAL DEL FRONT, ASI QUE NO 
QUEDA MAS QUE IR PASO A PASO CUMPLIENDO CON LOS REQUISITOS QUE 
NOS PIDEN.

AHORA VAMOS A HACER UN .ENV, PARA GUARDAR LAS URLS QUE VAMOS A 
UTILIZAR, ASI NO TENDREMOS QUE UTILIZAR STRINGS LITERALES, PARA 
SABER QUE URLS VAMOS A UTILIZAR ES FACIL, SON LAS RUTAS O ENDPOINTS
QUE CREAMOS EN NUESTRO BACK!

```JS
URL_CREATE_CHARACTER = "http://localhost:3001/characters"
URL_ALL_CHARACTERS = "http://localhost:3001/characters"
URL_GET_CHARACTER_BY_ID = "http://localhost:3001/characters/:id"
URL_GET_CHARACTER_BY_NAME = "http://localhost:3001/byName/"
URL_ALL_FAMILIES = "http://localhost:3001/families"
```

YA CON ESTO PODEMOS EMPEZAR A DARLE FULL A NUESTRO FRONT, LO PRIMERO
QUE VAMOS A HACER VA A SER CREAR LA ACCIÓN QUE NOS VA A HACER LA PETICION
A NUESTRO BACK PARA TRAERNOS TODOS LOS PERSONAJES DE LA SERIE

```JS
import axios from "axios";

export function getCharacters() {
  return async function (dispatch) {
    let response = await axios.get("http://localhost:3001/characters");
    return dispatch({
      type: "GET_CHARACTERS",
      payload: response.data,
    });
  };
}

```

UNA VEZ CREADA LA ACCIÓN, VAMOS A PROCEDER A CREAR EL CASO QUE VA A 
MANEJAR LA RESPUESTA EN NUESTRO REDUCER

```JS
    case "GET_CHARACTERS":
      return {
        ...state,
        characters: action.payload,
      };
```

YA TENEMOS LA ACCION CREADA, Y EL REDUCER QUE VA A GUARDAR LA INFO EN
NUESTRO ESTADO, AHORA, TENEMOS QUE LLAMARLA DESDE NUESTRO HOME, PARA ASI
PODER EMPEZAR A VER LA INFO EN NUESTRO FRONT!

```JS
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCharacters } from "../../Redux/actions/actions";

function Home() {
  const dispatch = useDispatch();

  const allCharacters = useSelector((state) => state.characters);

  useEffect(() => {
    dispatch(getCharacters());
  }, []);
  return (
    <div>
      Home
    </div>
  );
}

export default Home;
```

YA CON ESTA INFO, PODEMOS CREAR TARJETAS, O CARDS, DE CADA UNO DE LOS 
PERSONAJES, PARA ESO OBVIAMENTE, NECESITAMOS UN COMPONENTE QUE SE ENCARGUE
DE TAL FUNCION, ASI QUE VAMOS A MODIFICAR NUESTRO COMPONENTE CARD PARA QUE
CUMPLA TAL FUNCION

```JS
import React from "react";

function Card({ id, firstName, lastName, fullName, title, imageUrl }) {
  return (
    <div>
      <h1>{fullName}</h1>
      <h3>
        {firstName} {lastName}
      </h3>
      <h3>{title}</h3>
      <img src={imageUrl} alt={fullName} />
    </div>
  );
}

export default Card;
```

YA CON NUESTRA ACCION, Y NUESTRO COMPONENTE CARD CREADO, PASAMOS A LLAMARLO
DESDE EL HOME, PARA PODER VER GRAFICAMENTE LOS DATOS QUE TRAEMOS DE NUESTRO BACK

```JS
import Card from "../Card/Card";

  return (
    <div>
      Home
      {allCharacters.map((char) => (
        <Card
          id={char.id}
          firstName={char.firstName}
          lastName={char.lastName}
          fullName={char.fullName}
          title={char.title}
          imageUrl={char.imageUrl}
        />
      ))}
    </div>
  );
```
