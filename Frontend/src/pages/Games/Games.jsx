import "./Games.css";
import GameCard from "../../components/GameCard/GameCard";
import { useEffect, useState } from "react";
import API from "../../config/api";
import { categoriesList } from "../../utils/categoriesList.js";

const Games = () => {
  const [games, setGames] = useState([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sort, setSort] = useState("new");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 6;

  const visibleCategories = categoriesList.slice(
  startIndex,
  startIndex + visibleCount
);

const handlePrev = () => {
  setStartIndex((prev) =>
    prev - visibleCount >= 0 ? prev - visibleCount : 0
  );
};

const handleNext = () => {
  if (startIndex + visibleCount < categoriesList.length) {
    setStartIndex((prev) => prev + visibleCount);
  }
};

  const fetchGames = async () => {
    try {
      setLoading(true);

      const res = await API.get(
        `/games?category=${category}&search=${search}&sort=${sort}&page=${page}&limit=12`,
      );

      setGames(res.data.games);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Error fetching games:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, [category, search, sort, page]);

  // CATEGORY CLICK
  const handleCategoryClick = (cat) => {
    setCategory(cat);
    setSearch("");
    setSearchInput("");
    setPage(1);
  };

  // SORT CLICK
  const handleSort = (type) => {
    setSort(type);
    setPage(1);
  };

  // SEARCH SUBMIT
  const handleSearchSubmit = (e) => {
    if (e.key === "Enter") {
      const trimmed = searchInput.trim();
      setCategory("All"); // remove category filter
      setSearch(trimmed);
      setPage(1);
    }
  };

  return (
    <div className="games-page-container">
      {/* TOP BAR */}
      <div className="game-page-top">
        <div className="category-wrapper">
          <button
            className="category-nav"
            onClick={handlePrev}
            disabled={startIndex === 0}
          >
            ◀
          </button>

          <div className="category-list">
            <button
              className={`category-button ${
                category === "All" ? "active-category" : ""
              }`}
              onClick={() => handleCategoryClick("All")}
            >
              All
            </button>

            {visibleCategories.map((cat) => (
              <button
                key={cat}
                className={`category-button ${
                  category === cat ? "active-category" : ""
                }`}
                onClick={() => handleCategoryClick(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            className="category-nav"
            onClick={handleNext}
            disabled={startIndex + visibleCount >= categoriesList.length}
          >
            ▶
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="game-page-searchbar">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            placeholder="Search games..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearchSubmit}
          />
        </div>
      </div>

      {/* SORT SECTION */}
      <div className="sort-section">
        <button
          className={`sort-button ${sort === "new" ? "active-sort" : ""}`}
          onClick={() => handleSort("new")}
        >
          New
        </button>

        <button
          className={`sort-button ${sort === "popular" ? "active-sort" : ""}`}
          onClick={() => handleSort("popular")}
        >
          Popular
        </button>

        <button
          className={`sort-button ${sort === "toprated" ? "active-sort" : ""}`}
          onClick={() => handleSort("toprated")}
        >
          Top Rated
        </button>
      </div>

      {/* GAMES GRID */}
      {loading ? (
        <p style={{ color: "white" }}>Loading games...</p>
      ) : games.length > 0 ? (
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
        <p style={{ color: "white" }}>No games found.</p>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
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
      )}
    </div>
  );
};

export default Games;
