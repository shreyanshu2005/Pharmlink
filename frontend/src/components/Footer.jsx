import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets_frontend/assets";

const Footer = () => {
  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-10 my-10 mt-24 text-sm">
        {/* Left Section */}
        <div>
          <img className="mb-5 w-40 cursor-pointer" src={assets.logo} alt="PharmLink Logo" />
          <p className="w-full md:w-2/3 text-gray-600 leading-6">
            Enhancing healthcare with technology—secure patient management, real-time communication, seamless scheduling, and hassle-free payments.
          </p>
        </div>

        {/* Center Section */}
        <div>
          <ul className="flex flex-col gap-2 text-gray-600">
            <NavLink to="/" className="hover:text-black">
              <li>Home</li>
            </NavLink>
            <NavLink to="/about" className="hover:text-black">
              <li>About Us</li>
            </NavLink>
            <NavLink to="/contact" className="hover:text-black">
              <li>Contact Us</li>
            </NavLink>
            
          </ul>
        </div>

        {/* Right Section */}
        <div>
          <p className="text-xl font-medium mb-5">Get in Touch</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>
              <a href="tel:+91 80570 37479" className="hover:text-black">
                +91 80570 37479
              </a>
            </li>
            <li>
              <a href="mailto:support@pharmlink.example" className="hover:text-black">
                support@pharmlink.example
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          © 2025 PharmLink - All Rights Reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
