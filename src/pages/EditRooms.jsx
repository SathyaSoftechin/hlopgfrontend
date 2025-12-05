// src/pages/EditRooms.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import "./EditRooms.css";

const EditRooms = () => {
  const { hostel_id } = useParams();

  const [floors, setFloors] = useState({});
  const [loading, setLoading] = useState(true);

  // ✅ Load rooms grouped by floor
  const loadRooms = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/rooms/${hostel_id}`);
      const grouped = {};
      res.data.forEach((room) => {
        if (!grouped[room.floor]) grouped[room.floor] = [];
        grouped[room.floor].push(room);
      });
      setFloors(grouped);
    } catch (err) {
      console.error("Error fetching rooms:", err);
      setFloors({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, [hostel_id]);

  // Add new floor
  const addFloor = () => {
    const newFloor = Object.keys(floors).length + 1;
    setFloors({ ...floors, [newFloor]: [] });
  };

  // Delete floor
  const deleteFloor = (floor) => {
    const updated = { ...floors };
    delete updated[floor];
    setFloors(updated);
  };

  // Add room in a floor
  const addRoom = (floor) => {
    const count = floors[floor].length + 1;
    const newRoom = {
      room_id: null,
      hostel_id,
      floor,
      room_number: `${floor}0${count}`,
      sharing: 3,
      status: "available",
      price: 5000,
    };
    setFloors({
      ...floors,
      [floor]: [...floors[floor], newRoom],
    });
  };

  // Delete room
  const deleteRoom = (floor, index) => {
    const updated = [...floors[floor]];
    updated.splice(index, 1);
    setFloors({ ...floors, [floor]: updated });
  };

  // Update any field
  const updateField = (floor, index, field, value) => {
    const updated = [...floors[floor]];
    updated[index][field] = value;
    setFloors({ ...floors, [floor]: updated });
  };

  // Save all rooms (update existing and create new)
  const handleSave = async () => {
    const allRooms = [];
    Object.keys(floors).forEach((floor) => {
      floors[floor].forEach((room) => {
        allRooms.push(room);
      });
    });

    try {
      await api.put(`/rooms/save/${hostel_id}`, { rooms: allRooms });
      alert("Rooms saved successfully!");
      await loadRooms(); // reload updated rooms from backend
    } catch (err) {
      console.error("Error saving rooms:", err);
      alert("Error saving rooms");
    }
  };

  if (loading) return <p>Loading rooms...</p>;

  return (
    <div className="edit-rooms-page">
      <h2>Edit Rooms by Floor</h2>

      <button className="add-floor-btn" onClick={addFloor}>
        + Add Floor
      </button>

      {Object.keys(floors).map((floor) => (
        <div key={floor} className="floor-block">
          <div className="floor-header">
            <h3>Floor {floor}</h3>

            <div className="floor-actions">
              <button onClick={() => addRoom(floor)}>+ Add Room</button>
              <button className="delete-floor" onClick={() => deleteFloor(floor)}>
                Delete Floor
              </button>
            </div>
          </div>

          <div className="rooms-container">
            {floors[floor].map((room, index) => (
              <div className="room-card" key={index}>
                <p>Room No: {room.room_number}</p>

                <label>
                  Sharing:
                  <input
                    type="number"
                    value={room.sharing}
                    onChange={(e) =>
                      updateField(floor, index, "sharing", parseInt(e.target.value))
                    }
                  />
                </label>

                <label>
                  Price:
                  <input
                    type="number"
                    value={room.price}
                    onChange={(e) =>
                      updateField(floor, index, "price", parseFloat(e.target.value))
                    }
                  />
                </label>

                <label>
                  Status:
                  <select
                    value={room.status}
                    onChange={(e) => updateField(floor, index, "status", e.target.value)}
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </label>

                <button
                  className="delete-room"
                  onClick={() => deleteRoom(floor, index)}
                >
                  Delete Room
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      <button className="save-btn" onClick={handleSave}>
        Save All Rooms
      </button>
    </div>
  );
};

export default EditRooms;
