import React, { useEffect, useState } from "react";
import api from "../api"; // Axios instance with baseURL
import "./EditRooms.css";

const HOSTEL_ID = 87; // Change dynamically if needed

const EditRoom = () => {
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Setup popup (first-time layout)
  const [setupPopup, setSetupPopup] = useState(false);
  const [setupData, setSetupData] = useState({
    floors: "",
    roomsPerFloor: "",
    sharing: "",
  });

  // Add/Edit room popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMode, setPopupMode] = useState("add");
  const [popupData, setPopupData] = useState({ roomNo: "", sharing: "" });
  const [activeFloorIndex, setActiveFloorIndex] = useState(null);
  const [activeRoomIndex, setActiveRoomIndex] = useState(null);

  /* -----------------------------
     LOAD ROOMS FROM BACKEND
  ----------------------------- */
  useEffect(() => {
    const loadRooms = async () => {
      try {
        const res = await api.get(`/rooms/${HOSTEL_ID}`);
        if (!res.data.floors || res.data.floors.length === 0) {
          setSetupPopup(true);
        } else {
          setFloors(res.data.floors);
        }
      } catch (err) {
        console.error("❌ GET HOSTEL ROOMS ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, []);

  /* -----------------------------
     SAVE TO BACKEND
  ----------------------------- */
  const saveLayout = async (layout) => {
    try {
      await api.post("/rooms/hostel-rooms", {
        hostel_id: HOSTEL_ID,
        floors: layout,
      });
    } catch (err) {
      console.error("❌ SAVE HOSTEL ROOMS ERROR:", err);
      alert("Failed to save room layout");
    }
  };

  /* -----------------------------
     GENERATE INITIAL LAYOUT
  ----------------------------- */
  const generateLayout = () => {
    const { floors, roomsPerFloor, sharing } = setupData;
    if (!floors || !roomsPerFloor || !sharing) {
      return alert("Fill all fields");
    }

    const newFloors = Array.from({ length: +floors }, (_, f) => ({
      floor: `${f + 1}${["st", "nd", "rd"][f] || "th"} Floor`,
      rooms: Array.from({ length: +roomsPerFloor }, (_, r) => ({
        roomNo: `${f + 1}${String(r + 1).padStart(2, "0")}`,
        beds: Array(+sharing).fill(false),
      })),
    }));

    setFloors(newFloors);
    saveLayout(newFloors);
    setSetupPopup(false);
  };

  /* -----------------------------
     BED TOGGLE
  ----------------------------- */
  const toggleBed = (f, r, b) => {
    const updated = [...floors];
    updated[f].rooms[r].beds[b] = !updated[f].rooms[r].beds[b];
    setFloors(updated);
    saveLayout(updated);
  };

  /* -----------------------------
     ADD FLOOR
  ----------------------------- */
  const addFloor = () => {
    const updated = [
      ...floors,
      { floor: `${floors.length + 1}th Floor`, rooms: [] },
    ];
    setFloors(updated);
    saveLayout(updated);
  };

  /* -----------------------------
     ADD / EDIT ROOM POPUP
  ----------------------------- */
  const openPopup = (mode, floorIndex, roomIndex = null) => {
    setPopupMode(mode);
    setActiveFloorIndex(floorIndex);
    setActiveRoomIndex(roomIndex);

    if (mode === "edit" && roomIndex !== null) {
      const room = floors[floorIndex].rooms[roomIndex];
      setPopupData({
        roomNo: room.roomNo,
        sharing: room.beds.length,
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

  const saveRoom = () => {
    const { roomNo, sharing } = popupData;
    if (!roomNo || !sharing) return alert("Fill all fields");

    const beds = Array(Math.min(6, Math.max(1, +sharing))).fill(false);
    const updated = [...floors];

    if (popupMode === "add") {
      updated[activeFloorIndex].rooms.push({ roomNo, beds });
    } else {
      updated[activeFloorIndex].rooms[activeRoomIndex] = { roomNo, beds };
    }

    setFloors(updated);
    saveLayout(updated);
    closePopup();
  };

  if (loading) return <p style={{ padding: 20 }}>Loading rooms...</p>;

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

      {floors.map((floor, f) => (
        <div key={f} className="floor-section">
          <div className="floor-title">
            {floor.floor}
            <button className="add-room-btn" onClick={() => openPopup("add", f)}>
              + Add Room
            </button>
          </div>

          <div className="rooms-container">
            {floor.rooms.map((room, r) => (
              <div key={r} className="room-card">
                <div className="room-header">
                  <h4>{room.roomNo}</h4>
                  <button className="edit-btn" onClick={() => openPopup("edit", f, r)}>
                    Edit
                  </button>
                </div>

                <div className="beds-grid">
                  {room.beds.map((filled, b) => (
                    <div
                      key={b}
                      className={`bed ${filled ? "filled" : "empty"}`}
                      onClick={() => toggleBed(f, r, b)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* SETUP POPUP */}
      {setupPopup && (
        <div className="popup-overlay show">
          <div className="popup-content popup-in">
            <h3>Setup Hostel Layout</h3>

            <input
              type="number"
              placeholder="No of Floors"
              onChange={(e) =>
                setSetupData({ ...setupData, floors: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Rooms per Floor"
              onChange={(e) =>
                setSetupData({ ...setupData, roomsPerFloor: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Default Sharing"
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

      {/* ADD / EDIT ROOM POPUP */}
      {showPopup && (
        <div className={`popup-overlay ${popupVisible ? "show" : ""}`}>
          <div className="popup-content popup-in">
            <h3>{popupMode === "add" ? "Add Room" : "Edit Room"}</h3>

            <input
              placeholder="Room Number"
              value={popupData.roomNo}
              onChange={(e) =>
                setPopupData({ ...popupData, roomNo: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Sharing"
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
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditRoom;
