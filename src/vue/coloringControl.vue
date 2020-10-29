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
  <div v-show="canvasManager.canvas2d.coloringMode === 'Gradation'">
    <b-field>
      Initial Hue
      <b-input  v-model.number="canvasManager.canvas2d.initialHue"
                @input="changeLimitSetColor"
                placeholder="Number"
                type="number"
                step="0.01"></b-input>
    </b-field>
    <b-field>
      Hue Step
      <b-input  v-model.number="canvasManager.canvas2d.hueStep"
                @input="changeLimitSetColor"
                placeholder="Number"
                type="number"
                step="0.00001"></b-input>
    </b-field>
  </div>
  <div v-show="canvasManager.canvas2d.coloringMode === 'FirstGenerator'">
    Color1
    <chrome-picker v-model="generatorColors0"
                   @input="changeGeneratorColor"></chrome-picker>
    Color2
    <chrome-picker v-model="generatorColors1"
                   @input="changeGeneratorColor"></chrome-picker>
    Color3
    <chrome-picker v-model="generatorColors2"
                   @input="changeGeneratorColor"></chrome-picker>
    Color4
    <chrome-picker v-model="generatorColors3"
                   @input="changeGeneratorColor"></chrome-picker>
  </div>
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
            },
            generatorColors0: {
                rgba: { r: 255, g: 0, b: 0, a: 1 }
            },
            generatorColors1: {
                rgba: { r: 0, g: 255, b: 0, a: 1 }
            },
            generatorColors2: {
                rgba: { r: 0, g: 0, b: 255, a: 1 }
            },
            generatorColors3: {
                rgba: { r: 255, g: 255, b: 0, a: 1 }
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
        },
        changeGeneratorColor: function(event) {
            this.canvasManager.canvas2d.generatorColors = [this.generatorColors0,
                                                           this.generatorColors1,
                                                           this.generatorColors2,
                                                           this.generatorColors3];
            this.canvasManager.canvas2d.changeLimitSetColor();
            this.canvasManager.canvas2d.render();
        }
    }
}
</script>

<style>

</style>
