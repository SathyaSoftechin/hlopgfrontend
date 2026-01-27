// File: src/pages/EditPG.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api, { BASE_URL } from "../api";
import "./UploadPG.css";

import {
  FaWifi, FaFan, FaBed, FaLightbulb, FaThermometerHalf, FaShower,
  FaChair, FaTv, FaUtensils, FaDumbbell, FaCar, FaSnowflake, FaPlus,
  FaSmokingBan, FaWineBottle, FaPaw, FaBroom
} from "react-icons/fa";

const locationData = {
  Telangana: { Hyderabad: ["Ameerpet","Dilshuknagar","Gachibowli","Gandimaisamma","Kondapur","KPHB","LB Nagar","Medchal","Moosapet","Madhapur","Patancheruvu","Uppal"], Warangal: ["Hanamkonda","Kazipet"] },
  Karnataka: { Bangalore: ["Bannerghatta","Basavanagudi","Devanahalli","Electronic City","Hebbal","Hoskote","HSR Layout","Indiranagar","Jayanagar","Kengeri","Koramangala","Madiwala","Marathahalli","Sarjapur Road","Ulsoor","Whitefield"], Mysore: ["Gokulam","Vijayanagar"] },
  AndhraPradesh: { Vijayawada: ["Benz Circle","Gunadala","Poranki"], Vizag: ["Gajuwaka","MVP Colony"] },
  Maharashtra: { Mumbai: ["Airoli","Andheri","Borivali","Chembur","Goregaon","Jogeshwari","Juhu","Kandivali","Kurla","Malabar Hill","Marine Drive","Mira Road","Powai","Thane","Vikhroli","Virar"], Pune: ["Aundh","Baner","Hadapsar","Hinjewadi","Kalyani Nagar","Kharadi","Koregaon Park","Kothrud"] },
  TamilNadu: { Chennai: ["Ambattur","Anna Nagar","Gopalapuram","Kotturpuram","Medavakkam","Navalur","Perungudi","Porur","Semmancheri","Tambaram","Thoraipakkam","Velachery"] }
};

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

const EditPG = () => {
  const { hostel_id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // --- Basic Details ---
  const [pgName, setPgName] = useState("");
  const [pgInfo, setPgInfo] = useState("");
  const [selectedPgType, setSelectedPgType] = useState("");
  const [pgLocation, setPgLocation] = useState({ address: "", area: "", city: "", state: "", pincode: "" });

  // --- Sharing & Price ---
  const [sharingOptions, setSharingOptions] = useState([]);

  // --- Images ---
  const [pgImages, setPgImages] = useState([]); // existing + preview
  const [pgImageFiles, setPgImageFiles] = useState([]); // newly added files

  // --- Food Menu ---
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

  // --- Rules & Amenities ---
  const [rules, setRules] = useState([
    { name: "No Alcohol", icon: <FaWineBottle /> },
    { name: "No Smoking", icon: <FaSmokingBan /> },
    { name: "No Pets", icon: <FaPaw /> },
    { name: "Keep Clean", icon: <FaBroom /> },
  ]);
  const [selectedRules, setSelectedRules] = useState([]);
  const [selectedFurnish, setSelectedFurnish] = useState([]);

  // ================= FETCH EXISTING PG =================
  useEffect(() => {
    const fetchPG = async () => {
      try {
        const token = localStorage.getItem("hlopgToken");
        const res = await api.get(`/hostel/${hostel_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const pg = res.data.data;

        // --- Basic Details ---
        setPgName(pg.hostel_name || "");
        setPgInfo(pg.hostel_info || "");
        setSelectedPgType(pg.pg_type || "");
        setPgLocation({
          address: pg.address || "",
          area: pg.area || "",
          city: pg.city || "",
          state: pg.state || "",
          pincode: pg.pincode || "",
        });

        // --- Images ---
        setPgImages(pg.images?.map((img) => (img.startsWith("http") ? img : `${BASE_URL}${img}`)) || []);

        // --- Sharing ---
        const sharingArr =
          pg.sharing && Object.keys(pg.sharing).length
            ? Object.entries(pg.sharing).map(([type, price]) => ({ type, price }))
            : [{ type: "", price: "" }];
        setSharingOptions(sharingArr);

        // --- Rules & Amenities ---
        setSelectedRules(pg.rules || []);
        setSelectedFurnish(
          Object.keys(pg.amenities || {}).filter((k) => pg.amenities[k])
        );

        // --- Food Menu ---
        const defaultMenu = {
          monday: { breakfast: "", lunch: "", dinner: "" },
          tuesday: { breakfast: "", lunch: "", dinner: "" },
          wednesday: { breakfast: "", lunch: "", dinner: "" },
          thursday: { breakfast: "", lunch: "", dinner: "" },
          friday: { breakfast: "", lunch: "", dinner: "" },
          saturday: { breakfast: "", lunch: "", dinner: "" },
          sunday: { breakfast: "", lunch: "", dinner: "" },
        };

        if (pg.foodMenu) {
          const { breakfast = {}, lunch = {}, dinner = {} } = pg.foodMenu;
          const mergedMenu = {};
          Object.keys(defaultMenu).forEach((day) => {
            mergedMenu[day] = {
              breakfast: breakfast[day] || "",
              lunch: lunch[day] || "",
              dinner: dinner[day] || "",
            };
          });
          setFoodMenu(mergedMenu);
        } else {
          setFoodMenu(defaultMenu);
        }
      } catch (err) {
        console.error("Failed to load PG", err);
        alert("Failed to load PG details");
      } finally {
        setLoading(false);
      }
    };

    fetchPG();
  }, [hostel_id]);

  // ================= IMAGE HANDLER =================
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const previews = files.map((f) => URL.createObjectURL(f));
    setPgImages((prev) => [...prev, ...previews]);
    setPgImageFiles((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setPgImages((prev) => prev.filter((_, i) => i !== index));
    setPgImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // ================= TOGGLE FURNISH & RULES =================
  const toggleFurnish = (name) => {
    setSelectedFurnish((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]
    );
  };
  const toggleRule = (name) => {
    setSelectedRules((prev) =>
      prev.includes(name) ? prev.filter((r) => r !== name) : [...prev, name]
    );
  };
  const handleFoodChange = (day, meal, value) => {
    setFoodMenu((prev) => ({ ...prev, [day]: { ...prev[day], [meal]: value } }));
  };

  // ================= SHARING OPTIONS =================
  const addSharingRow = () => setSharingOptions((prev) => [...prev, { type: "", price: "" }]);
  const removeSharingRow = (index) => setSharingOptions((prev) => prev.filter((_, i) => i !== index));

  // ================= SUBMIT UPDATE =================
  // ================= SUBMIT UPDATE =================
const handleUpdate = async (e) => {
  e.preventDefault();
  setSaving(true);
  try {
    const token = localStorage.getItem("hlopgToken");
    const formData = new FormData();

    // basic details
    formData.append("pgName", pgName);
    formData.append("pgInfo", pgInfo);
    formData.append("pgType", selectedPgType);
    formData.append("location", JSON.stringify(pgLocation));

    // sharing → convert array to object
    const sharingObj = {};
    sharingOptions.forEach((item) => {
      if (item.type && item.price) sharingObj[item.type] = Number(item.price);
    });
    formData.append("sharing", JSON.stringify(sharingObj));

    // rules & amenities
    formData.append("rules", JSON.stringify(selectedRules));
    const amenityObject = {};
    selectedFurnish.forEach((item) => {
      const key = amenityKeys[item];
      if (key) amenityObject[key] = true;
    });
    formData.append("furnish", JSON.stringify(amenityObject));

    // food menu
    formData.append("foodMenu", JSON.stringify(foodMenu));

    // new images
    pgImageFiles.forEach((img) => formData.append("images", img));

    await api.put(`/hostel/update/${hostel_id}`, formData, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
    });

    alert("PG Updated Successfully");
    navigate("/owner/my-pgs");

  } catch (err) {
    console.error("Update failed", err);
    alert("Failed to update PG");
  } finally {
    setSaving(false);
  }
};


  if (loading) return <p>Loading PG details...</p>;

  return (
    <div className="uploadpg-container">
      <h3 className="page-title">Edit PG</h3>
      <form className="pg-form" onSubmit={handleUpdate}>

        {/* --- Basic Details --- */}
        <label>PG Name</label>
        <input value={pgName} onChange={(e) => setPgName(e.target.value)} />

        <label>PG Info</label>
        <input value={pgInfo} onChange={(e) => setPgInfo(e.target.value)} />

        {/* --- PG Type --- */}
        <label>PG Type</label>
        <div className="pg-type">
          {["Men", "Women", "Co-Living"].map((type) => (
            <button type="button" key={type} className={`pg-type-btn ${selectedPgType === type ? "selected" : ""}`} onClick={() => setSelectedPgType(type)}>
              {type}
            </button>
          ))}
        </div>

        {/* --- Location --- */}
        <label>PG Location</label>
        <div className="pg-location">
          <select value={pgLocation.state} onChange={(e) => setPgLocation({ ...pgLocation, state: e.target.value, city: "", area: "" })}>
            <option value="">Select State</option>
            {Object.keys(locationData).map((state) => <option key={state} value={state}>{state}</option>)}
          </select>
          <select value={pgLocation.city} disabled={!pgLocation.state} onChange={(e) => setPgLocation({ ...pgLocation, city: e.target.value, area: "" })}>
            <option value="">Select City</option>
            {pgLocation.state && Object.keys(locationData[pgLocation.state] || {}).map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={pgLocation.area} disabled={!pgLocation.city} onChange={(e) => setPgLocation({ ...pgLocation, area: e.target.value })}>
            <option value="">Select Area</option>
            {pgLocation.state && pgLocation.city && locationData[pgLocation.state]?.[pgLocation.city]?.map((area) => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
          <input placeholder="Address" value={pgLocation.address} onChange={(e) => setPgLocation({ ...pgLocation, address: e.target.value })} />
          <input placeholder="Pincode" value={pgLocation.pincode} onChange={(e) => setPgLocation({ ...pgLocation, pincode: e.target.value })} />
        </div>

        {/* --- Sharing & Price --- */}
        <h3>Sharing & Price</h3>
        {sharingOptions.map((item, i) => (
          <div key={`sharing-${i}`} className="sharing-row">
            <select value={item.type} onChange={(e) => { const arr = [...sharingOptions]; arr[i].type = e.target.value; setSharingOptions(arr); }}>
              <option value="">Select Sharing</option>
              <option value="single">1 Sharing</option>
              <option value="double">2 Sharing</option>
              <option value="triple">3 Sharing</option>
            </select>
            <input type="number" value={item.price} onChange={(e) => { const arr = [...sharingOptions]; arr[i].price = e.target.value; setSharingOptions(arr); }} placeholder="Price/month" />
            {i > 0 && <button type="button" onClick={() => removeSharingRow(i)}>❌</button>}
          </div>
        ))}
        <button type="button" onClick={addSharingRow}>➕ Add Sharing</button>

        {/* --- Images --- */}
        <label>PG Images</label>
        <div className="pg-images">
          {pgImages.map((img, i) => (
            <div key={`img-${i}`} className="image-wrapper">
              <img src={img} alt="" />
              <span onClick={() => removeImage(i)}>❌</span>
            </div>
          ))}
          <label className="upload-btn">
            +
            <input type="file" multiple onChange={handleImageUpload} />
          </label>
        </div>

        {/* --- Food Menu --- */}
        <h3>Food Menu</h3>
        <table>
          <thead><tr><th>Day</th><th>Breakfast</th><th>Lunch</th><th>Dinner</th></tr></thead>
          <tbody>
            {days.map((day) => (
              <tr key={day}>
                <td>{day.toUpperCase()}</td>
                <td><input value={foodMenu[day].breakfast} onChange={(e) => handleFoodChange(day,"breakfast", e.target.value)} /></td>
                <td><input value={foodMenu[day].lunch} onChange={(e) => handleFoodChange(day,"lunch", e.target.value)} /></td>
                <td><input value={foodMenu[day].dinner} onChange={(e) => handleFoodChange(day,"dinner", e.target.value)} /></td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* --- Rules --- */}
        <label>Rules</label>
        <div className="rules-section">
          {rules.map((rule, i) => (
            <div key={`rule-${i}`} className={`rule-item ${selectedRules.includes(rule.name) ? "selected" : ""}`} onClick={() => toggleRule(rule.name)}>
              {rule.icon}<span>{rule.name}</span>
            </div>
          ))}
          <div className="rule-item add-rule" onClick={() => {
            const newRule = prompt("Enter new rule:"); if(newRule) setRules(prev=>[...prev,{name:newRule,icon:<FaPlus/>}])
          }}><FaPlus /></div>
        </div>

        {/* --- Amenities --- */}
        <label>Amenities</label>
        <div className="furnished-icons">
          {Object.keys(amenityKeys).map((name) => {
            const icons = { "Free WiFi": <FaWifi />, Fan: <FaFan />, Bed: <FaBed />, Lights: <FaLightbulb />, Cupboard: <FaChair />, Geyser: <FaShower />, Water: <FaThermometerHalf />, Gym: <FaDumbbell />, TV: <FaTv />, Food: <FaUtensils />, Parking: <FaCar />, AC: <FaSnowflake /> };
            return (
              <div key={`amenity-${name}`} className={`furnish-icon ${selectedFurnish.includes(name) ? "selected" : ""}`} onClick={() => toggleFurnish(name)}>
                {icons[name]}<span>{name}</span>
              </div>
            )
          })}
        </div>

        <button type="submit" className="submit-btn" disabled={saving}>{saving ? "Updating..." : "Update PG"}</button>
      </form>
    </div>
  );
};

export default EditPG;
