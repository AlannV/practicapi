const initialState = {
  characters: [],
  families: [],
};

export default function rootReducer(state = initialState, action) {
  switch (action.type) {
    case "GET_CHARACTERS":
      return {
        ...state,
        characters: action.payload,
      };
    default:
      return state;
  }
}
