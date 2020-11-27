<template>
<div class="controlPanel">
  <b-tabs v-model="activeTab">
    <b-tab-item label="Main">
      <main-control :canvasManager="canvasManager"/>
    </b-tab-item>
    <b-tab-item label="Coloring">
      <coloring-control :canvasManager="canvasManager"/>
    </b-tab-item>
    <!-- <b-tab-item label="Others"> -->
    <!--   <others-control :canvasManager="canvasManager"/> -->
    <!-- </b-tab-item> -->
  </b-tabs>  
</div>
</template>

<script>
import MainControl from './mainControl.vue';
import ColoringControl from './coloringControl.vue';
import OthersControl from './othersControl.vue';
export default {
    components: {
        MainControl, ColoringControl, OthersControl
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
