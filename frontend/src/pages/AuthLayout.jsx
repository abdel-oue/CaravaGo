import React from "react";
import logo from "../public/logo-cropped.png";
import defaultImage from "../public/auth-background.jpg";

const AuthLayout = ({ children, accountLinks, image = defaultImage }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white/60 via-white/40 to-primary/25 px-2 py-8">
      <div
        className="w-full justify-between md:max-w-6xl relative flex flex-col md:flex-row bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-primary/15"
        style={{ height: 700 }}
      >
        {/* Left side: form area */}
        <div className="w-full max-w-lg mx-auto md:mx-0 md:w-1/2 md:max-w-none flex flex-col px-10 py-10 md:py-14 relative z-10" style={{ height: '100%' }}>
          {/* Logo - top left */}
          <div className="flex justify-start mb-8">
            <img src={logo} alt="CaravaGo" className="h-12 w-auto" />
          </div>

          {/* Centered content */}
          <div className="flex-1 flex flex-col justify-center">
            {children}
          </div>

          {/* Account links - bottom left */}
          {accountLinks && (
            <div className="flex justify-start mt-4">
              {accountLinks}
            </div>
          )}
        </div>
        {/* Right side: image */}
        <div className="hidden md:block md:w-1/2 relative overflow-hidden">
          <img
            src={image}
            alt="Auth visual"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* Decorative overlays if needed (gradient or color wash) */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/15 to-primary/5" />
          {/* Place for overlays, avatars, cards, etc. if future needed */}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

