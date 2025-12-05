import React, { useState, useEffect, useCallback } from "react";
import "./Header.css";
import { FaBars, FaTimes, FaSearch, FaUser } from "react-icons/fa";
import { useNavigate, useLocation, Link } from "react-router-dom";
import logo from "../assets/logo.png";

// List of cities and their routes
const cities = [
  { name: "Hyderabad", path: "/hyderabad" },
  { name: "Chennai", path: "/chennai" },
  { name: "Bangalore", path: "/bangalore" },
  { name: "Mumbai", path: "/mumbai" },
];

// Search Component (Dropdown Removed)
const SearchComponent = ({
  searchCity,
  handleInputChange,
  handleKeyDown,
  handleSearch,
  suggestions,
  handleSuggestionClick,
}) => {
  return (
    <div className="search-container">
      <div className="search-box">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search City"
          className="search-input"
          value={searchCity}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
        {suggestions.length > 0 && (
          <ul className="suggestions-dropdown show">
            {suggestions.map((city, index) => (
              <li key={index} onClick={() => handleSuggestionClick(city)}>
                {city}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button className="search-btn" onClick={handleSearch}>
        Search
      </button>
    </div>
  );
};

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchCity, setSearchCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("hlopgToken");
    const user = localStorage.getItem("hlopgUser");
    const owner = localStorage.getItem("hlopgOwner");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    
    if (token && (user || owner)) setIsLoggedIn(true);
    else setIsLoggedIn(false);
  }, [location]);

  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setSearchCity(value);
    if (value.trim() !== "") {
      const matchedCities = cities
        .map((c) => c.name)
        .filter((city) =>
          city.toLowerCase().startsWith(value.toLowerCase())
        );
      setSuggestions(matchedCities);
    } else {
      setSuggestions([]);
    }
  }, []);

  const handleSearch = useCallback(() => {
    const cityName = searchCity.trim().toLowerCase();

  if (!cityName) {
    alert("Please enter a city name.");
    return;
  }
    const matchedCity = cities.find(
      (c) => c.name.toLowerCase() === searchCity.trim().toLowerCase()
    );
    if (matchedCity) {
    navigate(`/city/${cityName}`);
    } else {
      alert("City not found. Please select from Hyderabad, Chennai, Bangalore, Mumbai.");
    }
    setSuggestions([]);
  }, [navigate, searchCity]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleSuggestionClick = (cityName) => {
    setSearchCity(cityName);
    setSuggestions([]);
    const matchedCity = cities.find(
      (c) => c.name.toLowerCase() === cityName.toLowerCase()
    );
    if (matchedCity) navigate(`/city/${cityName.toLowerCase()}`);
  };

  const handleRoleSelection = () => {
    navigate("/RoleSelection");
    setMenuOpen(false);
  };

   

  const blackHeaderRoutes = [
    "/popup",
    "/hostel/:id",
    "/about",
    "/RoleSelection",
    "/student-login",
    "/student-signup",
    "/student-forgot-password",
    "/owner-login",
    "/owner-signup",
    "/owner-forgot-password",
  ];

  const forceBlack = blackHeaderRoutes.includes(location.pathname);

  return (
    <header
      className={`header ${
        location.pathname === "/"
          ? scrolled
            ? "scrolled"
            : "home-animation"
          : "scrolled"
      } ${forceBlack ? "role-selection-header" : ""}`}
    >
      <div className="brand" onClick={() => navigate("/")}>
        <img src={logo} alt="Logo" className="logo" />
      </div>

      {!isMobile && (
        <SearchComponent
          searchCity={searchCity}
          handleInputChange={handleInputChange}
          handleKeyDown={handleKeyDown}
          handleSearch={handleSearch}
          suggestions={suggestions}
          handleSuggestionClick={handleSuggestionClick}
        />
      )}

      {isMobile && (
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>
      )}

      <nav className={`nav ${menuOpen ? "open" : ""}`}>
        {isMobile && (
          <div className="mobile-search">
            <SearchComponent
              searchCity={searchCity}
              handleInputChange={handleInputChange}
              handleKeyDown={handleKeyDown}
              handleSearch={handleSearch}
              suggestions={suggestions}
              handleSuggestionClick={handleSuggestionClick}
            />
          </div>
        )}

        <ul>
          <li>
            <Link to="/" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" onClick={() => setMenuOpen(false)}>
              About Us
            </Link>
          </li>
          <li>
            <Link to="/contact" onClick={() => setMenuOpen(false)}>
              Contact
            </Link>
          </li>
          <li
            className="auth-section"
        
          >
            {!isLoggedIn ? (
              <button className="signup" onClick={handleRoleSelection}>
                Login / SignUp
              </button>
            ) : (
              <div className="profile-dropdown">
                <FaUser
                  className="profile-icon"
                  onClick={() => { 
                  if (user) {
                    navigate("/user-dashboard");
                  } else if (owner) {
                    navigate("/owner-dashboard");
                  } else {
                    navigate("/RoleSelection");
                  }
                }}
              />
                
              </div>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
