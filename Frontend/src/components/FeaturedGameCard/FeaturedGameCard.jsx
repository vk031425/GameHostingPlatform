import "./FeaturedGameCard.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import API from "../../config/api";
import { useEffect } from "react";

const FeaturedGameCard = (props) => {
  const [data,setData] = useState([]);

  // const getData = async() =>{
  //   const response = await API.get("/games/tombraider213");
  //   console.log(response);
  //   setData(response.data);
  // }

  // useEffect(()=>{
  //   getData();
  // },[])

  return (
    <div className="feature-card">
      {props.cardtag && (
        <div className="card-tag">
          <h1>{props.cardtag}</h1>
        </div>
      )}
      <img src={props.source} alt="card" />
      <div className="feature-card-content">
        <h2>{props.title}</h2>
        <button>
          <Link
            className="feature-card-button-link"
            to={`/game/${data.gameurl}`}
          >
            Play Now
          </Link>
        </button>
      </div>
    </div>
  );
};

export default FeaturedGameCard;
