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

export function createCharacter(payload) {
  return async function (dispatch) {
    const create = await axios
      .post("http://localhost:3001/character", payload)
      .then((res) => res.status === 200 && alert("Character created!"))
      .catch((err) => alert("Error creating character"));
  };
}
