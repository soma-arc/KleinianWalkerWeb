<template>
<div>
<b-field>
    <b-checkbox v-model="canvasManager.canvas2d.showOrbit"
                @input="computeOrbits">
      Show orbit
    </b-checkbox>
  </b-field>
    <b-field>
    <b-checkbox v-model="canvasManager.canvas2d.showFrame"
                @input="render">
      Show frame
    </b-checkbox>
    </b-field>
    <div class="block">
      <b-radio v-model="orbitType"
               name="name"
               native-value="sakura"
               @input="changeOrbit">
        Sakura
      </b-radio>
      <b-radio v-model="orbitType"
               name="name"
               native-value="butterfly"
               @input="changeOrbit">
        Butterfly
      </b-radio>
      <b-radio v-model="orbitType"
               name="name"
               native-value="maple"
               @input="changeOrbit">
        Maple
      </b-radio>
      <b-radio v-model="orbitType"
               name="name"
               native-value="snowflake"
               @input="changeOrbit">
        Snowflake
      </b-radio>
    </div>
    <b-field>
    Orbit Scale
    <b-input v-model.number="canvasManager.canvas2d.orbitScale"
             @input="computeOrbits"
             type="number"
             min="0" step="0.001">
    </b-input>
  </b-field>
  <b-field>
    Step Level
    <b-input v-model.number="canvasManager.canvas2d.pointSeriesMaxLevel"
             @input="computeOrbits"
             type="number"
             min="0" step="1">
    </b-input>
  </b-field>
  Orbit Color
  <chrome-picker v-model="canvasManager.canvas2d.orbitColor"
                 @input="render"></chrome-picker>
</div>
</template>

<script>
import {Chrome} from 'vue-color'
const MAPLE_POINTS = require('../maple.csv');
const SAKURA_POINTS = require('../sakura.csv');
const SNOW_POINTS = require('../snowflake.csv');
const BUTTERFLY_POINTS = require('../butterfly.csv');

export default {
    components: {
        'chrome-picker': Chrome,
    },
    props: ['canvasManager'],
    data: function () {
        return {
            orbitType: "sakura"
        }
    },
    methods: {
        render: function(event) {
            this.canvasManager.canvas2d.render();
        },
        computeOrbits: function(evemt) {
            this.canvasManager.canvas2d.computeOrbits();
            this.canvasManager.canvas2d.render();
        },
        changeOrbit: function(event) {
            if(this.orbitType === "sakura") {
                this.canvasManager.canvas2d.orbitPoints = SAKURA_POINTS;
            } else if(this.orbitType === "butterfly") {
                this.canvasManager.canvas2d.orbitPoints = BUTTERFLY_POINTS;
            } else if(this.orbitType === "maple") {
                this.canvasManager.canvas2d.orbitPoints = MAPLE_POINTS;
            } else if(this.orbitType === "snowflake") {
                this.canvasManager.canvas2d.orbitPoints = SNOW_POINTS;
            }

            this.canvasManager.canvas2d.computeOrbits();
            this.canvasManager.canvas2d.render();
        }
    }
}
</script>

<style>
</style>
