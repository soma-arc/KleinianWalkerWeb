<template>
<div>
  Recipe
  <b-field>
    <b-dropdown
      @change="recipeChanged"
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
  <div v-show="recipeName === 'GrandmaRecipe'">
    <grandma-ui :canvasManager="canvasManager"/>
  </div>
  <div v-show="recipeName === 'SakugawaRecipe'">
    <sakugawa-ui :canvasManager="canvasManager"/>
  </div>
  <div v-show="recipeName === 'JorgensenRecipe'">
    <jorgensen-ui :canvasManager="canvasManager"/>
  </div>
  <div v-show="recipeName === 'RileyRecipe'">
    <riley-ui :canvasManager="canvasManager"/>
  </div>
  <div v-show="recipeName === 'OncePuncturedTorus'">
    <opt-ui :canvasManager="canvasManager"/>
  </div>
  <b-field>
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
import GrandmaUI from './grandmaUI.vue';
import SakugawaUI from './sakugawaUI.vue';
import JorgensenUI from './jorgensenUI.vue';
import RileyUI from './rileyUI.vue';
import OPTUI from './optUI.vue';

export default {
    components: {
        'chrome-picker': Chrome,
        'grandma-ui': GrandmaUI,
        'sakugawa-ui': SakugawaUI,
        'jorgensen-ui': JorgensenUI,
        'riley-ui': RileyUI,
        'opt-ui': OPTUI
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
                { text: 'SakugawaRecipe'},
                { text: 'JorgensenRecipe'},
                { text: 'RileyRecipe'},
                { text: 'OncePuncturedTorus'}
            ],
            recipeName: "GrandmaRecipe"
        }
    },
    methods: {
        valueChanged: function(event) {
            this.canvasManager.canvas2d.preparePoints();
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
        },
        recipeChanged: function(event) {
            this.recipeName = event.text;
            this.canvasManager.canvas2d.recipeName = event.text;
            //this.canvasManager.changeRecipe(event.text);
            this.canvasManager.canvas2d.preparePoints();
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
