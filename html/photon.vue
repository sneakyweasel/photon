<template>
  <svg class="photon" :width="width + 2 * margin" :height="height + 2 * margin">
    <g class="electric">
      <circle
        v-for="(z, index) in zs"
        :key="`electricPoint-${index}`"
        class="point electric"
        :cx="xScale(z)"
        :cy="yScale(photon.gaussianEx(z))"
        :r="scaleE(photon.gaussianEy(z))"
        :style="{fill: eColor(photon.gaussianEy(z))}"
      />
    </g>

    <g class="magnetic">
      <circle
        v-for="(z, index) in zs"
        :key="`magneticPoint-${index}`"
        class="point magnetic"
        :cx="xScale(z)"
        :cy="yScale(photon.gaussianMy(z))"
        :r="ScaleM(photon.gaussianMx(z))"
        :style="{fill: photon.gaussianMy(z)}"
      />
    </g>

    <g class="gaussian">
      <circle
        v-for="(z, index) in zs"
        :key="`gaussianPoint-${index}`"
        class="point gaussian"
        :cx="xScale(z)"
        :cy="yScale(yScale(-Photon.gaussian(z)))"
        :r="3"
        :style="{fill: 'hsla(170, 20%, 30%, 0.3)'}"
      />
    </g>
  </svg>
</template>

<script lang="ts">
import { select } from 'd3-selection';
import { scaleLinear, scaleSequential } from 'd3-scale';
import { interpolateViridis, interpolateInferno } from 'd3-scale-chromatic';
import { range } from 'd3-array';
  import Photon from '../src/Photon';
const d3 = {
  scaleLinear,
  scaleSequential,
  select,
  range,
  interpolateInferno,
  interpolateViridis
};

export default {
  name: 'Photon',
  props: {
    width: { type: Number, default: 300 },
    height: { type: Number, default: 100 },
    margin: { type: Number, default: 20 },
    gaussianPoints: { type: Array, default: () => [] },
    electricPoints: { type: Array, default: () => [] },
    magneticPoints: { type: Array, default: () => [] }
  },
  data: function() {
    return {
      zs: d3.range(-1, 1, 0.01),
      xScale: d3
        .scaleLinear()
        .domain([-1, 1])
        .range([0, this.width]),
      yScale: d3
        .scaleLinear()
        .domain([-1, 1])
        .range([0, this.height]),
      scaleE: d3
        .scaleLinear()
        .domain([-1, 1])
        .range([3, 5]),
      scaleM: d3
        .scaleLinear()
        .domain([-1, 1])
        .range([1, 3]),
      eColor: d3.scaleSequential(d3.interpolateInferno).domain([-1, 1]),
      mColor: d3.scaleSequential(d3.interpolateViridis).domain([-1, 1]),
      photon: Photon.circularCCW()
    };
  },

  computed: {

  },

  mounted() {
    // const svg = d3.select(this.$el)
    d3.select('.photon')
      .attr('width', this.width + this.margin * 2)
      .attr('height', this.height + this.margin * 2);
  },

  methods: {}
};
</script>

<style lang="scss">
#wavepacket {
  background-color: black;
  .text {
    fill: lightgrey;
    stroke: lightgrey;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 20px;
    text-anchor: middle;
  }
  .point {
    stroke-width: 3px;
    .electric {
      stroke-width: 3px;
    }
    .magnetic {
      stroke-width: 1px;
    }
    .gaussian {
      stroke-width: 1px;
    }
  }
}
</style>
