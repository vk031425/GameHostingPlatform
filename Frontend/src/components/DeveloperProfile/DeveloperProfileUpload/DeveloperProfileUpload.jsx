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

  const handlePublish = async () => {
    try {
      setIsPublishing(true);

      //  Create game
      const createRes = await API.post("/game-upload/create", {
        title: gameData.gameTitle,
        description: gameData.description,
        shortDescription: gameData.shortDescription,
        categories: gameData.categories,
        thumbnailUrl: gameData.thumbnail, // later you upload this too
        screenshots: [], // handle later
        trailerUrl: gameData.trailerUrl,
        distributionType: gameData.distributionType,
        supportedOS: gameData.supportedOS,
        systemRequirements: gameData.systemRequirements,
        isPremium: gameData.isPremium,
        price: gameData.price,
      });

      const gameId = createRes.data.gameId;

      // Get upload URL
      const uploadRes = await API.post("/game-upload/get-upload-url", {
        gameId,
        version: gameData.version,
        fileType: gameData.buildFile.type,
      });

      const { uploadUrl, fileKey } = uploadRes.data;

      // Upload build directly to R2
      await axios.put(uploadUrl, gameData.buildFile, {
        headers: {
          "Content-Type": gameData.buildFile.type,
        },
        withCredentials: false, // force disable cookies
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setUploadProgress(percent);
        },
      });

      //  Confirm upload
      await API.post("/game-upload/confirm-upload", {
        gameId,
        fileKey,
        version: gameData.version,
      });

      alert("Game Published Successfully!");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Publishing failed");
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
        />
      )}
    </div>
  );
};

export default DeveloperProfileUpload;
