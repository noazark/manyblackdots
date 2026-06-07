<template>
  <div id="editor-app">
    <Editor />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import Editor from "./components/Editor.vue";

export default defineComponent({
  components: { Editor },
  name: "EditorApp",
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: #1a1a1a;
  color: #ccc;
  font-family: monospace;
  overflow: hidden;
}

#editor-app {
  width: 100vw;
  height: 100vh;
}
</style>
