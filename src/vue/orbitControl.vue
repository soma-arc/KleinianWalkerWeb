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

export default {
    components: {
        'chrome-picker': Chrome,
    },
    props: ['canvasManager'],
    data: function () {
        return {
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
    }
}
</script>

<style>
</style>
