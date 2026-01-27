// src/pages/UploadPG.jsx
import React, { useState, useEffect } from "react";
import "./UploadPG.css";
import api from "../api";
import RoomSetupPopup from "../components/RoomSetupPopup";

import {
  FaWifi,
  FaFan,
  FaBed,
  FaLightbulb,
  FaThermometerHalf,
  FaShower,
  FaChair,
  FaTv,
  FaUtensils,
  FaDumbbell,
  FaCar,
  FaSnowflake,
  FaPlus,
  FaSmokingBan,
  FaWineBottle,
  FaPaw,
  FaBroom,
} from "react-icons/fa";

const UploadPG = ({ user }) => {
  // basic PG fields
  const [pgImages, setPgImages] = useState([]); // preview URLs
  const [pgImageFiles, setPgImageFiles] = useState([]); // actual File objects
  const [selectedPgType, setSelectedPgType] = useState("");
  const [pgName, setPgName] = useState("");
  const [pgInfo, setPgInfo] = useState("");
  const [owner, setOwner] = useState(null);
  const ownerId = user?.owner_id;

  // location data
  const locationData = {
  Telangana: {
    Hyderabad: [
      "Ameerpet",
      "Dilshuknagar",
      "Gachibowli",
      "Gandimaisamma",
      "Kondapur",
      "KPHB",
      "LB Nagar",
      "Medchal",
      "Moosapet",
      "Madhapur",
      "Patancheruvu",
      "Uppal"
    ],
    Warangal: ["Hanamkonda", "Kazipet"]
  },

  Karnataka: {
    Bangalore: [
      "Bannerghatta",
      "Basavanagudi",
      "Devanahalli",
      "Electronic City",
      "Hebbal",
      "Hoskote",
      "HSR Layout",
      "Indiranagar",
      "Jayanagar",
      "Kengeri",
      "Koramangala",
      "Madiwala",
      "Marathahalli",
      "Sarjapur Road",
      "Ulsoor",
      "Whitefield"
    ],
    Mysore: ["Gokulam", "Vijayanagar"]
  },

  AndhraPradesh: {
    Vijayawada: ["Benz Circle", "Gunadala", "Poranki"],
    Vizag: ["Gajuwaka", "MVP Colony"]
  },

  Maharashtra: {
    Mumbai: [
      "Airoli",
      "Andheri",
      "Borivali",
      "Chembur",
      "Goregaon",
      "Jogeshwari",
      "Juhu",
      "Kandivali",
      "Kurla",
      "Malabar Hill",
      "Marine Drive",
      "Mira Road",
      "Powai",
      "Thane",
      "Vikhroli",
      "Virar"
    ],
    Pune: [
      "Aundh",
      "Baner",
      "Hadapsar",
      "Hinjewadi",
      "Kalyani Nagar",
      "Kharadi",
      "Koregaon Park",
      "Kothrud"
    ]
  },

  TamilNadu: {
    Chennai: [
      "Ambattur",
      "Anna Nagar",
      "Gopalapuram",
      "Kotturpuram",
      "Medavakkam",
      "Navalur",
      "Perungudi",
      "Porur",
      "Semmancheri",
      "Tambaram",
      "Thoraipakkam",
      "Velachery"
    ]
  }
};

  // room-setup popup states
  const [showRoomSetup, setShowRoomSetup] = useState(false);
  const [createdPgId, setCreatedPgId] = useState(null);

  // sharing options (type & price)
  const [sharingOptions, setSharingOptions] = useState([{ type: "", price: "" }]);

  // amenity keys mapping (backend friendly keys)
  const amenityKeys = {
    "Free WiFi": "wifi",
    Fan: "fan",
    Bed: "bed",
    Lights: "lights",
    Cupboard: "cupboard",
    Geyser: "geyser",
    Water: "water",
    Gym: "gym",
    TV: "tv",
    Food: "food",
    Parking: "parking",
    AC: "ac",
  };

  const [pgLocation, setPgLocation] = useState({
    address: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
  });

  // rules and selected rules
  const [rules, setRules] = useState([
    { name: "No Alcohol", icon: <FaWineBottle /> },
    { name: "No Smoking", icon: <FaSmokingBan /> },
    { name: "No Pets", icon: <FaPaw /> },
    { name: "Keep Clean", icon: <FaBroom /> },
  ]);
  const [selectedRules, setSelectedRules] = useState([]);

  // selected furnish/amenities
  const [selectedFurnish, setSelectedFurnish] = useState([]);

  // food menu
  const [foodMenu, setFoodMenu] = useState({
    monday: { breakfast: "", lunch: "", dinner: "" },
    tuesday: { breakfast: "", lunch: "", dinner: "" },
    wednesday: { breakfast: "", lunch: "", dinner: "" },
    thursday: { breakfast: "", lunch: "", dinner: "" },
    friday: { breakfast: "", lunch: "", dinner: "" },
    saturday: { breakfast: "", lunch: "", dinner: "" },
    sunday: { breakfast: "", lunch: "", dinner: "" },
  });
  const days = Object.keys(foodMenu);

  // UI state
  const [loading, setLoading] = useState(false);

  // fetch owner id on mount
  useEffect(() => {
    const fetchOwner = async () => {
      try {
        const token = localStorage.getItem("hlopgToken");
        if (!token) return;
        const res = await api.get("/auth/ownerid", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOwner(res.data.owner_id);
        console.log("Owner:", res.data.owner_id);
      } catch (err) {
        console.error("Owner fetch failed", err);
      }
    };
    fetchOwner();
  }, []);

  // image preview + store files
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setPgImages((prev) => [...prev, ...imageUrls]);
    setPgImageFiles((prev) => [...prev, ...files]);
  };

  const toggleFurnish = (name) => {
    setSelectedFurnish((prev) => (prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]));
  };

  const toggleRule = (ruleName) => {
    setSelectedRules((prev) => (prev.includes(ruleName) ? prev.filter((r) => r !== ruleName) : [...prev, ruleName]));
  };

  const handleFoodChange = (day, meal, value) => {
    setFoodMenu((prev) => ({ ...prev, [day]: { ...prev[day], [meal]: value } }));
  };

  const handlePgTypeSelect = (type) => {
    setSelectedPgType(type);
  };

  const handleLocationChange = (field, value) => {
    setPgLocation((prev) => ({ ...prev, [field]: value }));
  };

  // save generated rooms to backend (called by RoomSetupPopup onGenerate)
  const saveGeneratedRooms = async (floorsData) => {
  try {
    const token = localStorage.getItem("hlopgToken");

    const res = await api.post(
      "/rooms/bulkCreate",
      {
        hostel_id: createdPgId,
        floors: floorsData,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Rooms saved successfully!");
  } catch (err) {
    console.error("Room save failed:", err);
    alert("Room saving error");
  }
};

  // generate sharing object from sharingOptions
  const buildSharingObject = () => {
    const sharingObject = {};
    sharingOptions.forEach((opt) => {
      if (opt.type && opt.price) sharingObject[opt.type] = Number(opt.price);
    });
    return sharingObject;
  };

  // ================== handleSubmit ==================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pgName || !pgInfo || !selectedPgType ) {
      alert("Please fill all required fields before saving.");
      return;
    }

      if (!pgLocation.state || !pgLocation.city || !pgLocation.area) {
    alert("PG Location (State, City, Area) is required");
      return;
    }


   const validSharing = sharingOptions.some(
    (s) => s.type && s.price && Number(s.price) > 0
  );
  if (!validSharing) {
    alert("At least one Sharing type with valid price is required");
    return;
  }

  if (selectedFurnish.length === 0) {
    alert("Please select at least one Amenity");
    return;
  }

  if (selectedRules.length === 0) {
    alert("Please select at least one Rule");
    return;
  }



    setLoading(true);
    try {
      const token = localStorage.getItem("hlopgToken");
      const formData = new FormData();

      formData.append("pgName", pgName);
      formData.append("pgInfo", pgInfo);
      formData.append("pgType", selectedPgType);

      formData.append("address", pgLocation.address || "");
      formData.append("area", pgLocation.area || "");
      formData.append("city", pgLocation.city || "");
      formData.append("state", pgLocation.state || "");
      formData.append("pincode", pgLocation.pincode || "");

      formData.append("sharing", JSON.stringify(buildSharingObject()));

      // owner (use fetched owner or ownerId from props)
 
      formData.append("rules", JSON.stringify(selectedRules));

      const amenityObject = {};
      selectedFurnish.forEach((item) => {
        const key = amenityKeys[item];
        if (key) amenityObject[key] = true;
      });
      formData.append("furnish", JSON.stringify(amenityObject));

      formData.append("foodMenu", JSON.stringify(foodMenu));

      // add image files if any
      pgImageFiles.forEach((file) => {
        formData.append("images", file); // backend should accept images as 'images' multiple
      });

      // Post to your original endpoint
      const res = await api.post("/hostel/addhostel", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("PG Uploaded Successfully!");

const newPgId = res.data?.hostel?.hostel_id;
      console.log("New PG ID:", newPgId);
      if (!newPgId) {
  alert("PG saved, but ID missing in response.");
  return;
}
      setCreatedPgId(newPgId);
      setShowRoomSetup(true);

      console.log("PG Saved:", res.data);

      // reset form values
      setPgName("");
      setPgInfo("");
      setSelectedPgType("");
      setSelectedRules([]);
      setSelectedFurnish([]);
      setPgImages([]);
      setPgImageFiles([]);
      setPgLocation({
        address: "",
        area: "",
        city: "",
        state: "",
        pincode: "",
      });
      setSharingOptions([{ type: "", price: "" }]);
    } catch (err) {
      console.error("PG upload error:", err);
      alert("Failed to upload PG");
    } finally {
      setLoading(false);
    }
  };

  // small helpers for sharing options UI
  const addSharingRow = () => setSharingOptions((prev) => [...prev, { type: "", price: "" }]);
  const removeSharingRow = (index) => setSharingOptions((prev) => prev.filter((_, i) => i !== index));

  return (
    <div className="uploadpg-container">
      <h3 className="page-title">Upload PG</h3>

      <form className="pg-form" onSubmit={handleSubmit}>
        <label>PG Name</label>
        <input type="text" placeholder="Enter PG Name" value={pgName} onChange={(e) => setPgName(e.target.value)} />

        <label>PG Information</label>
        <input type="text" placeholder="Enter PG Information" value={pgInfo} onChange={(e) => setPgInfo(e.target.value)} />

        <label>PG Type</label>
        <div className="pg-type">
          {["Men", "Women", "Co-Living"].map((type) => (
            <button type="button" key={type} className={`pg-type-btn ${selectedPgType === type ? "selected" : ""}`} onClick={() => handlePgTypeSelect(type)}>
              {type}
            </button>
          ))}
        </div>

        <label>PG Location</label>
        <div className="pg-location">
          {/* STATE */}
          <select
            value={pgLocation.state}
            onChange={(e) =>
              setPgLocation((prev) => ({
                ...prev,
                state: e.target.value,
                city: "",
                area: "",
              }))
            }
          >
            <option value="">Select State</option>
            {Object.keys(locationData).map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>

          {/* CITY */}
          <select
            value={pgLocation.city}
            onChange={(e) =>
              setPgLocation((prev) => ({
                ...prev,
                city: e.target.value,
                area: "",
              }))
            }
            disabled={!pgLocation.state}
          >
            <option value="">Select City</option>
            {pgLocation.state &&
              Object.keys(locationData[pgLocation.state]).map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
          </select>

          {/* AREA */}
          <select value={pgLocation.area} onChange={(e) => setPgLocation((prev) => ({ ...prev, area: e.target.value }))} disabled={!pgLocation.city}>
            <option value="">Select Area</option>
            {pgLocation.city && locationData[pgLocation.state][pgLocation.city].map((area) => <option key={area} value={area}>{area}</option>)}
          </select>

          <input type="text" placeholder="Address" value={pgLocation.address} onChange={(e) => handleLocationChange("address", e.target.value)} />
          <input type="text" placeholder="Pincode" value={pgLocation.pincode} onChange={(e) => handleLocationChange("pincode", e.target.value)} />
        </div>

        {/* PG Sharing Options */}
        <h3 className="black-text">PG Sharing Type & Price</h3>
        {sharingOptions.map((item, index) => (
          <div key={index} className="sharing-row">
            <select
              value={item.type}
              onChange={(e) => {
                const updated = [...sharingOptions];
                updated[index].type = e.target.value;
                setSharingOptions(updated);
              }}
              className="sharing-dropdown"
            >
              <option value="">Select Sharing</option>
              <option value="single">1 Sharing (Single)</option>
              <option value="double">2 Sharing (Double)</option>
              <option value="triple">3 Sharing (Triple)</option>
              <option value="four">4 Sharing</option>
              <option value="five">5 Sharing</option>
              <option value="six">6 Sharing</option>
            </select>

            <input
              type="number"
              placeholder="Price per month"
              value={item.price}
              onChange={(e) => {
                const updated = [...sharingOptions];
                updated[index].price = e.target.value;
                setSharingOptions(updated);
              }}
              className="price-input"
            />

            {index > 0 && (
              <button type="button" onClick={() => removeSharingRow(index)} className="remove-sharing">
                ❌
              </button>
            )}
          </div>
        ))}

        <button type="button" className="add-sharing-btn" onClick={addSharingRow}>
          ➕ Add Another Sharing
        </button>

        <label>PG Images</label>
        <div className="pg-images">
          {pgImages.map((img, i) => (
            <img key={i} src={img} alt={`PG ${i}`} />
          ))}

          <label className="upload-btn">
            +
            <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
          </label>
        </div>

        <label>Food Menu Details</label>
        <div className="food-menu-table">
          <table>
            <thead>
              <tr>
                <th>DAYS</th>
                <th>BREAKFAST</th>
                <th>LUNCH</th>
                <th>DINNER</th>
              </tr>
            </thead>
            <tbody>
              {days.map((day) => (
                <tr key={day}>
                  <td className="day-cell">{day.toUpperCase()}</td>
                  <td>
                    <input type="text" placeholder="Breakfast" value={foodMenu[day].breakfast} onChange={(e) => handleFoodChange(day, "breakfast", e.target.value)} />
                  </td>
                  <td>
                    <input type="text" placeholder="Lunch" value={foodMenu[day].lunch} onChange={(e) => handleFoodChange(day, "lunch", e.target.value)} />
                  </td>
                  <td>
                    <input type="text" placeholder="Dinner" value={foodMenu[day].dinner} onChange={(e) => handleFoodChange(day, "dinner", e.target.value)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <label>Furnished Amenities</label>
        <div className="furnished-icons">
          {[
            { icon: <FaWifi />, name: "Free WiFi" },
            { icon: <FaFan />, name: "Fan" },
            { icon: <FaBed />, name: "Bed" },
            { icon: <FaLightbulb />, name: "Lights" },
            { icon: <FaChair />, name: "Cupboard" },
            { icon: <FaShower />, name: "Geyser" },
            { icon: <FaThermometerHalf />, name: "Water" },
            { icon: <FaDumbbell />, name: "Gym" },
            { icon: <FaTv />, name: "TV" },
            { icon: <FaUtensils />, name: "Food" },
            { icon: <FaCar />, name: "Parking" },
            { icon: <FaSnowflake />, name: "AC" },
          ].map((f, i) => (
            <div key={i} className={`furnish-icon ${selectedFurnish.includes(f.name) ? "selected" : ""}`} onClick={() => toggleFurnish(f.name)}>
              {f.icon}
              <span>{f.name}</span>
            </div>
          ))}
        </div>

        <label>Rules</label>
        <div className="rules-section">
          {rules.map((rule, index) => (
            <div key={index} className={`rule-item ${selectedRules.includes(rule.name) ? "selected" : ""}`} onClick={() => toggleRule(rule.name)}>
              {rule.icon}
              <span>{rule.name}</span>
            </div>
          ))}
          <div
            className="rule-item add-rule"
            onClick={() => {
              const newRule = prompt("Enter new rule:");
              if (newRule) setRules((prev) => [...prev, { name: newRule, icon: <FaPlus /> }]);
            }}
          >
            <FaPlus />
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Saving..." : "Upload PG"}
        </button>
      </form>

      {/* ROOM SETUP POPUP */}
      {showRoomSetup && <RoomSetupPopup onClose={() => setShowRoomSetup(false)} onGenerate={saveGeneratedRooms} />}
    </div>
  );
};

export default UploadPG;
