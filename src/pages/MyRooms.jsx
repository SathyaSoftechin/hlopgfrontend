// src/pages/MyRooms.jsx
import React, { useState } from "react";
import "./MyRooms.css";

const MyRooms = () => {
  const [floors, setFloors] = useState([]); // initially empty
  const [setupPopup, setSetupPopup] = useState(true);
  const [setupData, setSetupData] = useState({
    floors: "",
    roomsPerFloor: "",
    sharing: "",
  });

  const [showPopup, setShowPopup] = useState(false);
  const [popupMode, setPopupMode] = useState("add");
  const [popupData, setPopupData] = useState({ roomNo: "", sharing: "" });
  const [activeFloorIndex, setActiveFloorIndex] = useState(null);
  const [activeRoomIndex, setActiveRoomIndex] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);

  // ✅ Generate Room Layout from Setup
  const generateLayout = () => {
    const { floors, roomsPerFloor, sharing } = setupData;

    if (!floors || !roomsPerFloor || !sharing)
      return alert("Please fill all details to generate layout.");

    const numFloors = parseInt(floors);
    const numRooms = parseInt(roomsPerFloor);
    const numSharing = parseInt(sharing);

    const newFloors = Array.from({ length: numFloors }, (_, floorIndex) => ({
      floor: `${floorIndex + 1}${
        floorIndex === 0
          ? "st"
          : floorIndex === 1
          ? "nd"
          : floorIndex === 2
          ? "rd"
          : "th"
      } Floor`,
      rooms: Array.from({ length: numRooms }, (_, roomIndex) => ({
        roomNo: `${floorIndex + 1}${String(roomIndex + 1).padStart(2, "0")}`,
        beds: Array(numSharing).fill(false),
      })),
    }));

    setFloors(newFloors);
    setSetupPopup(false);
  };

  // ✅ Toggle Bed Occupancy
  const toggleBed = (floorIndex, roomIndex, bedIndex) => {
    const updatedFloors = [...floors];
    updatedFloors[floorIndex].rooms[roomIndex].beds[bedIndex] =
      !updatedFloors[floorIndex].rooms[roomIndex].beds[bedIndex];
    setFloors(updatedFloors);
  };

  // ✅ Add Floor
  const addFloor = () => {
    const newFloorNum = floors.length + 1;
    setFloors([
      ...floors,
      {
        floor: `${newFloorNum}th Floor`,
        rooms: [],
      },
    ]);
  };

  // ✅ Open Popup for Add/Edit
  const openPopup = (mode, floorIndex, roomIndex = null) => {
    setPopupMode(mode);
    setActiveFloorIndex(floorIndex);
    setActiveRoomIndex(roomIndex);

    if (mode === "edit" && roomIndex !== null) {
      const room = floors[floorIndex].rooms[roomIndex];
      setPopupData({
        roomNo: room.roomNo,
        sharing: room.beds.length.toString(),
      });
    } else {
      setPopupData({ roomNo: "", sharing: "" });
    }

    setShowPopup(true);
    setTimeout(() => setPopupVisible(true), 20);
  };

  // ✅ Close Popup
  const closePopup = () => {
    setPopupVisible(false);
    setTimeout(() => setShowPopup(false), 250);
    setPopupData({ roomNo: "", sharing: "" });
  };

  // ✅ Save Room
  const saveRoom = () => {
    const { roomNo, sharing } = popupData;
    if (!roomNo || !sharing)
      return alert("Please fill both Room Number and No. of Sharing.");

    const numBeds = Math.min(6, Math.max(1, parseInt(sharing)));
    const updatedFloors = [...floors];

    if (popupMode === "add") {
      updatedFloors[activeFloorIndex].rooms.push({
        roomNo,
        beds: Array(numBeds).fill(false),
      });
    } else if (popupMode === "edit") {
      updatedFloors[activeFloorIndex].rooms[activeRoomIndex] = {
        roomNo,
        beds: Array(numBeds).fill(false),
      };
    }

    setFloors(updatedFloors);
    closePopup();
  };

  // ✅ Handle Enter key in popup
  const handlePopupKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveRoom();
    }
  };

  // ✅ Handle Setup Enter Key
  const handleSetupKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      generateLayout();
    }
  };

  return (
    <div className="myrooms-container">
      <div className="myrooms-header">
        <h2 className="page-title">My Rooms</h2>
        {floors.length > 0 && (
          <button className="add-floor-btn" onClick={addFloor}>
            + Add Floor
          </button>
        )}
      </div>

      {/* Floors Display */}
      {floors.map((floor, floorIndex) => (
        <div key={floorIndex} className="floor-section">
          <div className="floor-title">
            {floor.floor}
            <button
              className="add-room-btn"
              onClick={() => openPopup("add", floorIndex)}
            >
              + Add Room
            </button>
          </div>

          <div className="rooms-container">
            {floor.rooms.map((room, roomIndex) => (
              <div key={roomIndex} className="room-card">
                <div className="room-header">
                  <h4>{room.roomNo}</h4>
                  <button
                    className="edit-btn"
                    onClick={() => openPopup("edit", floorIndex, roomIndex)}
                  >
                    <span className="edit-icon">✏️</span> Edit
                  </button>
                </div>

                <div className="room-image">
                  <img
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=500&q=80"
                    alt="Room"
                  />
                  <div
                    className="beds-grid"
                    style={{
                      gridTemplateColumns:
                        room.beds.length <= 2
                          ? "repeat(2, 1fr)"
                          : room.beds.length <= 4
                          ? "repeat(2, 1fr)"
                          : "repeat(3, 1fr)",
                    }}
                  >
                    {room.beds.map((filled, bedIndex) => (
                      <div
                        key={bedIndex}
                        className={`bed ${filled ? "filled" : "empty"}`}
                        onClick={() =>
                          toggleBed(floorIndex, roomIndex, bedIndex)
                        }
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Initial Setup Popup */}
      {setupPopup && (
        <div className="popup-overlay show">
          <div
            className="popup-content popup-in"
            onKeyDown={handleSetupKeyDown}
          >
            <h3>Setup Hostel Layout</h3>
            <label>Number of Floors</label>
            <input
              type="number"
              placeholder="Enter Number of Floors"
              value={setupData.floors}
              onChange={(e) =>
                setSetupData({ ...setupData, floors: e.target.value })
              }
            />
            <label>Number of Rooms per Floor</label>
            <input
              type="number"
              placeholder="Enter Rooms per Floor"
              value={setupData.roomsPerFloor}
              onChange={(e) =>
                setSetupData({ ...setupData, roomsPerFloor: e.target.value })
              }
            />
            <label>Default No. of Sharings</label>
            <input
              type="number"
              placeholder="Enter Default Sharing"
              value={setupData.sharing}
              onChange={(e) =>
                setSetupData({ ...setupData, sharing: e.target.value })
              }
            />
            <div className="popup-buttons">
              <button className="save-btn" onClick={generateLayout}>
                Generate Layout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Room Popup */}
      {showPopup && (
        <div className={`popup-overlay ${popupVisible ? "show" : "hide"}`}>
          <div
            className={`popup-content ${
              popupVisible ? "popup-in" : "popup-out"
            }`}
            onKeyDown={handlePopupKeyDown}
          >
            <h3>{popupMode === "add" ? "Add New Room" : "Edit Room"}</h3>
            <label>Room Number</label>
            <input
              type="text"
              placeholder="Enter Room Number"
              value={popupData.roomNo}
              onChange={(e) =>
                setPopupData({ ...popupData, roomNo: e.target.value })
              }
            />
            <label>No. of Sharing</label>
            <input
              type="number"
              placeholder="Enter No. of Sharing"
              min="1"
              max="6"
              value={popupData.sharing}
              onChange={(e) =>
                setPopupData({ ...popupData, sharing: e.target.value })
              }
            />
            <div className="popup-buttons">
              <button className="cancel-btn" onClick={closePopup}>
                Cancel
              </button>
              <button className="save-btn" onClick={saveRoom}>
                {popupMode === "add" ? "Save Room" : "Update Room"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRooms;
