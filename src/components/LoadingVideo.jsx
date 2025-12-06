import React from "react";
import "./LoadingVideo.css";
import loadingVideo from "../assets/videos/loadingVideo.mp4";

const LoadingVideo = () => (
  <div className="loading-video-container">
    <video autoPlay loop muted className="loading-video">
      <source src={loadingVideo} type="video/mp4" />
    </video>
  </div>
);

export default LoadingVideo;
