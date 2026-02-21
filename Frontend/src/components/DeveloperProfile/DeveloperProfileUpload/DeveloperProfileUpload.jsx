import "./DeveloperProfileUpload.css";
import { useState } from "react";

import UploadBasicInfo from "./UploadBasicInfo";
import UploadMedia from "./UploadMedia";
import UploadGameType from "./UploadGameType";
import UploadPricing from "./UploadPricing";
import UploadPublish from "./UploadPublish";

const DeveloperProfileUpload = () => {
  const [step, setStep] = useState(1);

  // 🔥 Track highest completed step
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
    isPaid: null,
    price: "",
    commission: 0.1,
  });

  const steps = [
    "Basic Info",
    "Media",
    "Game Type",
    "Pricing",
    "Publish",
  ];

  // 🔥 Move forward
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
        />
      )}
    </div>
  );
};

export default DeveloperProfileUpload;