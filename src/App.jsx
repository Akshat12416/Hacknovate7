import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [cursorPosition, setCursorPosition] = useState({ x: -100, y: -100 });

  useEffect(() => {
    // Preload background image
    const imageUrl = "/light.jpg";
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = imageUrl;
    document.head.appendChild(link);

    // Inject Devfolio script
    const script = document.createElement("script");
    script.src = "https://apply.devfolio.co/v2/sdk.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="hero">
      {/* Custom Cursor */}
      <div
        className="custom-cursor"
        style={{
          transform: `translate(${cursorPosition.x - 15}px, ${
            cursorPosition.y - 15
          }px)`
        }}
      ></div>

      {/* Header */}
      <header className="app-header">
        <div className="header-logo-container">
          {/* <img
            src="/logo_website.png"
            alt="Rotating Flower Logo"
            className="header-logo"
          /> */}
          <img
            src="/logo_website.png"
            alt="Text Logo"
            className="text-logo"
          />
        </div>
      </header>

      {/* Hero Content */}
      <div className="hero-content">
        <img
          src="/website_logo_final.png"
          alt="Hacknovate 7.0 Logo"
          className="main-logo"
        />

        <p className="tagline">WEBSITE COMING SOON</p>

        <div
          className="apply-button"
          data-hackathon-slug="hacknovate07"
          data-button-theme="dark"
          style={{ height: "44px", width: "312px" }}
        ></div>
      </div>
    </div>
  );
}

export default App;