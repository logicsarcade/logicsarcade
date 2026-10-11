import React from "react";
import Link from "next/link";
import Image from "next/image";
import la from "../icons/logicsarcade.png";
const Logo = () => {
  return (
    <Link
      href="/"
      style={{
        fontFamily: "var(--font-sg),sans-serif",
        fontSize: 26,
        fontWeight: 700,
        color: "#fff",
        textDecoration: "none",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
    >
      <Image src={la} alt="" width={40} height={40} priority style={{ height: 40, width: "auto", marginRight: 12 }} />
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
