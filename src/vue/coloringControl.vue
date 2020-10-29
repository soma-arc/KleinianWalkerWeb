<template>
<div>
  <b-field>
    Background Color
    <chrome-picker v-model="colors"
                   @input="changeBackgroundColor"></chrome-picker>
  </b-field>
  Limit Set Coloring Mode
  <b-field>
    <b-radio v-model="canvasManager.canvas2d.coloringMode"
             name="name"
             native-value="Monotone" @input="changeLimitSetColor">
      Monotone
    </b-radio>
    <b-radio v-model="canvasManager.canvas2d.coloringMode"
             name="name"
             native-value="Gradation"
             @input="changeLimitSetColor">
      Gradation
    </b-radio>
  </b-field>
  <b-radio v-model="canvasManager.canvas2d.coloringMode"
           name="name"
           native-value="FirstGenerator"
           @input="changeLimitSetColor">
    First Generator
  </b-radio>
  <b-field v-show="canvasManager.canvas2d.coloringMode === 'Monotone'">
    Limit Set Color
    <chrome-picker v-model="limitSetColors"
                   @input="changeLimitSetColor"></chrome-picker>
  </b-field>
  <b-field v-show="canvasManager.canvas2d.coloringMode === 'Gradation'">
    Gradation
  </b-field>
  <b-field v-show="canvasManager.canvas2d.coloringMode === 'FirstGenerator'">
    First Generator
  </b-field>
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
            colors: {
                rgba: { r: 0, g: 0, b: 0, a: 1 },
            },
            limitSetColors: {
                rgba: { r: 255, g: 0, b: 0, a: 1 },
            }
        }
    },
    methods: {
        changeBackgroundColor: function(event) {
            this.canvasManager.canvas2d.backgroundColor = this.colors;
            this.canvasManager.canvas2d.render();
        },
        changeLimitSetColor: function(event) {
            this.canvasManager.canvas2d.limitSetColor = this.limitSetColors;
            this.canvasManager.canvas2d.changeLimitSetColor();
            this.canvasManager.canvas2d.render();
        }
    }
}
</script>

<style>

</style>
