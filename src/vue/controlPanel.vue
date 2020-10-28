<template>
<div class="controlPanel">
  <b-tabs v-model="activeTab">
    <b-tab-item label="Main">
      <main-control :canvasManager="canvasManager"/>
    </b-tab-item>
    <b-tab-item label="Coloring">
      <coloring-control :canvasManager="canvasManager"/>
    </b-tab-item>
    <b-tab-item label="Others">
    </b-tab-item>
  </b-tabs>  
</b-tab-item>
</b-tabs>
</div>
</template>

<script>
import MainControl from './mainControl.vue';
import ColoringControl from './coloringControl.vue';
export default {
    components: {
        MainControl, ColoringControl
    },
    props: ['canvasManager'],
    data: function () {
        return {
        }
    },
}
</script>

<style>
  .controlPanel {
    border-style: ridge;
    border-color: gray;
    background-color: white;
    flex-basis: 300px;
    display: flex;
    flex-direction: column;
    height: 100%;
  overflow: auto;


  padding: 15px;
}
</style>
