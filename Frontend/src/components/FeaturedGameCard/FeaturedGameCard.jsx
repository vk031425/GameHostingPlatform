import "./FeaturedGameCard.css";
import { Link } from "react-router-dom";

const FeaturedGameCard = (props) => {
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
          <Link className="feature-card-button-link" to={props.gamepage}>
            Play Now
          </Link>
        </button>
      </div>
    </div>
  );
};

export default FeaturedGameCard;
