import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";
import "./App.css";

function App() {
  const cursorRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const position = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Inject Devfolio script
    const script = document.createElement("script");
    script.src = "https://apply.devfolio.co/v2/sdk.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    const moveMouse = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    document.addEventListener("mousemove", moveMouse);

    const animate = () => {
      position.current.x += (mouse.current.x - position.current.x) * 0.15;
      position.current.y += (mouse.current.y - position.current.y) * 0.15;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${position.current.x - 15}px, ${position.current.y - 15}px)`;
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      document.body.removeChild(script);
      document.removeEventListener("mousemove", moveMouse);
    };
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      smoothTouch: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="hero">
      {/* Custom Cursor */}
      <div ref={cursorRef} className="custom-cursor"></div>

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
            loading="eager"
            decoding="async"
          />
        </div>
      </header>

      {/* Hero Content */}
      <div className="hero-content">
        <img
          src="/website_logo_final.png"
          alt="Hacknovate 7.0 Logo"
          className="main-logo"
          loading="lazy"
          decoding="async"
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