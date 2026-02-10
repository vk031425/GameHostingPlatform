const GamePage = () => {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <iframe
        src="https://pub-2a084d30ce654c358a5f896e2b0052a3.r2.dev/web-game-export/index.html"
        width="100%"
        height="100%"
        style={{ border: "none" }}
        allow="fullscreen"
      />
    </div>
  );
};

export default GamePage;
