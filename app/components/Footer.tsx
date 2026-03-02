import React from "react";
import { AiFillInstagram } from "react-icons/ai";
import { FaFacebook } from "react-icons/fa";
import { Link } from "react-router";

function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 py-6">
      <div className="max-w-[1280px] mx-auto px-5 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          <div>
            <p className="font-extrabold text-3xl mb-4 lg:mb-0">
              <Link to={"/"} className="hover:underline brand-txt">
                eCommerce
              </Link>
            </p>
            <p className="text-gray-500 leading-relaxed max-w-md">
              Welcome to eCommerce! 
            </p>
          </div>

          <div className="flex justify-start lg:justify-end">
            <div>
              <p className="font-medium text-xl mb-4">Contact us</p>
              <div className="flex gap-6 text-gray-600">
                <a
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="hover:text-blue-600 transition"
                >
                  <FaFacebook size={26} />
                </a>
                {/* <a
                  href="https://www.instagram.com/fellas.fav"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="hover:text-pink-600 transition"
                >
                  <AiFillInstagram size={28} />
                </a> */}
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-gray-500 mt-10 text-sm">
          © {new Date().getFullYear()} eCommerce. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
