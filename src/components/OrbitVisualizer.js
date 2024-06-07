// src/components/OrbitVisualizer.js
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const OrbitVisualizer = ({ semiMajorAxis, eccentricity }) => {
  const svgRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 900, height: 900 });

  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth * 0.9;
      const height = window.innerHeight * 0.9;
      setDimensions({ width, height });
    };

    window.addEventListener('resize', updateDimensions);
    updateDimensions();

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const svg = d3.select(svgRef.current)
      .attr('width', dimensions.width)
      .attr('height', dimensions.height);

    svg.selectAll('*').remove(); // Clear previous drawings

    const width = dimensions.width;
    const height = dimensions.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 2; // Scale factor for visualization

    let focalDistance = 0;
    let energy = 0;

    if (eccentricity < 1) {
      // Ellipse
      const a = semiMajorAxis * scale;
      const b = a * Math.sqrt(1 - eccentricity ** 2);

      focalDistance = Math.sqrt(a ** 2 - b ** 2);
      energy = -1 / (2 * semiMajorAxis); // Simplified specific orbital energy formula

      svg.append('ellipse')
        .attr('cx', centerX)
        .attr('cy', centerY)
        .attr('rx', a)
        .attr('ry', b)
        .attr('fill', 'none')
        .attr('stroke', 'blue')
        .attr('stroke-width', 2);

      // Focus points
      svg.append('circle')
        .attr('cx', centerX + focalDistance)
        .attr('cy', centerY)
        .attr('r', 5)
        .attr('fill', 'red');

      svg.append('circle')
        .attr('cx', centerX - focalDistance)
        .attr('cy', centerY)
        .attr('r', 5)
        .attr('fill', 'red');
    } else if (eccentricity === 1) {
      // Parabola
      const p = semiMajorAxis * scale;

      const parabola = d3.line()
        .x(d => d.x)
        .y(d => d.y);

      const data = [];
      for (let x = -width / 2; x <= width / 2; x += 1) {
        const y = (x ** 2) / (2 * p);
        data.push({ x: centerX + x, y: centerY + y });
      }

      svg.append('path')
        .datum(data)
        .attr('d', parabola)
        .attr('fill', 'none')
        .attr('stroke', 'blue')
        .attr('stroke-width', 2);
    } else {
      // Hyperbola
      const a = semiMajorAxis * scale;
      const b = a * Math.sqrt(eccentricity ** 2 - 1);

      focalDistance = Math.sqrt(a ** 2 + b ** 2);
      energy = 1 / (2 * semiMajorAxis); // Simplified specific orbital energy formula

      const hyperbola = d3.line()
        .x(d => d.x)
        .y(d => d.y);

      const data1 = [];
      const data2 = [];
      for (let x = -width / 2; x <= width / 2; x += 1) {
        if (x !== 0) {
          const y = Math.sqrt((x ** 2 / a ** 2 - 1) * b ** 2);
          data1.push({ x: centerX + x, y: centerY + y });
          data2.push({ x: centerX + x, y: centerY - y });
        }
      }

      svg.append('path')
        .datum(data1)
        .attr('d', hyperbola)
        .attr('fill', 'none')
        .attr('stroke', 'blue')
        .attr('stroke-width', 2);

      svg.append('path')
        .datum(data2)
        .attr('d', hyperbola)
        .attr('fill', 'none')
        .attr('stroke', 'blue')
        .attr('stroke-width', 2);

      // Focus points
      svg.append('circle')
        .attr('cx', centerX + focalDistance)
        .attr('cy', centerY)
        .attr('r', 5)
        .attr('fill', 'red');

      svg.append('circle')
        .attr('cx', centerX - focalDistance)
        .attr('cy', centerY)
        .attr('r', 5)
        .attr('fill', 'red');
    }


  }, [semiMajorAxis, eccentricity, dimensions]);

  return <svg ref={svgRef}></svg>;
};

export default OrbitVisualizer;
