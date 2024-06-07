// src/components/OrbitAnimator.js
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { calculateOrbitalPeriod } from "../utils/orbitalCalculations";
import "./OrbitAnimator.css";

const OrbitAnimator = ({ orbitParameters }) => {
  const svgRef = useRef();
  const svgSideRef = useRef(); // Add reference for side view
  const [isRunning, setIsRunning] = useState(false);

  const { semiMajorAxis, eccentricity, trueAnomaly, inclination } = orbitParameters;

  useEffect(() => {
    const width = window.innerWidth * 0.5;
    const height = window.innerHeight * 0.7;

    // Main view SVG setup
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    svg.selectAll("*").remove(); // Clear previous drawings

    // Side view SVG setup
    const svgSide = d3
      .select(svgSideRef.current)
      .attr("width", width)
      .attr("height", height);

    svgSide.selectAll("*").remove(); // Clear previous drawings

    const centerX = width / 2;
    const centerY = height / 2;

    // Drawing Earth
    svg
      .append("circle")
      .attr("cx", centerX)
      .attr("cy", centerY)
      .attr("r", 20)
      .attr("fill", "blue");

    svgSide
      .append("circle")
      .attr("cx", centerX)
      .attr("cy", centerY)
      .attr("r", 20)
      .attr("fill", "blue");

    const a = semiMajorAxis / 1000; // Scale down for visualization
    const b = a * Math.sqrt(1 - eccentricity ** 2);
    const i = (inclination * Math.PI) / 180; // Convert inclination to radians

    // Adjust the semi-major axis for the top-down view based on inclination
    const aAdjusted = Math.abs(a * Math.cos(i));
    const bAdjusted = b;

    let cAdjusted = a * Math.sin(i);
    if (cAdjusted === 0) {
      cAdjusted = 0.1;
    }

    // Main view orbit (top-down view)
    svg
      .append("ellipse")
      .attr("cx", centerX)
      .attr("cy", centerY)
      .attr("rx", aAdjusted)
      .attr("ry", bAdjusted)
      .attr("fill", "none")
      .attr("stroke", "white");

    // Side view orbit (XZ plane)
    svgSide.append("ellipse")
      .attr("cx", centerX)
      .attr("cy", centerY)
      .attr("rx", a)
      .attr("ry", 0.1)  // Use sin(inclination) for Z axis
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("transform", `rotate(${-inclination}, ${centerX}, ${centerY})`); // Rotate based on inclination

    // Adding Satellite
    const satellite = svg.append("circle").attr("r", 5).attr("fill", "red");

    const satelliteSide = svgSide
      .append("circle")
      .attr("r", 5)
      .attr("fill", "red");

    const orbitalPeriod = calculateOrbitalPeriod(semiMajorAxis);
    const angularVelocity = (2 * Math.PI) / orbitalPeriod;

    let t = 0;

    // Set initial position based on true anomaly and rotation for main view
    const initialAngle = (trueAnomaly * Math.PI) / 180; // Convert to radians
    let initialX = centerX + aAdjusted * Math.cos(initialAngle);
    if (inclination >= 90) {
      initialX = centerX - aAdjusted * Math.cos(initialAngle);
    }
    const initialY = centerY + bAdjusted * Math.sin(initialAngle);
    satellite.attr("cx", initialX).attr("cy", initialY);

    // Set initial position for side view
    const initialZ = centerY + a * -Math.cos(initialAngle) * Math.sin(i);
    satelliteSide.attr("cx", initialX).attr("cy", initialZ);

    const animate = () => {
      t += 0.01;
      const angle = initialAngle + angularVelocity * t;

      // Main view satellite position
      let x = centerX + aAdjusted * Math.cos(angle);
      if (inclination >= 90) {
        x = centerX - aAdjusted * Math.cos(angle);
      }
      const y = centerY + bAdjusted * Math.sin(angle);
      satellite.attr("cx", x).attr("cy", y);

      // Side view satellite position
      const z = centerY + a * -Math.cos(angle) * Math.sin(i);
      satelliteSide.attr("cx", x).attr("cy", z);

      if (isRunning) {
        requestAnimationFrame(animate);
      }
    };

    if (isRunning) {
      animate();
    }
  }, [semiMajorAxis, eccentricity, trueAnomaly, inclination, isRunning]);

  return (
    <div className="orbit-animator">
      <div className="button-container">
        <button className="button-start" onClick={() => setIsRunning(true)}>
          Start
        </button>
        <button className="button-stop" onClick={() => setIsRunning(false)}>
          Stop
        </button>
      </div>
      <div className="svg-container">
        <div className="svg-section">
          <div className="svg-label">Top Down View, XY plane</div>
          <svg ref={svgRef}></svg>
        </div>
        <div className="svg-section">
          <div className="svg-label">Side View, XZ plane</div>
          <svg ref={svgSideRef}></svg>
        </div>
      </div>
    </div>
  );
};

export default OrbitAnimator;
