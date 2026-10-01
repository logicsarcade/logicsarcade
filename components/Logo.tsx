import React from "react";
import Link from "next/link";
import la from "../icons/logicsarcade.png";
const Logo = () => {
  return (
    <Link
      href="/"
      style={{
        fontFamily: "'Space Grotesk',sans-serif",
        fontSize: 26,
        fontWeight: 700,
        color: "#fff",
        textDecoration: "none",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
    >
      <img
        src={la.src}
        alt="LogicsArcade"
        style={{ height: 40, marginRight: 12 }}
      />
      Logics
      <span
        style={{
          color: "transparent",
          background: "linear-gradient(90deg, var(--violet), var(--cyan))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        Arcade
      </span>
    </Link>
  );
};

export default Logo;
