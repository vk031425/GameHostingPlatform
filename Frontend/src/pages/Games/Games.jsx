import "./Games.css";
import GameCard from "../../components/GameCard/GameCard";
import { useEffect, useState } from "react";
import API from "../../config/api";

const Games = () => {
  const [games, setGames] = useState([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("new");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchGames = async () => {
    try {
      const res = await API.get(
        `/games?category=${category}&search=${search}&sort=${sort}&page=${page}&limit=12`,
      );
      console.log(res.data);
      setGames(res.data.games);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  };

  useEffect(() => {
    fetchGames();
  }, [category, search, sort, page]);

  const handleCategoryClick = (cat) => {
    setCategory(cat);
    setPage(1); // reset page when category changes
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleSort = (type) => {
    setSort(type);
    setPage(1);
  };

  return (
    <div className="games-page-container">
      {/* Top Section */}
      <div className="game-page-top">
        <ul>
          {["All", "Action", "Puzzle", "Multiplayer", "Strategy"].map((cat) => (
            <li key={cat}>
              <button
                className="category-button"
                onClick={() => handleCategoryClick(cat)}
              >
                {cat}
              </button>
            </li>
          ))}

          <li>
            <button
              className="category-button"
              onClick={() => handleSort("new")}
            >
              New
            </button>
          </li>

          <li>
            <button
              className="category-button"
              onClick={() => handleSort("popular")}
            >
              Popular
            </button>
          </li>

          <li>
            <button
              className="category-button"
              onClick={() => handleSort("toprated")}
            >
              Top Rated
            </button>
          </li>
        </ul>

        <div className="game-page-searchbar">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            placeholder="Search game.."
            value={search}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Games Grid */}

      {games.length > 0 ? (
        <div className="game-page-gamesgrid">
          {games.map((game) => (
            <GameCard
              key={game._id}
              gameId={game._id}
              slug={game.slug}
              source={game.thumbnailUrl}
              title={game.title}
              rating={game.rating}
              views={game.views}
              isPremium={game.isPremium}
            />
          ))}
        </div>
      ) : (
        <p>No games found.</p>
      )}

      {/* Pagination */}
      <div className="home-page-pagejumpbuttons-container">
        <button
          className="pagejumpbutton"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          {"<"}
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={`pagejumpbutton ${
              page === index + 1 ? "active-page" : ""
            }`}
            onClick={() => setPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}

        <button
          className="pagejumpbutton"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          {">"}
        </button>
      </div>
    </div>
  );
};

export default Games;
