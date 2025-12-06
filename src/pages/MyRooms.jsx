// src/pages/MyRooms.jsx
import React, { useState, useEffect } from "react";
import "./MyRooms.css";

const STORAGE_KEY = "hlopg_myrooms_layout";

export default function MyRooms() {
  // REMOVE HEADER + FOOTER FOR THIS PAGE
  useEffect(() => {
    window.hideHeaderFooter = true;
    return () => (window.hideHeaderFooter = false);
  }, []);

  const [floors, setFloors] = useState([]);
  const [setupPopup, setSetupPopup] = useState(false);

  const [setupData, setSetupData] = useState({
    floors: "",
    roomsPerFloor: "",
    sharing: "",
  });

  const [showPopup, setShowPopup] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);

  const [popupMode, setPopupMode] = useState("add");
  const [popupData, setPopupData] = useState({ roomNo: "", sharing: "" });

  const [activeFloorIndex, setActiveFloorIndex] = useState(null);
  const [activeRoomIndex, setActiveRoomIndex] = useState(null);

  // 📌 Load saved layout from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      setFloors(JSON.parse(saved));
      setSetupPopup(false);
    } else {
      setSetupPopup(true); // first-time setup
    }
  }, []);

  // 📌 Save layout on every change
  useEffect(() => {
    if (floors.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(floors));
    }
  }, [floors]);

  // ➕ Generate layout
  const generateLayout = () => {
    const { floors, roomsPerFloor, sharing } = setupData;

    if (!floors || !roomsPerFloor || !sharing)
      return alert("Please fill all fields");

    const numFloors = Number(floors);
    const numRooms = Number(roomsPerFloor);
    const numSharing = Number(sharing);

    const newFloors = Array.from({ length: numFloors }, (_, floorIndex) => ({
      floor: `${floorIndex + 1}${["st", "nd", "rd"][floorIndex] || "th"} Floor`,
      rooms: Array.from({ length: numRooms }, (_, roomIndex) => ({
        roomNo: `${floorIndex + 1}${String(roomIndex + 1).padStart(2, "0")}`,
        beds: Array(numSharing).fill(false),
      })),
    }));

    setFloors(newFloors);
    setSetupPopup(false);
  };

  // Toggle bed status
  const toggleBed = (floorIndex, roomIndex, bedIndex) => {
    const updated = [...floors];
    updated[floorIndex].rooms[roomIndex].beds[bedIndex] =
      !updated[floorIndex].rooms[roomIndex].beds[bedIndex];

    setFloors(updated);
  };

  // ➕ Add Floor
  const addFloor = () => {
    const newFloorNum = floors.length + 1;

    const newFloor = {
      floor: `${newFloorNum}${["st", "nd", "rd"][newFloorNum - 1] || "th"} Floor`,
      rooms: [],
    };

    setFloors([...floors, newFloor]);
  };

  // ➕ Add/Edit Popup Logic
  const openPopup = (mode, floorIndex, roomIndex = null) => {
    setPopupMode(mode);
    setActiveFloorIndex(floorIndex);
    setActiveRoomIndex(roomIndex);

    if (mode === "edit") {
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

  const closePopup = () => {
    setPopupVisible(false);
    setTimeout(() => setShowPopup(false), 200);
  };

  // SAVE ROOM
  const saveRoom = () => {
    const { roomNo, sharing } = popupData;

    if (!roomNo || !sharing) return alert("Fill all fields");

    const newBeds = Array(Math.min(6, Math.max(1, Number(sharing)))).fill(false);

    const updated = [...floors];

    if (popupMode === "add") {
      updated[activeFloorIndex].rooms.push({ roomNo, beds: newBeds });
    } else {
      updated[activeFloorIndex].rooms[activeRoomIndex] = { roomNo, beds: newBeds };
    }

    setFloors(updated);
    closePopup();
  };

  return (
    <div className="myrooms-container">
      <div className="myrooms-header">
        <h2>My Rooms</h2>

        {floors.length > 0 && (
          <button className="add-floor-btn" onClick={addFloor}>
            + Add Floor
          </button>
        )}
      </div>

      {/* Render Floors */}
      {floors.map((floor, floorIndex) => (
        <div key={floorIndex} className="floor-section">
          <div className="floor-title">
            <h3>{floor.floor}</h3>

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
                    ✏️ Edit
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

      {/* INITIAL SETUP POPUP */}
      {setupPopup && (
        <div className="popup-overlay show">
          <div className="popup-content popup-in">
            <h3>Setup Hostel Layout</h3>

            <label>Floors</label>
            <input
              type="number"
              value={setupData.floors}
              onChange={(e) =>
                setSetupData({ ...setupData, floors: e.target.value })
              }
            />

            <label>Rooms per Floor</label>
            <input
              type="number"
              value={setupData.roomsPerFloor}
              onChange={(e) =>
                setSetupData({ ...setupData, roomsPerFloor: e.target.value })
              }
            />

            <label>Sharing per Room</label>
            <input
              type="number"
              value={setupData.sharing}
              onChange={(e) =>
                setSetupData({ ...setupData, sharing: e.target.value })
              }
            />

            <button className="save-btn" onClick={generateLayout}>
              Generate
            </button>
          </div>
        </div>
      )}

      {/* ADD/EDIT ROOM POPUP */}
      {showPopup && (
        <div className={`popup-overlay ${popupVisible ? "show" : "hide"}`}>
          <div className={`popup-content ${popupVisible ? "popup-in" : "popup-out"}`}>
            <h3>{popupMode === "add" ? "Add Room" : "Edit Room"}</h3>

            <label>Room Number</label>
            <input
              type="text"
              value={popupData.roomNo}
              onChange={(e) =>
                setPopupData({ ...popupData, roomNo: e.target.value })
              }
            />

            <label>Sharing</label>
            <input
              type="number"
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
                {popupMode === "add" ? "Add" : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
