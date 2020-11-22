<template>
<header>
  <ul class="headerLeft">
    <li class="headerContent"><span>Kleinian Walker</span></li>
  </ul>
  <ul class="headerRight">
    <li class="buttonLi">
      <button class="button" @click="save">Export</button>
    </li>
    <li class="buttonLi">
      <button class="button" @click="load">Import</button>
    </li>
    <li class="buttonLi">
      <button class="button" @click="saveImage">SaveImage</button>
    </li>
  </ul>
</header>
</template>

<script>
export default {
    props: ['canvasManager'],
    methods: {
        save: function() {
            const c = this.canvasManager.canvas2d;
            const data = {
                "recipeName": c.recipeName,
                "maxLevel": c.maxLevel,
                "threshold": c.threshold,
                "t_a": [c.t_a.re, c.t_a.im],
                "t_b": [c.t_b.re, c.t_b.im],
                "isT_abPlus": c.isT_abPlus,
                "jt_a": [c.jt_a.re, c.jt_a.im],
                "jt_b": [c.jt_b.re, c.jt_a.im],
                "jisT_abPlus": c.jisT_abPlus,
                "z0": [c.z0.re, c.z0.i, c.z0.j, c.z0.k],
                "thataA": c.thetaA,
                "thataB": c.thetaB,
                "c": c.c,
                "origin": c.origin,
                "a1": [c.a1.re, c.a1.im],
                "a2": [c.a2.re, c.a2.im],
                "showControlPoints": c.showControlPoints,
                "backgroundColor": c.backgroundColor,
                "limitSetColor": c.limitSetColor,
                "coloringMode": c.coloringMode,
                "initialHue": c.initialHue,
                "hueStep": c.hueStep,
                "generatorColors": c.generatorColors,
                "rotation": c.rotation
            }
            const blob = new Blob([JSON.stringify(data,
                                                  null, '    ')],
                                  { type: 'text/plain' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'scene.json';
            a.click();
        },
        load: function() {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                JSON.parse(reader.result);
            });
            const a = document.createElement('input');
            a.type = 'file';
            a.addEventListener('change', function(event) {
                const files = event.target.files;
                reader.readAsText(files[0]);
            });
            a.click();
        },
        saveImage: function() {
            this.canvasManager.canvas2d.save();
        }
    }
}
</script>

<style>
  header {
    border-style: ridge;
    border-color: gray;

    overflow:hidden;
    font-size: 2rem;

    height: 50px;
    background-color: Azure;
    display: flex;
    justify-content: space-between;
    align-items: center;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    cursor: default;
}

.headerLeft {
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;

    list-style: none;
    height: 100%;
}

.headerRight{
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;

    list-style: none;
    height: 100%;

    flex-direction: row-reverse;
}

.buttonLi {
    flex: 1;
    align-items: center;
    justify-content: center;
    padding-right: 10px;
    display: flex;
}

.headerContent {
    padding: 5px;
}
</style>
