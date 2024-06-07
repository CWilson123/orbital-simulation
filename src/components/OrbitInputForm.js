// src/components/OrbitInputForm.js
import React, { useState } from 'react';
import './OrbitInputForm.css';

const OrbitInputForm = ({ onSubmit }) => {
  const [semiMajorAxis, setSemiMajorAxis] = useState(50000);
  const [eccentricity, setEccentricity] = useState(0.1);
  const [inclination, setInclination] = useState(0);
  const [argumentOfPeriapsis, setArgumentOfPeriapsis] = useState(0);
  const [trueAnomaly, setTrueAnomaly] = useState(0);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      semiMajorAxis,
      eccentricity,
      inclination,
      argumentOfPeriapsis,
      trueAnomaly,
    });
  };

  return (
    <form className="orbit-input-form" onSubmit={handleSubmit}>
      <label>
        Semi-Major Axis (a):
        <input type="number" value={semiMajorAxis} onChange={(e) => setSemiMajorAxis(e.target.value)} />
      </label>
      <label>
        Eccentricity (e):
        <input type="number" step="0.01" value={eccentricity} onChange={(e) => setEccentricity(e.target.value)} />
      </label>
      <label>
        Inclination (i):
        <input type="number" step="0.1" value={inclination} onChange={(e) => setInclination(e.target.value)} min="0" max="180" />
      </label>
      {/* <label>
        Argument of Periapsis (ω):
        <input type="number" step="0.1" value={argumentOfPeriapsis} onChange={(e) => setArgumentOfPeriapsis(e.target.value)} />
      </label> */}
      <label>
        Starting True Anomaly (ν):
        <input type="number" step="0.1" value={trueAnomaly} onChange={(e) => setTrueAnomaly(e.target.value)} />
      </label>
      <button type="submit">Update Orbit</button>
    </form>
  );
};

export default OrbitInputForm;
