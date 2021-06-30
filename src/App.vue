<template>
  <div id="app">
    <game></game>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import Game from "./components/Game.vue";

export default defineComponent({
  components: {
    Game
  },

  name: 'app'
})
</script>

<style>
#app {
  width: 300px;
  margin: auto;
  margin-top: 40px;
  font-family: monospace;
}

* {
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
}
</style>
