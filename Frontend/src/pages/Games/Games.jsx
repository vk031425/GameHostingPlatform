import "./Games.css";
import GameCard from "../../components/GameCard/GameCard";
const Games = () => {
  return (
    <div className="games-page-container">
      <div className="game-page-top">
        <ul>
          <li>
            <button className="category-button">All</button>
          </li>
          <li>
            <button className="category-button">Action</button>
          </li>
          <li>
            <button className="category-button">Puzzle</button>
          </li>
          <li>
            <button className="category-button">Multiplayer</button>
          </li>
          <li>
            <button className="category-button">Strategy</button>
          </li>
          <li>
            <button className="category-button">New</button>
          </li>
          <li>
            <button className="category-button">Popular</button>
          </li>
        </ul>
        <div className="game-page-searchbar">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input type="text" placeholder="Search game.." />
        </div>
      </div>

      <h1>Action</h1>

      <div className="game-page-gamesgrid">
        <GameCard
          source="/images/home/FeaturedGames/lulf.jpg"
          title="Wonder Fighter"
          gameId="wonder123"
        />
        <GameCard
          source="/images/home/FeaturedGames/lulf.jpg"
          title="Wonder Fighter"
          gameId="wonder123"
        />
        <GameCard
          source="/images/home/FeaturedGames/lulf.jpg"
          title="Wonder Fighter"
          gameId="wonder123"
        />
        <GameCard
          source="/images/home/FeaturedGames/lulf.jpg"
          title="Wonder Fighter"
          gameId="wonder123"
        />
        <GameCard
          source="/images/home/FeaturedGames/lulf.jpg"
          title="Wonder Fighter"
          gameId="wonder123"
        />
        <GameCard
          source="/images/home/FeaturedGames/lulf.jpg"
          title="Wonder Fighter"
          gameId="wonder123"
        />
        <GameCard
          source="/images/home/FeaturedGames/lulf.jpg"
          title="Wonder Fighter"
          gameId="wonder123"
        />
        <GameCard
          source="/images/home/FeaturedGames/lulf.jpg"
          title="Wonder Fighter"
          gameId="wonder123"
        />
        <GameCard
          source="/images/home/FeaturedGames/lulf.jpg"
          title="Wonder Fighter"
          gameId="wonder123"
        />
        <GameCard
          source="/images/home/FeaturedGames/lulf.jpg"
          title="Wonder Fighter"
          gameId="wonder123"
        />
        <GameCard
          source="/images/home/FeaturedGames/lulf.jpg"
          title="Wonder Fighter"
          gameId="wonder123"
        />
        <GameCard
          source="/images/home/FeaturedGames/lulf.jpg"
          title="Wonder Fighter"
          gameId="wonder123"
        />
        <GameCard
          source="/images/home/FeaturedGames/lulf.jpg"
          title="Wonder Fighter"
          gameId="wonder123"
        />
        <GameCard
          source="/images/home/FeaturedGames/lulf.jpg"
          title="Wonder Fighter"
          gameId="wonder123"
        />
        <GameCard
          source="/images/home/FeaturedGames/lulf.jpg"
          title="Wonder Fighter"
          gameId="wonder123"
        />
        <GameCard
          source="/images/home/FeaturedGames/lulf.jpg"
          title="Wonder Fighter"
          gameId="wonder123"
        />
        <GameCard
          source="/images/home/FeaturedGames/lulf.jpg"
          title="Wonder Fighter"
          gameId="wonder123"
        />
        <GameCard
          source="/images/home/FeaturedGames/lulf.jpg"
          title="Wonder Fighter"
          gameId="wonder123"
        />
        <GameCard
          source="/images/home/FeaturedGames/lulf.jpg"
          title="Wonder Fighter"
          gameId="wonder123"
        />
        <GameCard
          source="/images/home/FeaturedGames/lulf.jpg"
          title="Wonder Fighter"
          gameId="wonder123"
        />
        <GameCard
          source="/images/home/FeaturedGames/lulf.jpg"
          title="Wonder Fighter"
          gameId="wonder123"
        />
        <GameCard
          source="/images/home/FeaturedGames/lulf.jpg"
          title="Wonder Fighter"
          gameId="wonder123"
        />
        <GameCard
          source="/images/home/FeaturedGames/lulf.jpg"
          title="Wonder Fighter"
          gameId="wonder123"
        />
        <GameCard
          source="/images/home/FeaturedGames/lulf.jpg"
          title="Wonder Fighter"
          gameId="wonder123"
        />
        <GameCard
          source="/images/home/FeaturedGames/lulf.jpg"
          title="Wonder Fighter"
          gameId="wonder123"
        />
      </div>

      <div className="home-page-pagejumpbuttons-container">
        <button className="pagejumpbutton" >{"<"}</button>
        <button className="pagejumpbutton" >1</button>
        <button className="pagejumpbutton" >2</button>
        <button className="pagejumpbutton" >3</button>
        <button className="pagejumpbutton" >4</button>
        <button className="pagejumpbutton" >{">"}</button>
      </div>
    </div>
  );
};

export default Games;
