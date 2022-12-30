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
