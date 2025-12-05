import React, { useState } from "react";
import "./RoomSetupPopup.css";

const RoomSetupPopup = ({ onClose, onGenerate }) => {
  const [floors, setFloors] = useState("");
  const [roomsPerFloor, setRoomsPerFloor] = useState("");
  const [sharing, setSharing] = useState("");
  const [bedsPerRoom, setBedsPerRoom] = useState("");

  const handleSubmit = () => {
    if (!floors || !roomsPerFloor || !sharing || !bedsPerRoom) {
      alert("Please fill out all fields.");
      return;
    }

    onGenerate({ floors, roomsPerFloor, sharing, bedsPerRoom });
    onClose();
  };

  return (
    <div className="popup-overlay">
      <div className="popup-card">
        <h2 className="popup-title">Setup Rooms</h2>

        <div className="popup-input-row">
          <input
            type="number"
            placeholder="Number of Floors"
            value={floors}
            onChange={(e) => setFloors(e.target.value)}
          />

          <input
            type="number"
            placeholder="Rooms per Floor"
            value={roomsPerFloor}
            onChange={(e) => setRoomsPerFloor(e.target.value)}
          />
        </div>

        <div className="popup-input-row">
          <input
            type="number"
            placeholder="Sharing per Room"
            value={sharing}
            onChange={(e) => setSharing(e.target.value)}
          />

          <input
            type="number"
            placeholder="Beds per Room"
            value={bedsPerRoom}
            onChange={(e) => setBedsPerRoom(e.target.value)}
          />
        </div>

        <button className="generate-btn" onClick={handleSubmit}>
          Generate Rooms
        </button>

        <button className="cancel-btn" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default RoomSetupPopup;
