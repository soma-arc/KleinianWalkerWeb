<template>
<div>
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
    }
}
</script>

<style>
</style>
