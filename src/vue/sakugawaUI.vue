<template>
<div>
  <b-field>
    <b-dropdown aria-role="list">
      <button class="button is-info" slot="trigger">
        <span>Load Preset</span>
        <b-icon :icon="active ? 'menu-up' : 'menu-down'"></b-icon>
      </button>
      <b-dropdown-item aria-role="listitem"
                       @click="changeToParam1">Default</b-dropdown-item>
    </b-dropdown>
  </b-field>
  <span class="parameterLabel">z0 (Quaternion)</span>
  <b-field>
    <b-input v-model.number="canvasManager.canvas2d.z0.re"
             @input="valueChanged"
             placeholder="Number"
             type="number"
             step="0.01">
    </b-input>
    <b-input v-model.number="canvasManager.canvas2d.z0.i"
             @input="valueChanged"
             placeholder="Number"
             type="number"
             step="0.01">
    </b-input>
  </b-field>
  <b-field>
    <b-input v-model.number="canvasManager.canvas2d.z0.j"
             @input="valueChanged"
             placeholder="Number"
             type="number"
             step="0.01">
    </b-input>
    <b-input v-model.number="canvasManager.canvas2d.z0.k"
             @input="valueChanged"
             placeholder="Number"
             type="number"
             step="0.01">
    </b-input>
  </b-field>
  <b-field>
    <span class="parameterLabel">thetaA</span>
    <b-input v-model.number="canvasManager.canvas2d.thetaA"
             @input="valueChanged"
             placeholder="Number"
             type="number"
             step="0.01">
    </b-input>
  </b-field>
  <b-field>
    <span class="parameterLabel">thetaB</span>
    <b-input v-model.number="canvasManager.canvas2d.thetaB"
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
    props: ['canvasManager'],
    data: function () {
        return {
        }
    },
    methods: {
        valueChanged: function(event) {
            this.canvasManager.canvas2d.preparePoints();
            this.canvasManager.canvas2d.render();
        },
        changeToParam1: function(event) {
            this.canvasManager.canvas2d.z0.re = -1;
            this.canvasManager.canvas2d.z0.i = 0;
            this.canvasManager.canvas2d.z0.j = 0;
            this.canvasManager.canvas2d.z0.k = 0;
            this.canvasManager.canvas2d.thataA = 0;
            this.canvasManager.canvas2d.thataB = Math.PI * 0.5;
            
            this.valueChanged();
        }
    }
}
</script>

<style>
</style>
