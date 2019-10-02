import * as d3 from 'd3';
import Photon from './Photon';

// const photon = Photon.horizontal();
// const photon = Photon.diagonal();
// const photon = Photon.antidiagonal();
// const photon = Photon.circularCW();
// const photon = Photon.vertical();

// Display photon information
const photon = Photon.circularCCW();
photon.display();

// global parameters
const width = 600;
const svg = d3.select('#wavepacket');

// 7. d3's line generator

// Electric field
// const electric = (
//   complex: { readonly re: number; readonly im: number },
//   z: number,
//   k = 20
// ) => {
//   return complex.re * Math.cos(k * z) + complex.im * Math.sin(k * z);
// };

// Gaussian scaling
// const gaussianScaling = (value: number, z: number, sigma = 0.3) => {
//   return value * Math.exp((-z * z) / (2 * sigma * sigma));
// };

// const Ex = (particle: Photon, z: number) => {
//   return gaussianScaling(electric(particle.a, z), z);
// };

// const Ey = (particle: Photon, z: number) => {
//   return gaussianScaling(electric(particle.b, z), z);
// };

const zs = d3.range(-1, 1, 0.001);
const scale = d3
  .scaleLinear()
  .domain([-1, 1])
  .range([0, width]);
const scaleR = d3
  .scaleLinear()
  .domain([-1, 1])
  .range([0, 5]);

const line = d3
  .line()
  .x(d => d[0]) // set the x values for the line generator
  .y(d => d[1]) // set the y values for the line generator
  .curve(d3.curveMonotoneX); // apply smoothing to the line

svg
  .selectAll('circle')
  .data(zs)
  .enter()
  .append('circle')
  .attr('class', 'point')
  .attr('cx', z => scale(z))
  .attr('cy', z => scale(photon.gaussianEx(z)))
  .attr('r', z => scaleR(photon.gaussianEy(z)));
