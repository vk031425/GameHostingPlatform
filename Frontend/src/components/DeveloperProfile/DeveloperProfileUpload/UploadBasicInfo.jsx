import "./UploadBasicInfo.css";

const categoriesList = [
  "Action",
  "Adventure",
  "RPG",
  "Strategy",
  "Simulation",
  "Puzzle",
  "Arcade",
  "Casual",
  "Sports",
  "Racing",
  "Shooter",
  "Horror",
  "Survival",
  "Platformer",
  "Fighting",
  "Multiplayer",
  "Idle",
  "Card Game",
  "Educational",
  "Sandbox",
  "Open World",
  "Tower Defense",
  "Unity",
  "Unreal Engine",
  "Visual Novel",
  "VR",
  "AR",
  "2D",
  "3D",
];

const UploadBasicInfo = ({ data, setData, nextStep }) => {
  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const toggleCategory = (category) => {
    let updatedCategories;

    if (data.categories.includes(category)) {
      // Remove if already selected
      updatedCategories = data.categories.filter((c) => c !== category);
    } else {
      // Optional: Limit to max 3 categories
      if (data.categories.length >= 5) return;
      updatedCategories = [...data.categories, category];
    }

    setData({
      ...data,
      categories: updatedCategories,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (data.categories.length === 0) {
      alert("Please select at least one category");
      return;
    }

    nextStep();
  };

  return (
    <form onSubmit={handleSubmit} className="developer-profile-upload-form">
      <h1>Basic Info</h1>

      <div className="uploadgame-inputs">
        <div className="uploadgame-inputbox">
          <label>Game Title</label>
          <input
            type="text"
            name="gameTitle"
            placeholder="Enter your game title"
            value={data.gameTitle || ""}
            onChange={handleChange}
            maxLength={50}
            required
          />
        </div>

        <div className="uploadgame-inputbox">
          <label>Short Description</label>
          <textarea
            name="shortDescription"
            rows="3"
            placeholder="Enter a short description of your game"
            value={data.shortDescription || ""}
            maxLength={200}
            onChange={handleChange}
          />
        </div>

        <div className="uploadgame-inputbox">
          <label>Description</label>
          <textarea
            name="description"
            rows="5"
            placeholder="Provide a detailed description of your game, including its features, gameplay and what players can expect."
            value={data.description || ""}
            onChange={handleChange}
            maxLength={10000}
          />
        </div>

        <div className="uploadgame-inputbox">
          <label>Categories (Select up to 5)</label>

          <div className="uploadgame-category-tags">
            {categoriesList.map((category) => (
              <span
                key={category}
                className={`uploadgame-category-tag ${
                  data.categories.includes(category) ? "active" : ""
                }`}
                onClick={() => toggleCategory(category)}
              >
                {category}
              </span>
            ))}
          </div>
        </div>

        <hr className="uploadgame-form-hr" />
        <div className="uploadgame-form-footer">
            <div></div>
          <div className="right-buttons">
            <button
              type="button"
              className="uploadgame-btn cancel-btn"
              onClick={() => window.location.reload()}
            >
              Cancel
            </button>

            <button type="submit" className="uploadgame-btn next-btn">
              Next
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default UploadBasicInfo;
