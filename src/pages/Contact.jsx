// File: src/pages/Contact.jsx
import React from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"; // ✅ New Twitter (X) logo
import "./Contact.css";

const Contact = () => {
  return (
    <div className="contact-page">
      <section className="contact-header">
        <p className="subtitle">Get Started</p>
        <h1 className="title">
          Get in touch with us. We're here to assist you.
        </h1>

        <div className="social-icons">
          {/* Facebook */}
          <a
            href="https://www.facebook.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="facebook"
          >
            <FaFacebookF />
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="instagram"
          >
            <FaInstagram />
          </a>

          {/* Twitter (X) */}
          <a
            href="https://twitter.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="twitter"
          >
            <FaXTwitter />
          </a>

        </div>
      </section>

      <section className="contact-form">
        <form>
          <div className="form-row">
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Email Address" required />
            <input type="text" placeholder="Phone Number" required />
          </div>

          {/* ✅ Message box now required */}
          <textarea placeholder="Message" rows="5" required></textarea>

          <button type="submit" className="btn-submit">
            Leave Us a Message
          </button>
        </form>
      </section>

      <section className="contact-info">
        <div className="info-left">
          <h4>Contact Info</h4>
          <h2>
            We are always happy to <br /> assist you
          </h2>
        </div>
        <div className="info-right">
          <div className="info-item">
            <h4>Email Address</h4>
            <div className="divider"></div>
            <p>support@hlopg.com</p>
            <small>Assistance hours: 24/7</small>
          </div>
          {/* <div className="info-item">
            <h4>Phone Number</h4>
            <div className="divider"></div>
            <p>+91 1234567890</p>
            <small>Assistance hours: 24/7</small>
          </div> */}
        </div>
      </section>
    </div>
  );
};

export default Contact;
