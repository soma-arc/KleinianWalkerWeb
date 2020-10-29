<template>
<div>
Preset
<b-field>
  <b-dropdown
    :scrollable="isScrollable"
    :max-height="maxHeight"
    v-model="currentMenu"
    aria-role="list"
    >
    <button class="button is-primary" type="button" slot="trigger">
      <template>
        <span>{{currentMenu.text}}</span>
      </template>
      <b-icon icon="menu-down"></b-icon>
    </button>
    
    <b-dropdown-item 
      v-for="(menu, index) in menus"
      :key="index"
      :value="menu" aria-role="listitem">
      <div class="media">
        <div class="media-content">
          <h3>{{menu.text}}</h3>
        </div>
      </div>
    </b-dropdown-item>
  </b-dropdown>
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
