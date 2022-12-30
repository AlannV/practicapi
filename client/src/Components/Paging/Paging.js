import React from "react";

export default function Paging({ charactersPerPage, allCharacters, page }) {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(allCharacters / charactersPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div>
      <ul>
        {pageNumbers.map((number) => {
          return <button onClick={() => page(number)}>{number}</button>;
        })}
      </ul>
    </div>
  );
}
