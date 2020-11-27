<template>
<div>
<b-field>
</b-field>
</div>
</template>

<script>
export default {
    props: ['canvasManager'],
    data: function () {
        return {
            currentMenu: { text: 'GrandmaRecipe' },
            menus: [
                { text: 'GrandmaRecipe'},
            ]
        }
    },
}
</script>

<style>
</style>
