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
    </b-dropdown>
  </b-field>
  <b-field>
    <span class="parameterLabel">t_a</span>
    <b-input v-model.number="canvasManager.canvas2d.jt_a.re"
               @input="valueChanged"
               placeholder="Number"
               type="number"
               step="0.01">
      </b-input>
      <b-input v-model.number="canvasManager.canvas2d.jt_a.im"
               @input="valueChanged"
               placeholder="Number"
               type="number"
               step="0.01">
      </b-input>
    </b-field>
    <b-field>
      <span class="parameterLabel">t_b</span>
      <b-input v-model.number="canvasManager.canvas2d.jt_b.re"
               @input="valueChanged"
               placeholder="Number"
               type="number"
               step="0.01">
      </b-input>
      <b-input v-model.number="canvasManager.canvas2d.jt_b.im"
               @input="valueChanged"
               placeholder="Number"
               type="number"
               step="0.01">
      </b-input>
    </b-field>
    <b-field>
      <b-checkbox v-model="canvasManager.canvas2d.jisT_abPlus"
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
            currentParameter: { text: 'default'},
            params: [
                {text: 'default'},
            ]
        }
    },
    methods: {
        valueChanged: function(event) {
            this.canvasManager.canvas2d.preparePoints();
            this.canvasManager.canvas2d.render();
        },
        changeToDefault: function(event){
            this.canvasManager.canvas2d.jt_a.re = 1.87;
            this.canvasManager.canvas2d.jt_a.im = 0.1;
            this.canvasManager.canvas2d.jt_b.re = 1.87;
            this.canvasManager.canvas2d.jt_b.im = -0.1;
            this.canvasManager.canvas2d.jisT_abPlus = false;
            this.valueChanged();
        }
    }
}
</script>
