// src/components/OrbitAnimator.js
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { calculateOrbitalPeriod } from "../utils/orbitalCalculations";
import "./OrbitAnimator.css";

const OrbitAnimator = ({ orbitParameters }) => {
  const svgRef = useRef();
  const svgSideRef = useRef(); // Add reference for side view
  const [isRunning, setIsRunning] = useState(false);

  const {
    semiMajorAxis,
    eccentricity,
    trueAnomaly,
    argumentOfPeriapsis,
    inclination,
  } = orbitParameters;

  useEffect(() => {
    const width = window.innerWidth * 0.3;
    const height = window.innerHeight * 0.2;

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
    const omega = (argumentOfPeriapsis * Math.PI) / 180; // Convert to radians
    const i = (inclination * Math.PI) / 180; // Convert inclination to radians

    // Calculate rotation matrix for the Argument of Periapsis
    const cosOmega = Math.cos(omega);
    const sinOmega = Math.sin(omega);

    // Adjust the semi-major axis for the top-down view based on inclination
    const aAdjusted = Math.abs(a * Math.cos(i));
    const bAdjusted = Math.abs(b * Math.cos(i));


    const aSide = semiMajorAxis / 1000; // Scale down for visualization
    const bSide = a * Math.sqrt(1 - eccentricity ** 2);
    const omegaSide = (inclination * Math.PI) / 180; // Convert to radians
    const iSide = (argumentOfPeriapsis * Math.PI) / 180; // Convert inclination to radians

    // Calculate rotation matrix for the Argument of Periapsis
    const cosOmegaSide = Math.cos(omegaSide);
    const sinOmegaSide = Math.sin(omegaSide);

    // Adjust the semi-major axis for the top-down view based on inclination
    const aAdjustedSide = Math.abs(a * Math.cos(iSide));
    let bAdjustedSide = Math.abs(b * Math.sin(iSide));


    console.log('a, b: ',a , ' : ', b);
    console.log('a, b side: ',aSide , ' : ', bSide);

    console.log('aAdjsuted, bAdjusted: ',aAdjusted , ' : ', bAdjusted);
    console.log('aAdjusted , bAdjusted side: ',aAdjustedSide , ' : ', bAdjustedSide);

    if(bAdjustedSide === 0)
    {
        bAdjustedSide = 0.1;
    }
    // Main view orbit
    svg
      .append("ellipse")
      .attr("cx", centerX)
      .attr("cy", centerY)
      .attr("rx", aAdjusted)
      .attr("ry", bAdjusted)
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr(
        "transform",
        `rotate(${argumentOfPeriapsis}, ${centerX}, ${centerY})`
      );

// Side view orbit (XZ plane)
svgSide.append('ellipse')
  .attr('cx', centerX)
  .attr('cy', centerY)
  .attr('rx', aAdjustedSide)
  .attr('ry', bAdjustedSide)  // Use sin(inclination) for Z axis
  .attr('fill', 'none')
  .attr('stroke', 'white')
  .attr('transform', `rotate(${-inclination}, ${centerX}, ${centerY})`); // Rotate based on argument of periapsis


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
    const initialX =
      centerX +
      aAdjusted * Math.cos(initialAngle) * cosOmega -
      bAdjusted * Math.sin(initialAngle) * sinOmega;
    const initialY =
      centerY +
      aAdjusted * Math.cos(initialAngle) * sinOmega +
      bAdjusted * Math.sin(initialAngle) * cosOmega;
    satellite.attr("cx", initialX).attr("cy", initialY);

    // Set initial position for side view
    const initialZ = centerY + a * Math.sin(initialAngle) * Math.sin(i);
    satelliteSide.attr("cx", initialX).attr("cy", initialZ);

    const animate = () => {
      t += 0.01;
      const angle = initialAngle + angularVelocity * t;

      // Main view satellite position
      const x =
        centerX +
        aAdjusted * Math.cos(angle) * cosOmega -
        bAdjusted * Math.sin(angle) * sinOmega;
      const y =
        centerY +
        aAdjusted * Math.cos(angle) * sinOmega +
        bAdjusted * Math.sin(angle) * cosOmega;
      satellite.attr("cx", x).attr("cy", y);

      // Side view satellite position
      const z = centerY + a * Math.sin(angle) * Math.sin(i);
      satelliteSide.attr("cx", x).attr("cy", z);

      if (isRunning) {
        requestAnimationFrame(animate);
      }
    };

    if (isRunning) {
      animate();
    }
  }, [
    semiMajorAxis,
    eccentricity,
    trueAnomaly,
    argumentOfPeriapsis,
    inclination,
    isRunning,
  ]);

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
      <svg ref={svgRef}></svg>
      <svg ref={svgSideRef}></svg>
    </div>
  );
};

export default OrbitAnimator;
