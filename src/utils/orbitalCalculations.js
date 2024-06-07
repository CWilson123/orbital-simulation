// src/utils/orbitalCalculations.js
const gravitationalConstant = 6.67430e-11; // m^3 kg^-1 s^-2
const earthMass = 5.972e24; // kg
const earthRadius = 6371e3; // meters



export const calculateOrbitalPeriod = (semiMajorAxis) => {
  const mu = gravitationalConstant * earthMass;
  return 2 * Math.PI * Math.sqrt(Math.pow(semiMajorAxis, 3) / mu);
};

export const calculateApogee = (semiMajorAxis, eccentricity) => {
  return semiMajorAxis * (1 + eccentricity) - earthRadius;
};

export const calculatePerigee = (semiMajorAxis, eccentricity) => {
  return semiMajorAxis * (1 - eccentricity) - earthRadius;
};

export const calculateSpecificOrbitalEnergy = (semiMajorAxis) => {
  const mu = gravitationalConstant * earthMass;
  return -mu / (2 * semiMajorAxis);
};




