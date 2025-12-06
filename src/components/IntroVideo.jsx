import React, { useEffect } from "react";
import "./IntroVideo.css";
import introVideo from "../assets/videos/loadingVideo.mp4"; // <-- Your intro video path

const IntroVideo = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 5000); // 5 sec intro video duration

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="intro-video-container">
      <video autoPlay muted className="intro-video">
        <source src={introVideo} type="video/mp4" />
      </video>
    </div>
  );
};

export default IntroVideo;
