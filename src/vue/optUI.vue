<template>
<div>
  <b-field>
    <b-dropdown aria-role="list">
      <button class="button is-info" slot="trigger">
        <span>Load Preset</span>
        <b-icon :icon="active ? 'menu-up' : 'menu-down'"></b-icon>
      </button>
      <b-dropdown-item aria-role="listitem"
                       @click="changeToParam2">Default</b-dropdown-item>
      <b-dropdown-item aria-role="listitem"
                       @click="changeToParam1">Line</b-dropdown-item>
    </b-dropdown>
  </b-field>
  <b-field>
    <span class="parameterLabel">a1</span>
    <b-input v-model.number="canvasManager.canvas2d.a1.re"
             @input="valueChanged"
             placeholder="Number"
             type="number"
             step="0.01">
    </b-input>
    <b-input v-model.number="canvasManager.canvas2d.a1.im"
             @input="valueChanged"
             placeholder="Number"
             type="number"
             step="0.01">
    </b-input>
  </b-field>
  <b-field>
    <span class="parameterLabel">a2</span>
    <b-input v-model.number="canvasManager.canvas2d.a2.re"
             @input="valueChanged"
             placeholder="Number"
             type="number"
             step="0.01">
    </b-input>
    <b-input v-model.number="canvasManager.canvas2d.a2.im"
             @input="valueChanged"
             placeholder="Number"
             type="number"
             step="0.01">
    </b-input>
  </b-field>
  <b-field>
    <b-checkbox v-model="canvasManager.canvas2d.showControlPoints"
                @input="render">
      Show Control Points
    </b-checkbox>
  </b-field>
</div>
</template>

<script>
import Complex from '../2d/complex.js';

export default {
    components: {
    },
    props: ['canvasManager', 'autoRecalc'],
    data: function () {
        return {
        }
    },
    methods: {
        render: function(event) {
            this.canvasManager.canvas2d.render();
        },
        valueChanged: function(event) {
            if (this.autoRecalc === false) return;
            this.canvasManager.canvas2d.preparePoints();
            this.canvasManager.canvas2d.render();
        },
        renderPreset:function(event) {
            this.canvasManager.canvas2d.preparePoints();
            this.canvasManager.canvas2d.render();
        },
        changeToParam1: function(event) {
            this.canvasManager.canvas2d.a1.re = 0.25;
            this.canvasManager.canvas2d.a1.im = 0;
            this.canvasManager.canvas2d.a2.re = 0.25;
            this.canvasManager.canvas2d.a2.im = 0.;
            this.canvasManager.canvas2d.origin = new Complex(0, 0);

            this.renderPreset();
        },
        changeToParam2: function(event) {
            this.canvasManager.canvas2d.a1.re = 0.49;
            this.canvasManager.canvas2d.a1.im = 0.15;
            this.canvasManager.canvas2d.a2.re = 0.25;
            this.canvasManager.canvas2d.a2.im = 0.41;
            this.canvasManager.canvas2d.origin = new Complex(0, 0);
            this.level = 40;

            this.renderPreset();
        }
    }
}
</script>
