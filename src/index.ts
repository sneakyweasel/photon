import * as d3 from 'd3';
import Photon from './Photon';

// global parameters
const margin = { top: 50, right: 50, bottom: 50, left: 50 };
const width = window.innerWidth - margin.left - margin.right;
const height = window.innerHeight - margin.top - margin.bottom;
const size = { x: 300, y: 100 };
const svg = d3
  .select('#wavepacket')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom);

// Generate steps related to pixel width
// const zs = d3.range(-1, 1, 0.01);
const zs = d3.range(-1, 1, 1 / (size.x * 2));
const xScale = d3
  .scaleLinear()
  .domain([-1, 1])
  .range([0, size.x]);
const yScale = d3
  .scaleLinear()
  .domain([-1, 1])
  .range([0, size.y]);
const scaleE = d3
  .scaleLinear()
  .domain([-1, 1])
  .range([3, 5]);
const scaleM = d3
  .scaleLinear()
  .domain([-1, 1])
  .range([1, 3]);

// Color scheme
// const Color = d3.scaleSequential(d3.interpolateMagma).domain([-1, 1]);
// const Color = d3.scaleSequential(d3.interpolatePlasma).domain([-1, 1]);
// const Color = d3.scaleSequential(d3.interpolateWarm).domain([-1, 1]);
const mColor = d3.scaleSequential(d3.interpolateViridis).domain([-1, 1]);
const eColor = d3.scaleSequential(d3.interpolateInferno).domain([-1, 1]);

// Render function
const render = (photon: Photon, offset: {readonly x: number, readonly y: number}, name: string = '') => {
  const g = svg.append('g').attr('transform', `translate(${offset.x}, ${offset.y})`);

  // Text
  g.append('text')
    .attr('class', 'text')
    .attr('x', size.x / 2)
    .attr('y', size.y + 35)
    .text(name);

  // Gaussian path
  g.selectAll('gaussian')
    .data(zs)
    .enter()
    .append('circle')
    .attr('class', 'gaussian')
    .attr('cx', z => xScale(z))
    .attr('cy', z => yScale(Photon.gaussian(z)))
    .attr('r', '3')
    .attr('fill', 'hsla(170, 20%, 30%, 0.3)');

  g.selectAll('gaussian')
    .data(zs)
    .enter()
    .append('circle')
    .attr('class', 'gaussian')
    .attr('cx', z => xScale(z))
    .attr('cy', z => yScale(-Photon.gaussian(z)))
    .attr('r', '3')
    .attr('fill', 'hsla(170, 20%, 30%, 0.3)');

  // Magnetic
  g.selectAll('magnetic')
    .data(zs)
    .enter()
    .append('circle')
    .attr('class', 'magnetic')
    .attr('cx', z => xScale(z))
    .attr('cy', z => yScale(photon.gaussianMy(z)))
    .attr('r', z => scaleM(photon.gaussianMx(z)))
    .attr('fill', z => mColor(photon.gaussianMy(z)));

  // Electric
  g.selectAll('electric')
    .data(zs)
    .enter()
    .append('circle')
    .attr('class', 'electric')
    .attr('cx', z => xScale(z))
    .attr('cy', z => yScale(photon.gaussianEx(z)))
    .attr('r', z => scaleE(photon.gaussianEy(z)))
    .attr('fill', z => eColor(photon.gaussianEy(z)));
};

const vertical = Photon.vertical();
const horizontal = Photon.horizontal();
const diagonal = Photon.diagonal();
const antidiagonal = Photon.antidiagonal();
const circularCW = Photon.circularCW();
const circularCCW = Photon.circularCCW();

const xOff = 50;
const yOff = 75;
render(horizontal, {x: xOff, y: 20}, 'Horizontal');
render(vertical, {x: xOff, y: size.y + yOff}, 'Vertical');
render(diagonal, {x: size.x + xOff * 2, y: 20}, 'Diagonal');
render(antidiagonal, {x: size.x + xOff * 2, y: size.y + yOff}, 'Antidiagonal');
render(circularCW, {x: size.x * 2 + xOff * 3, y: 20}, 'Circular CW');
render(circularCCW, {x: size.x * 2 + xOff * 3, y: size.y + yOff}, 'Circular CCW');
