<template>
<div>
  <b-field>
    t_a 
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
    t_b 
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
            this.canvasManager.canvas2d.computeGrandmaLimitSet();
            this.canvasManager.canvas2d.render();
        }
    }
}
</script>

<style>

</style>
