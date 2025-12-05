import React, { useState } from "react";
import "./AboutUs.css";
import {
  FaShieldAlt,
  FaRupeeSign,
  FaSearch,
  FaUsers,
  FaFilter,
  FaHeadset,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

// Import assets
import aboutMain from "../assets/main.png"; // main left image
import icon1 from "../assets/icon1.png";
import icon2 from "../assets/icon2.png";
import icon3 from "../assets/icon3.png";
import icon4 from "../assets/icon4.png";
import missionImg from "../assets/mission.png"; // replace with your image
import visionImg from "../assets/vision.png";   // replace with your image

function AboutUs() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I book a PG through HloPG?",
      answer:
        "Simply browse verified listings, choose the property you like, and contact the owner directly through our platform.",
    },
    {
      question: "Are the listings really verified?",
      answer:
        "Yes! Our team physically visits and verifies every property for authenticity, safety, and cleanliness.",
    },
    {
      question: "Do I have to pay any brokerage fees?",
      answer:
        "No, we connect you directly with property owners. There are zero brokerage charges on our platform.",
    },
    {
      question: "What kind of support do you provide?",
      answer:
        "Our support team is available to guide you throughout your search and moving process, ensuring a hassle-free experience.",
    },
  ];

  return (
    <div className="aboutus-wrapper">
      {/* ================= About Us Section ================= */}
      <div className="aboutus-container">
        {/* Left Image */}
        <div className="aboutus-image">
          <img src={aboutMain} alt="About Hlo PG" />
        </div>

        {/* Right Content */}
        <div className="aboutus-content">
          <h2 className="aboutus-heading">
            Find Your Perfect <br /> PG Hostel’s with <span>HloPG</span>
          </h2>
          <p className="aboutus-subtitle">
            From students to professionals, we’ve got you covered. <br />
            Discover verified PGs that feel like home.
          </p>

          {/* Icons */}
          <div className="aboutus-icons">
            <div className="aboutus-icon-item">
              <img src={icon1} alt="Feature 1" />
              <p>Verified Listings</p>
            </div>
            <div className="aboutus-icon-item">
              <img src={icon2} alt="Feature 2" />
              <p>No Hidden Fees</p>
            </div>
            <div className="aboutus-icon-item">
              <img src={icon3} alt="Feature 3" />
              <p>Trusted Owners</p>
            </div>
            <div className="aboutus-icon-item">
              <img src={icon4} alt="Feature 4" />
              <p>Quick Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= Why Us Section ================= */}
      <section className="whyus-section">
        <h2 className="whyus-heading">
          Why <span>Us?</span>
        </h2>
        <p className="whyus-subtitle">
          Our platform is built from the ground up to provide a safe,
          transparent, and hassle-free experience. Here's what makes us
          different:
        </p>

        <div className="whyus-cards">
          <div className="whyus-card">
            <div className="whyus-icon">
              <FaShieldAlt />
            </div>
            <h3>100% Verified Properties</h3>
            <p>
              Every listing is physically visited and verified by our team for
              authenticity, safety, and cleanliness. What you see is what you
              get.
            </p>
          </div>

          <div className="whyus-card">
            <div className="whyus-icon">
              <FaRupeeSign />
            </div>
            <h3>Zero Brokerage Fees</h3>
            <p>
              We connect you directly with property owners, saving you from
              unnecessary fees and hidden charges.
            </p>
          </div>

          <div className="whyus-card">
            <div className="whyus-icon">
              <FaSearch />
            </div>
            <h3>Transparent Pricing</h3>
            <p>
              No surprises. All rental and deposit info is clearly listed so you
              can budget with confidence.
            </p>
          </div>

          <div className="whyus-card">
            <div className="whyus-icon">
              <FaUsers />
            </div>
            <h3>Safety-First Community</h3>
            <p>
              We prioritize your security by visiting property owners and
              fostering a community built on trust.
            </p>
          </div>

          <div className="whyus-card">
            <div className="whyus-icon">
              <FaFilter />
            </div>
            <h3>Simple & Fast Search</h3>
            <p>
              Our user-friendly platform and powerful filters make finding the
              perfect home easier than ever.
            </p>
          </div>

          <div className="whyus-card">
            <div className="whyus-icon">
              <FaHeadset />
            </div>
            <h3>Dedicated Support</h3>
            <p>
              Our team is here to assist you at every step, from your initial
              search to moving in.
            </p>
          </div>
        </div>
      </section>
      
      {/* ================= Mission & Vision Section ================= */}
      <section className="mission-vision-section">
        <h2 className="mission-vision-heading">
          About <span>Us</span>
        </h2>
        <div className="mission-vision-cards">
          {/* Mission */}
          <div className="mv-card">
            <img src={missionImg} alt="Our Mission" className="mv-img" />
            <p className="mv-text">
              To build India's most trusted accommodation platform by
              prioritizing physical verification and radical transparency. We
              are committed to ensuring every student and professional can find
              a safe and comfortable home, stress-free.
            </p>
            <h3 className="mv-title">Our Mission</h3>
          </div>

          {/* Vision */}
          <div className="mv-card">
            <img src={visionImg} alt="Our Vision" className="mv-img" />
            <p className="mv-text">
              We create a trusted ecosystem of verified services that support
              every stage of relocation — from housing and food to community and
              career — empowering individuals to confidently start a new
              chapter.
            </p>
            <h3 className="mv-title">Our Vision</h3>
          </div>
        </div>
      </section>

      {/* ================= FAQ Section ================= */}
      <section className="faq-section">
        <h2 className="faq-heading">
          Frequently Asked <span>Questions</span>
        </h2>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${openIndex === index ? "active" : ""}`}
            >
              <div className="faq-question" onClick={() => toggleFAQ(index)}>
                <h3>{faq.question}</h3>
                {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
              </div>
              <p className="faq-answer">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      
    </div>
  );
}

export default AboutUs;
