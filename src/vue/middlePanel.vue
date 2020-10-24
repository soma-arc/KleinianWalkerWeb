<template>
  <div class="contentPanel">
    <div class="canvasPanel">
      <div class="canvasParent">
        <canvas id="canvas" tabIndex="1000"></canvas>
      </div>
    </div>
    <control-panel/>
  </div>
</template>

<script>
import ControlPanel from './controlPanel.vue';
export default {
  props: [],
  components: { ControlPanel },
}
</script>

<style>
.contentPanel {
    flex: 1;
    display: flex;
    flex-direction: row;
    overflow: hidden;
}

.canvasParent {
    flex: 1;
    display: flex;
}

#canvas {
    width: 100%;
    height: 100%;
    cursor: crosshair;
}

.canvasPanel {
    border-style: ridge;
    border-color: gray;
    background-color: gray;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
</style>
