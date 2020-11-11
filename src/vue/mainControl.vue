<template>
<div>
  Recipe
  <b-field>
    <b-dropdown
      :scrollable="isScrollable"
      :max-height="maxHeight"
      v-model="currentMenu"
      aria-role="list"
      >
      <button class="button is-primary" type="button" slot="trigger">
        <template>
          <span>{{currentMenu.text}}</span>
        </template>
        <b-icon icon="menu-down"></b-icon>
      </button>
      
      <b-dropdown-item 
        v-for="(menu, index) in menus"
        :key="index"
        :value="menu" aria-role="listitem">
        <div class="media">
          <div class="media-content">
            <h3>{{menu.text}}</h3>
          </div>
        </div>
      </b-dropdown-item>
    </b-dropdown>
  </b-field>
  <b-field>
    <span class="parameterLabel">t_a</span>
    <b-input v-model.number="canvasManager.canvas2d.t_a.re"
             @input="valueChanged"
             placeholder="Number"
             type="number"
             step="0.01">
    </b-input>
    <b-input v-model.number="canvasManager.canvas2d.t_a.im"
             @input="valueChanged"
             placeholder="Number"
             type="number"
             step="0.01">
    </b-input>
  </b-field>
  <b-field>
    <span class="parameterLabel">t_b</span>
    <b-input v-model.number="canvasManager.canvas2d.t_b.re"
             @input="valueChanged"
             placeholder="Number"
             type="number"
             step="0.01">
    </b-input>
    <b-input v-model.number="canvasManager.canvas2d.t_b.im"
             @input="valueChanged"
             placeholder="Number"
             type="number"
             step="0.01">
    </b-input>
  </b-field>
  <b-field>
    <b-checkbox v-model="canvasManager.canvas2d.isT_abPlus"
                @input="valueChanged">
      isT_abPlus
    </b-checkbox>
  </b-field>
  <b-field >
    Rotation
    <b-slider v-model="canvasManager.canvas2d.rotation"
              @input="modelMatChanged"
      :value="0" :max="180" :min="-180"></b-slider>
  </b-field>
  <b-field>
    MaxLevel
    <b-input v-model.number="canvasManager.canvas2d.maxLevel"
             @input="valueChanged"
             type="number"
             min="0" step="1">
    </b-input>
  </b-field>
  <b-field>
    Threshold
    <b-input v-model.number="canvasManager.canvas2d.threshold"
             @input="valueChanged"
             type="number"
             min="0" step="0.001">
    </b-input>
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
            },
            currentMenu: { text: 'GrandmaRecipe' },
            menus: [
                { text: 'GrandmaRecipe'},
            ]
        }
    },
    methods: {
        valueChanged: function(event) {
            this.canvasManager.canvas2d.computeGrandmaLimitSet();
            this.canvasManager.canvas2d.render();
        },
        changeBackgroundColor: function(event) {
            this.canvasManager.canvas2d.backgroundColor = this.colors;
            this.canvasManager.canvas2d.render();
        },
        changeLimitSetColor: function(event) {
            this.canvasManager.canvas2d.limitSetColor = this.limitSetColors;
            this.canvasManager.canvas2d.changeLimitSetColor();
            this.canvasManager.canvas2d.render();
        },
        modelMatChanged: function(event) {
            this.canvasManager.canvas2d.render();
        }
    }
}
</script>

<style>
.parameterLabel {
    padding-top: 5px;
}
</style>
