<template>
<div>
  Recipe
  <b-field>
    <b-dropdown
      @change="recipeChanged"
      :scrollable="isScrollable"
      :max-height="maxHeight"
      v-model="canvasManager.canvas2d.recipeName"
      aria-role="list"
      >
      <button class="button is-primary" type="button" slot="trigger">
        <template>
          <span>{{ canvasManager.canvas2d.recipeName }}</span>
        </template>
        <b-icon icon="menu-down"></b-icon>
      </button>
      
      <b-dropdown-item
        v-for="(menu, index) in menus"
        :key="index"
        :value="menu" aria-role="listitem">
        <div class="media">
          <div class="media-content">
            <h3>{{menu}}</h3>
          </div>
        </div>
      </b-dropdown-item>
    </b-dropdown>
  </b-field>
  <div v-show="canvasManager.canvas2d.recipeName === 'GrandmaRecipe'">
    <grandma-ui :canvasManager="canvasManager" :autoRecalc="autoRecalc"/>
  </div>
  <div v-show="canvasManager.canvas2d.recipeName === 'JorgensenRecipe'">
    <jorgensen-ui :canvasManager="canvasManager" :autoRecalc="autoRecalc"/>
  </div>
  <div v-show="canvasManager.canvas2d.recipeName === 'RileyRecipe'">
    <riley-ui :canvasManager="canvasManager" :autoRecalc="autoRecalc"/>
  </div>
  <div v-show="canvasManager.canvas2d.recipeName === 'OncePuncturedTorus'">
    <opt-ui :canvasManager="canvasManager" :autoRecalc="autoRecalc"/>
  </div>
  <div v-show="canvasManager.canvas2d.recipeName === 'SakugawaRecipe'">
    <sakugawa-ui :canvasManager="canvasManager" :autoRecalc="autoRecalc"/>
  </div>
  <div v-show="canvasManager.canvas2d.recipeName === 'GrandmaSpecialtiesRecipe'">
    <sakugawa-ui :canvasManager="canvasManager" :autoRecalc="autoRecalc"/>
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
             min="1" step="1">
    </b-input>
  </b-field>
  <b-field>
    Threshold
    <b-input v-model.number="canvasManager.canvas2d.threshold"
             @input="changeThreshold"
             type="number"
             min="0" step="0.001">
    </b-input>
  </b-field>
  <b-field>
    <b-checkbox v-model="autoRecalc">
      Auto Recalculate
    </b-checkbox>
  </b-field>
  <b-field>
    <b-button type="is-primary" @click="calcAndRender">
      Calculate
    </b-button>
  </b-field>
  <b-field>
    <b-checkbox v-model="canvasManager.canvas2d.showOrbit"
                @input="computeOrbits">
      Show orbit
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
</div>
</template>

<script>
import {Chrome} from 'vue-color'
import GrandmaUI from './grandmaUI.vue';
import SakugawaUI from './sakugawaUI.vue';
import JorgensenUI from './jorgensenUI.vue';
import RileyUI from './rileyUI.vue';
import OPTUI from './optUI.vue';
import GrandmaSpecialtiesRecipe from './grandmaSpecialtiesUI.vue';

export default {
    components: {
        'chrome-picker': Chrome,
        'grandma-ui': GrandmaUI,
        'sakugawa-ui': SakugawaUI,
        'jorgensen-ui': JorgensenUI,
        'riley-ui': RileyUI,
        'opt-ui': OPTUI,
        'grandma-specialties-ui': GrandmaSpecialtiesRecipe
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
            currentMenu: this.canvasManager.canvas2d.recipeName,
            menus: [
                'GrandmaRecipe',
                 'JorgensenRecipe',
                 'RileyRecipe',
                 'OncePuncturedTorus',
                'SakugawaRecipe',
//                { text: 'GrandmaSpecialtiesRecipe'}
            ],
            recipeName: "GrandmaRecipe",
            autoRecalc: false
        }
    },
    methods: {
        valueChanged: function(event) {
            if(this.autoRecalc === false) return;
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
            this.recipeName = event;
            this.canvasManager.canvas2d.recipeName = event;
            this.canvasManager.canvas2d.preparePoints();
            this.canvasManager.canvas2d.render();
        },
        calcAndRender: function(event) {
            this.canvasManager.canvas2d.preparePoints();
            this.canvasManager.canvas2d.render();
        },
        render: function(event) {
            this.canvasManager.canvas2d.render();
        },
        computeOrbits: function(evemt) {
            this.canvasManager.canvas2d.computeOrbits();
            this.canvasManager.canvas2d.render();
        },
        changeThreshold: function(event) {
            if(this.canvasManager.canvas2d.showOrbit)
                this.canvasManager.canvas2d.computeOrbits();
            this.canvasManager.canvas2d.preparePoints()
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
