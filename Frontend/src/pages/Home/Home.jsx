import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <section className="home-top">
        <div className="home-top-left">
          <h1>
            Play & Host <br />
            <span id="webgame-highlight">Web Games </span>
            Instantly
          </h1>
          <p>
            No downloads. No installs. <br /> Upload web games or play <br />
            directly in the browser
          </p>
          <div className="home-top-left-buttons">
            <button style={{backgroundColor:"#2563EB" , color:"white"}}>Explore Games</button>
            <button style={{backgroundColor:"#111630" , border: "1px solid white", color:"white"}}>For Developers</button>
          </div>
        </div>
        <div className="laptop-wrapper">
          <img className="laptop-frame" src="/images/home/laptopframe.png" alt="frame" />
          <img className="laptop-screen" src="/images/home/laptopcontentimage.jpg" alt="content" />
        </div>
      </section>
    </div>
  );
};

export default Home;
