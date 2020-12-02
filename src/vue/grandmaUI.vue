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
                       @click="changeToApollonius">Apollonius</b-dropdown-item>
      <b-dropdown-item aria-role="listitem"
                       @click="changeToApollonianFlower">Apollonian Flower</b-dropdown-item>
      <b-dropdown-item aria-role="listitem"
                       @click="changeToApollonianFlower2">Apollonian Flower2</b-dropdown-item>
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
</div>
</template>

<script>
export default {
    components: {
    },
    props: ['canvasManager','autoRecalc'],
    data: function () {
        return {
            currentParameter: { text: 'default'},
            params: [
                {text: 'default'},
                {text: 'apollonius'},
                {text: 'apollinian flower'}
            ]
        }
    },
    methods: {
        valueChanged: function(event) {
            if(this.autoRecalc === false) return;
            this.canvasManager.canvas2d.preparePoints();
            this.canvasManager.canvas2d.render();
        },
        renderPreset:function(event) {
            this.canvasManager.canvas2d.preparePoints();
            this.canvasManager.canvas2d.render();
        },
        changeToDefault: function(event){
            this.canvasManager.canvas2d.t_a.re = 1.91;
            this.canvasManager.canvas2d.t_a.im = 0.05;
            this.canvasManager.canvas2d.t_b.re = 1.91;
            this.canvasManager.canvas2d.t_b.im = 0.05;
            this.canvasManager.canvas2d.isT_abPlus = true;
            this.renderPreset();
        },
        changeToApollonius: function(event) {
            this.canvasManager.canvas2d.t_a.re = -2;
            this.canvasManager.canvas2d.t_a.im = 0;
            this.canvasManager.canvas2d.t_b.re = -2;
            this.canvasManager.canvas2d.t_b.im = 0;
            this.canvasManager.canvas2d.isT_abPlus = true;
            this.renderPreset();
        },
        changeToApollonianFlower: function(event) {
            this.canvasManager.canvas2d.t_a.re = 1.889;
            this.canvasManager.canvas2d.t_a.im = 0.05;
            this.canvasManager.canvas2d.t_b.re = 2;
            this.canvasManager.canvas2d.t_b.im = 0;
            this.canvasManager.canvas2d.isT_abPlus = false;
            this.canvasManager.canvas2d.maxLevel = 50;
            this.renderPreset();
        },
        changeToApollonianFlower2: function(event) {
            this.canvasManager.canvas2d.t_a.re = 1.90378;
            this.canvasManager.canvas2d.t_a.im = -0.03958;
            this.canvasManager.canvas2d.t_b.re = 2;
            this.canvasManager.canvas2d.t_b.im = 0;
            this.canvasManager.canvas2d.isT_abPlus = false;
            this.canvasManager.canvas2d.maxLevel = 50;
            this.renderPreset();
        }
    }
}
</script>

<style>
</style>
