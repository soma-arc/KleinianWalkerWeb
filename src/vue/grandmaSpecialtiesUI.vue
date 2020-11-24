<template>
<div>
  <b-field>
    <b-dropdown aria-role="list">
      <button class="button is-info" slot="trigger">
        <span>Load Preset</span>
        <b-icon :icon="active ? 'menu-up' : 'menu-down'"></b-icon>
      </button>
    </b-dropdown>
  </b-field>
  <b-field>
    <span class="parameterLabel">a</span>
    <b-input v-model.number="canvasManager.canvas2d.specialties_a.re"
             @input="valueChanged"
             placeholder="Number"
             type="number"
             step="0.01">
    </b-input>
    <b-input v-model.number="canvasManager.canvas2d.specialties_a.im"
             @input="valueChanged"
             placeholder="Number"
             type="number"
             step="0.01">
    </b-input>
  </b-field>
    <b-field>
    <span class="parameterLabel">b</span>
    <b-input v-model.number="canvasManager.canvas2d.specialties_b.re"
             @input="valueChanged"
             placeholder="Number"
             type="number"
             step="0.01">
    </b-input>
    <b-input v-model.number="canvasManager.canvas2d.specialties_b.im"
             @input="valueChanged"
             placeholder="Number"
             type="number"
             step="0.01">
    </b-input>
    </b-field>
      <b-field>
    <span class="parameterLabel">ab</span>
    <b-input v-model.number="canvasManager.canvas2d.specialties_ab.re"
             @input="valueChanged"
             placeholder="Number"
             type="number"
             step="0.01">
    </b-input>
    <b-input v-model.number="canvasManager.canvas2d.specialties_ab.im"
             @input="valueChanged"
             placeholder="Number"
             type="number"
             step="0.01">
    </b-input>
      </b-field>
      <b-field>
        <b-checkbox v-model="canvasManager.canvas2d.specialties_R_plus"
                  @input="valueChanged">
          isRPlus
        </b-checkbox>
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
            this.canvasManager.canvas2d.specialties_a.re = 0;
            this.canvasManager.canvas2d.specialties_a.im = 0;
            this.canvasManager.canvas2d.specialties_b.re = 0;
            this.canvasManager.canvas2d.specialties_b.im = 0;
            this.canvasManager.canvas2d.specialties_ab.re = 0;
            this.canvasManager.canvas2d.specialties_ab.im = 0;
            this.canvasManager.canvas2d.specialties_R_plus = true;
            this.valueChanged();
        },
    }
  }
</script>

<style>
</style>
