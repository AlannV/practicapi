import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "../Card/Card";
import Paging from "../Paging/Paging";
import { getCharacters } from "../../Redux/actions/actions";

function Home() {
  const dispatch = useDispatch();

  const allCharacters = useSelector((state) => state.characters);
  const [charactersPerPage, setCharactersPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastCharacter = currentPage * charactersPerPage;
  const indexOfFirstCharacter = indexOfLastCharacter - charactersPerPage;
  const currentCharacters = allCharacters.slice(
    indexOfFirstCharacter,
    indexOfLastCharacter
  );

  const page = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    dispatch(getCharacters());
  }, []);

  return (
    <div>
      <Paging
        allCharacters={allCharacters.length}
        charactersPerPage={charactersPerPage}
        page={page}
        currentPage={currentPage}
      />
      {currentCharacters.map((char) => (
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
}

export default Home;
