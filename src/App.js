import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import OrbitVisualizer from './components/OrbitVisualizer';
import OrbitAnimator from './components/OrbitAnimator';
import OrbitInputForm from './components/OrbitInputForm';
import { useMediaQuery } from 'react-responsive';

function App() {
  const [semiMajorAxis, setSemiMajorAxis] = useState(100);
  const [eccentricity, setEccentricity] = useState(0.5);
  const [focalDistance, setFocalDistance] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [orbitParameters, setOrbitParameters] = useState({
    semiMajorAxis: 50000,
    eccentricity: 0.1,
    inclination: 0,
    trueAnomaly: 0
  });

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  const handleEllipseSubmit = (event) => {
    event.preventDefault();
    // Recalculate focal distance and energy
    const scale = 2;
    const a = semiMajorAxis * scale;
    let focalDist = 0;
    let orbitalEnergy = 0;

    if (eccentricity < 1) {
      // Ellipse
      const b = a * Math.sqrt(1 - eccentricity ** 2);
      focalDist = Math.sqrt(a ** 2 - b ** 2);
      orbitalEnergy = -1 / (2 * semiMajorAxis);
    } else if (eccentricity === 1) {
      // Parabola
      orbitalEnergy = 0; // Parabolic orbit energy is zero
    } else {
      // Hyperbola
      const b = a * Math.sqrt(eccentricity ** 2 - 1);
      focalDist = Math.sqrt(a ** 2 + b ** 2);
      orbitalEnergy = 1 / (2 * semiMajorAxis);
    }

    setFocalDistance(focalDist);
    setEnergy(orbitalEnergy);
  };

  const updateOrbitParameters = (params) => {
    setOrbitParameters({
      ...params,
      inclination: params.inclination === 0 ? 0.1 : params.inclination,
    });
  };

  return (
    <Router>
      <div>
        <Navbar />
        <div className="content">
          <Routes>
            <Route
              path="/"
              element={
                <div className="app-container">
                  <h1>Orbit Visualizer</h1>
                  <OrbitInputForm onSubmit={updateOrbitParameters} />
                  <OrbitAnimator orbitParameters={orbitParameters} />
                </div>
              }
            />
            <Route
              path="/ellipse-maker"
              element={
                <div className="app-container">
                  <h1>Ellipse Maker</h1>
                  <form className="form" onSubmit={handleEllipseSubmit}>
                    <label className="label">Semi-Major Axis (a):</label>
                    <input
                      className="input"
                      type="number"
                      value={semiMajorAxis}
                      onChange={(e) => setSemiMajorAxis(e.target.value)}
                    />
                    <label className="label">Eccentricity (e):</label>
                    <input
                      className="input"
                      type="number"
                      value={eccentricity}
                      onChange={(e) => setEccentricity(e.target.value)}
                      step="0.01"
                      min="0"
                      max="2"
                    />
                    <button className="button" type="submit">Update Ellipse</button>
                  </form>
                  <div className="info-box">
                    <p>Focal Distance: {focalDistance.toFixed(3)}</p>
                    <p>Energy: {energy.toFixed(3)}</p>
                  </div>
                  <OrbitVisualizer semiMajorAxis={semiMajorAxis} eccentricity={eccentricity} />
                </div>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
