"use client";
import { useEffect, useRef } from "react";

export default function Globe() {
  const dot1Ref = useRef<SVGCircleElement>(null);
  const dot2Ref = useRef<SVGCircleElement>(null);
  const halo1Ref = useRef<SVGCircleElement>(null);
  const halo2Ref = useRef<SVGCircleElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const angle = useRef({ a1: 0, a2: Math.PI });

  useEffect(() => {
    // The globe is hidden below the lg breakpoint, so don't animate it there
    if (window.innerWidth < 1024) return;
    let raf = 0;
    function orbit() {
      if (document.hidden) { raf = requestAnimationFrame(orbit); return; }
      angle.current.a1 += 0.008;
      angle.current.a2 += 0.006;
      const cx = 250, cy = 250, rx = 230, ry = 60;
      const x1 = cx + rx * Math.cos(angle.current.a1);
      const y1 = cy + ry * Math.sin(angle.current.a1);
      const x2 = cx + rx * Math.cos(angle.current.a2);
      const y2 = cy + ry * Math.sin(angle.current.a2);
      if (dot1Ref.current) {
        dot1Ref.current.setAttribute("cx", String(x1));
        dot1Ref.current.setAttribute("cy", String(y1));
        const s = 0.6 + (y1 - (cy - ry)) / (2 * ry) * 0.8;
        dot1Ref.current.setAttribute("r", String(3 * s));
        dot1Ref.current.setAttribute("opacity", String(0.3 + s * 0.7));
        if (halo1Ref.current) {
          halo1Ref.current.setAttribute("cx", String(x1));
          halo1Ref.current.setAttribute("cy", String(y1));
          halo1Ref.current.setAttribute("r", String(3 * s * 2.6));
        }
      }
      if (dot2Ref.current) {
        dot2Ref.current.setAttribute("cx", String(x2));
        dot2Ref.current.setAttribute("cy", String(y2));
        const s = 0.4 + (y2 - (cy - ry)) / (2 * ry) * 0.6;
        dot2Ref.current.setAttribute("r", String(2.5 * s));
        dot2Ref.current.setAttribute("opacity", String(0.2 + s * 0.6));
        if (halo2Ref.current) {
          halo2Ref.current.setAttribute("cx", String(x2));
          halo2Ref.current.setAttribute("cy", String(y2));
          halo2Ref.current.setAttribute("r", String(2.5 * s * 2.6));
        }
      }
      raf = requestAnimationFrame(orbit);
    }
    raf = requestAnimationFrame(orbit);

    const onMouse = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      const xd = (e.clientX / window.innerWidth - 0.5) * 20;
      const yd = (e.clientY / window.innerHeight - 0.5) * 14;
      wrapRef.current.style.transform = `translateY(-50%) translate(${xd}px,${yd}px)`;
    };
    document.addEventListener("mousemove", onMouse);
    return () => { cancelAnimationFrame(raf); document.removeEventListener("mousemove", onMouse); };
  }, []);

  return (
    <div
      ref={wrapRef}
      style={{
        position: "absolute", right: "5%", top: "50%",
        transform: "translateY(-50%)",
        width: "min(520px, 45vw)", aspectRatio: "1",
        zIndex: 1,
        transition: "transform 0.08s linear",
      }}
      className="hidden lg:block"
    >
      <div className="globe-float" style={{ width: "100%", height: "100%", position: "relative" }}>
        <div style={{
          position: "absolute", inset: "-22%", pointerEvents: "none",
          background: "radial-gradient(circle, rgba(124,58,237,0.13) 0%, rgba(0,245,255,0.07) 38%, transparent 66%)",
        }} />
        <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg"
          style={{ width: "100%", height: "100%", position: "relative" }}>
          <defs>
            <radialGradient id="globeGrad" cx="35%" cy="35%">
              <stop offset="0%" stopColor="#1a0a3a" />
              <stop offset="100%" stopColor="#050508" />
            </radialGradient>
            <radialGradient id="glowGrad" cx="35%" cy="35%">
              <stop offset="0%" stopColor="rgba(0,245,255,0.15)" />
              <stop offset="60%" stopColor="rgba(124,58,237,0.05)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <clipPath id="globeClip"><circle cx="250" cy="250" r="210" /></clipPath>
          </defs>

          <circle cx="250" cy="250" r="230" fill="none" stroke="rgba(0,245,255,0.04)" strokeWidth="40" />
          <circle cx="250" cy="250" r="218" fill="none" stroke="rgba(0,245,255,0.06)" strokeWidth="2" />
          <circle cx="250" cy="250" r="210" fill="url(#globeGrad)" />
          <circle cx="250" cy="250" r="210" fill="url(#glowGrad)" />

          <g clipPath="url(#globeClip)" stroke="rgba(0,245,255,0.12)" strokeWidth="1" fill="none">
            {[210, 175, 120, 60, 15].map(rx => (
              <ellipse key={rx} cx="250" cy="250" rx={rx} ry="210" />
            ))}
          </g>
          <g clipPath="url(#globeClip)" stroke="rgba(0,245,255,0.1)" strokeWidth="1" fill="none">
            <ellipse cx="250" cy="250" rx="210" ry="60" />
            <ellipse cx="250" cy="190" rx="200" ry="45" />
            <ellipse cx="250" cy="310" rx="200" ry="45" />
            <ellipse cx="250" cy="130" rx="165" ry="30" />
            <ellipse cx="250" cy="370" rx="165" ry="30" />
            <ellipse cx="250" cy="80" rx="110" ry="18" />
            <ellipse cx="250" cy="420" rx="110" ry="18" />
          </g>

          <g clipPath="url(#globeClip)" fill="rgba(124,58,237,0.2)" stroke="rgba(124,58,237,0.3)" strokeWidth="0.5">
            <path d="M180 160 Q210 140 240 155 Q265 165 270 185 Q275 205 260 215 Q240 225 215 215 Q190 205 180 185 Z" />
            <path d="M280 200 Q310 185 335 195 Q350 205 345 225 Q335 240 310 240 Q290 230 280 215 Z" />
            <path d="M150 250 Q175 235 205 245 Q225 255 225 275 Q220 295 195 300 Q165 295 148 278 Z" />
            <path d="M290 275 Q320 260 345 268 Q365 278 365 300 Q360 320 335 325 Q308 322 295 305 Z" />
            <path d="M200 330 Q225 315 255 320 Q275 328 278 348 Q275 365 250 370 Q225 368 208 352 Z" />
          </g>

          <ellipse cx="195" cy="195" rx="70" ry="50" fill="rgba(255,255,255,0.03)" transform="rotate(-25 250 250)" />

          <g>
            {[[225,190,"#00f5ff",3,0.9],[308,215,"#00f5ff",2.5,0.7],[175,268,"#a78bfa",3,0.8],[330,295,"#00f5ff",2.5,0.6],[240,345,"#a78bfa",3,0.7]].map(([x,y,c,r,o],i) => (
              <g key={i}>
                <circle cx={x as number} cy={y as number} r={(r as number) * 2.6} fill={c as string} opacity={(o as number) * 0.18} />
                <circle cx={x as number} cy={y as number} r={r as number} fill={c as string} opacity={o as number} />
              </g>
            ))}
          </g>
          <g stroke="rgba(0,245,255,0.2)" strokeWidth="1" strokeDasharray="3 4" fill="none">
            <line x1="225" y1="190" x2="308" y2="215" />
            <line x1="308" y1="215" x2="330" y2="295" />
            <line x1="175" y1="268" x2="240" y2="345" />
            <line x1="225" y1="190" x2="175" y2="268" />
          </g>

          <circle ref={halo1Ref} cx="460" cy="250" r="10" fill="#00f5ff" opacity="0.15" />
          <circle ref={halo2Ref} cx="40" cy="250" r="8" fill="#a78bfa" opacity="0.12" />
          <circle ref={dot1Ref} cx="460" cy="250" r="4" fill="#00f5ff" opacity="0.8" />
          <circle ref={dot2Ref} cx="40" cy="250" r="3" fill="#a78bfa" opacity="0.6" />
        </svg>

        <div style={{
          position: "absolute", bottom: "-10%", left: "10%", right: "10%", height: 40,
          background: "radial-gradient(ellipse, rgba(0,245,255,0.2) 0%, transparent 70%)",
        }} className="globe-float" />
      </div>
    </div>
  );
}
