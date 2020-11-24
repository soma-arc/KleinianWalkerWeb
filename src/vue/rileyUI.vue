<template>
<div>
  <b-field>
    <b-dropdown aria-role="list">
      <button class="button is-info" slot="trigger">
        <span>Load Preset</span>
        <b-icon :icon="active ? 'menu-up' : 'menu-down'"></b-icon>
      </button>
      <b-dropdown-item aria-role="listitem"
                       @click="changeToDefault">Default</b-dropdown-item>
      <b-dropdown-item aria-role="listitem"
                       @click="changeToLine">Line</b-dropdown-item>
      <b-dropdown-item aria-role="listitem"
                       @click="changeToFlow">Flow</b-dropdown-item>
    </b-dropdown>
  </b-field>
  <b-field>
    <span class="parameterLabel">c</span>
    <b-input v-model.number="canvasManager.canvas2d.c.re"
             @input="valueChanged"
             placeholder="Number"
             type="number"
             step="0.01">
    </b-input>
    <b-input v-model.number="canvasManager.canvas2d.c.im"
             @input="valueChanged"
             placeholder="Number"
             type="number"
             step="0.01">
    </b-input>
  </b-field>
</div>
</template>

<script>
  export default {
    components: {
    },
    props: ['canvasManager', 'autoRecalc'],
    data: function () {
        return {
            currentParameter: { text: 'default'},
            params: [
                {text: 'default'},
            ]
        }
    },
    methods: {
        valueChanged: function(event) {
            if(this.autoRecalc === false) return;
            this.canvasManager.canvas2d.preparePoints();
            this.canvasManager.canvas2d.render();
        },
        changeToDefault: function(event){
            this.canvasManager.canvas2d.c.re = 1.13;
            this.canvasManager.canvas2d.c.im = -0.43;
            this.valueChanged();
        },
        changeToLine: function(event) {
            this.canvasManager.canvas2d.c.re = 2;
            this.canvasManager.canvas2d.c.im = 0;
            this.valueChanged();
        },
        changeToFlow: function(event) {
            this.canvasManager.canvas2d.c.re = 1.3;
            this.canvasManager.canvas2d.c.im = 0.3;
            this.valueChanged();
        }
    }
  }
</script>

<style>
</style>
