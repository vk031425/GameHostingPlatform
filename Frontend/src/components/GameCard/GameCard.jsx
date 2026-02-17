import "./GameCard.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import API from "../../config/api";
import { useEffect } from "react";

const GameCard = (props) => {
  return (
    <div className="game-card">
      {props.cardtag && (
        <div className="game-card-tag">
          <h1>{props.cardtag}</h1>
        </div>
      )}
      <img src={props.source} alt="card" />
      <div className="game-card-content">
        <h2>{props.title}</h2>
        <button>
          <Link
            className="game-card-button-link"
            to={`/games/wonderfighter`}
          >
            Play Now
          </Link>
        </button>
      </div>
    </div>
  );
};

export default GameCard;
