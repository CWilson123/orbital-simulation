export class OrbitSimulator {
    constructor(semiMajorAxis, eccentricity, inclinationStart, argumentOfPeriapsisStart, startingTrueAnomalyStart) {
        this.semiMajorAxis = semiMajorAxis;
        this.eccentricity = eccentricity;
        this.inclination = this.degreesToRadians(inclinationStart);
        this.argumentOfPeriapsis = this.degreesToRadians(argumentOfPeriapsisStart);
        this.startingTrueAnomaly = this.degreesToRadians(startingTrueAnomalyStart);
        this.G = 6.67430e-11; // gravitational constant in m^3 kg^-1 s^-2
        this.M = 5.972e24;    // mass of the Earth in kg
        this.pi = Math.PI;
    }

    degreesToRadians(degrees) {
        return degrees * this.pi / 180;
    }

    solveKepler(M, e, tol = 1e-6) {
        let E = M; // initial guess: mean anomaly
        let deltaE;
        do {
            deltaE = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
            E = E - deltaE;
        } while (Math.abs(deltaE) > tol);
        return E;
    }

    trueAnomaly(E, e) {
        return 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(E / 2), Math.sqrt(1 - e) * Math.cos(E / 2));
    }

    calculatePosition(time) {
        // Mean motion
        const n = Math.sqrt(this.G * this.M / Math.pow(this.semiMajorAxis, 3));

        // Initial eccentric anomaly from the starting true anomaly
        const E0 = 2 * Math.atan(Math.sqrt((1 - this.eccentricity) / (1 + this.eccentricity)) * Math.tan(this.startingTrueAnomaly / 2));

        // Initial mean anomaly
        const M0 = E0 - this.eccentricity * Math.sin(E0);

        // Mean anomaly at time t
        const M = M0 + n * time;

        // Solve Kepler's equation for Eccentric Anomaly
        const E = this.solveKepler(M, this.eccentricity);

        // True anomaly
        const nu = this.trueAnomaly(E, this.eccentricity);

        // Distance from the central body
        const r = this.semiMajorAxis * (1 - this.eccentricity * Math.cos(E));

        // Position in orbital plane
        const xPrime = r * Math.cos(nu);
        const yPrime = r * Math.sin(nu);

        // Convert to 3D coordinates
        const cosOmega = Math.cos(0); // Assuming longitude of ascending node = 0 for simplicity
        const sinOmega = Math.sin(0); // Assuming longitude of ascending node = 0 for simplicity
        const cosi = Math.cos(this.inclination);
        const sini = Math.sin(this.inclination);
        const cosw = Math.cos(this.argumentOfPeriapsis);
        const sinw = Math.sin(this.argumentOfPeriapsis);

        const x1 = cosw * xPrime - sinw * yPrime;
        const y1 = sinw * xPrime + cosw * yPrime;

        const x2 = x1;
        const y2 = cosi * y1;
        const z2 = sini * y1;

        const x = cosOmega * x2 - sinOmega * y2;
        const y = sinOmega * x2 + cosOmega * y2;
        const z = z2;

        return { x: x, y: y, z: z };
    }
}
