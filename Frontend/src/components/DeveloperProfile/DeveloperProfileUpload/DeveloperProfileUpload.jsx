import "./DeveloperProfileUpload.css";
import { useState } from "react";
import axios from "axios";

import UploadBasicInfo from "./UploadBasicInfo";
import UploadMedia from "./UploadMedia";
import UploadGameType from "./UploadGameType";
import UploadPricing from "./UploadPricing";
import UploadPublish from "./UploadPublish";
import API from "../../../config/api";

const DeveloperProfileUpload = () => {
  const [step, setStep] = useState(1);
  const [isPublishing, setIsPublishing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [publishStage, setPublishStage] = useState("");

  // Track highest completed step
  const [maxCompletedStep, setMaxCompletedStep] = useState(1);

  const [gameData, setGameData] = useState({
    gameTitle: "",
    shortDescription: "",
    description: "",
    categories: [],
    thumbnail: null,
    screenshots: [],
    trailerUrl: "",
    distributionType: "",
    buildFile: null,
    webFiles: [],
    supportedOS: [],
    systemRequirements: "",
    version: "",
    isPremium: null,
    price: "",
  });

  const steps = ["Basic Info", "Media", "Game Type", "Pricing", "Publish"];

  // Move forward
  const nextStep = () => {
    setStep((prev) => {
      const next = prev + 1;

      // update max completed step
      if (next > maxCompletedStep) {
        setMaxCompletedStep(next);
      }

      return next;
    });
  };

  //Move backward
  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  //Step click handler
  const handleStepClick = (targetStep) => {
    if (targetStep <= maxCompletedStep) {
      setStep(targetStep);
    }
  };

  const uploadThumbnail = async (gameId) => {
    if (!gameData.thumbnail) return;

    const { data } = await API.post("/game-upload/get-media-upload-url", {
      gameId,
      fileType: gameData.thumbnail.type,
      mediaType: "thumbnail",
    });

    await axios.put(data.uploadUrl, gameData.thumbnail, {
      headers: { "Content-Type": gameData.thumbnail.type },
      withCredentials: false,
    });

    await API.post("/game-upload/confirm-media-upload", {
      gameId,
      fileKey: data.fileKey,
      mediaType: "thumbnail",
    });
  };

  const uploadScreenshots = async (gameId) => {
    if (!gameData.screenshots?.length) return;

    for (const screenshot of gameData.screenshots) {
      const { data } = await API.post("/game-upload/get-media-upload-url", {
        gameId,
        fileType: screenshot.type,
        mediaType: "screenshot",
      });

      await axios.put(data.uploadUrl, screenshot, {
        headers: { "Content-Type": screenshot.type },
        withCredentials: false,
      });

      await API.post("/game-upload/confirm-media-upload", {
        gameId,
        fileKey: data.fileKey,
        mediaType: "screenshot",
      });
    }
  };

  const handlePublish = async () => {
    let gameId = null;

    try {
      setIsPublishing(true);
      setUploadProgress(0);
      setPublishStage("Creating game...");

      const createRes = await API.post("/game-upload/create", {
        title: gameData.gameTitle,
        description: gameData.description,
        shortDescription: gameData.shortDescription,
        categories: gameData.categories,
        trailerUrl: gameData.trailerUrl,
        distributionType: gameData.distributionType,
        supportedOS: gameData.supportedOS,
        systemRequirements: gameData.systemRequirements,
        isPremium: gameData.isPremium,
        price: gameData.price,
      });

      gameId = createRes.data.gameId;

      // 🔥 Thumbnail
      if (gameData.thumbnail) {
        setPublishStage("Uploading thumbnail...");
        await uploadThumbnail(gameId);
      }

      // 🔥 Screenshots
      if (gameData.screenshots?.length > 0) {
        setPublishStage("Uploading screenshots...");
        await uploadScreenshots(gameId);
      }

      // 🔥 Distribution Upload
      if (gameData.distributionType === "browser") {
        setPublishStage("Uploading web game files...");

        for (const file of gameData.webFiles) {
          const parts = file.webkitRelativePath.split("/");
          parts.shift();
          const relativePath = parts.join("/");

          const { data } = await API.post("/game-upload/get-web-upload-url", {
            gameId,
            filePath: relativePath,
            fileType: file.type || "application/octet-stream",
          });

          await axios.put(data.uploadUrl, file, {
            headers: {
              "Content-Type": file.type || "application/octet-stream",
            },
          });
        }

        await API.post("/game-upload/confirm-web-upload", { gameId });
      } else {
        setPublishStage("Uploading downloadable build...");

        const uploadRes = await API.post("/game-upload/get-upload-url", {
          gameId,
          version: gameData.version,
          fileType: gameData.buildFile.type,
        });

        const { uploadUrl, fileKey } = uploadRes.data;

        await axios.put(uploadUrl, gameData.buildFile, {
          headers: { "Content-Type": gameData.buildFile.type },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setUploadProgress(percent);
          },
        });

        await API.post("/game-upload/confirm-upload", {
          gameId,
          fileKey,
          version: gameData.version,
        });
      }

      setPublishStage("Completed!");
      alert("Game Published Successfully!");
      window.location.reload();
    } catch (err) {
      console.error(err);

      if (gameId) {
        try {
          await API.delete(`/game-upload/delete/${gameId}`);
        } catch (cleanupErr) {
          console.error("Cleanup failed:", cleanupErr);
        }
      }

      alert("Publishing failed. Changes reverted.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="developer-profile-upload-container">
      {/* ================= HEADER ================= */}
      <div className="developer-profile-upload-top">
        <div className="developer-profile-upload-top-left">
          <h1>Upload New Game</h1>
          <p>Create and publish your game to the platform</p>
        </div>
        <button className="save-draft-btn">
          <i className="fa-regular fa-floppy-disk"></i>
          Save Draft
        </button>
      </div>

      {/* ================= STEP INDICATOR ================= */}
      <div className="developer-profile-upload-steps-overview">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isActive = step === stepNumber;
          const isCompleted = maxCompletedStep > stepNumber;

          return (
            <div key={index} className="step-wrapper">
              <button
                className="developer-profile-upload-step"
                onClick={() => handleStepClick(stepNumber)}
              >
                <div
                  className={`step-circle 
                    ${isActive ? "active" : ""} 
                    ${isCompleted ? "completed" : ""}`}
                >
                  {stepNumber}
                </div>

                <p
                  className={`step-label 
                    ${isActive ? "active-label" : ""}`}
                >
                  {label}
                </p>
              </button>

              {index !== steps.length - 1 && (
                <div
                  className={`step-line 
                    ${maxCompletedStep > stepNumber ? "line-completed" : ""}`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* ================= STEP CONTENT ================= */}
      {step === 1 && (
        <UploadBasicInfo
          data={gameData}
          setData={setGameData}
          nextStep={nextStep}
        />
      )}

      {step === 2 && (
        <UploadMedia
          data={gameData}
          setData={setGameData}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      )}

      {step === 3 && (
        <UploadGameType
          data={gameData}
          setData={setGameData}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      )}

      {step === 4 && (
        <UploadPricing
          data={gameData}
          setData={setGameData}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      )}

      {step === 5 && (
        <UploadPublish
          data={gameData}
          prevStep={prevStep}
          goToStep={setStep}
          onPublish={handlePublish}
          isPublishing={isPublishing}
          uploadProgress={uploadProgress}
          publishStage={publishStage}
        />
      )}
    </div>
  );
};

export default DeveloperProfileUpload;
