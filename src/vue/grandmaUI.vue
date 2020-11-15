<template>
<div>
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
