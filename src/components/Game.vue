<template>
  <div class="game">
    <div>
      <select class="level-select" v-model="level">
        <option :value="k" v-for="(v, k) in levels" :key="k">
          {{ v.config.name || k }}
        </option>
      </select>
    </div>
    <canvas ref="canvas"></canvas>
    <pre
      v-if="dat.state && dat.state.isWinner && currentLevel.config.nextLevel"
    ><a href="" @click.prevent="nextLevel">next level</a></pre>
    <pre v-else>{{ currentLevel.config.description }}</pre>

    <template v-if="debug">
      <label>
        <input type="checkbox" v-model="state.showVectors" />
        show vectors
      </label>
      <br />
      <label>
        <input type="checkbox" v-model="state.showGhosts" />
        show ghosts
      </label>
      <br />
      <label>
        <input type="checkbox" v-model="state.showCollisions" />
        show collisions
      </label>
    </template>
  </div>
</template>

<script>
// eslint-disable-next-line
import { loadLevels } from "@/lib/engine";
import { draw, prepareCanvas, flush } from "@/lib/screen";
import { Loop } from "@/lib/loop";
import * as mainLevels from "@/maps/main";
import * as testLevels from "@/maps/tests";
import {
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watch,
} from "@vue/runtime-core";

const worker = new Worker("../game.worker.js", { type: "module" });
const engine = new Loop();

function mapWorker(worker, events) {
  const ret = {};

  events.forEach((event) => {
    ret[event] = function (...args) {
      worker.postMessage({ event, args: args });
    };
  });

  return ret;
}

export default defineComponent({
  setup() {
    const { loadGame, requestFrame } = {
      ...mapWorker(worker, ["loadGame", "requestFrame"]),
    };

    function _draw(response) {
      draw(canvasBuffer.value, response);
      flush(canvasBuffer.value, canvas.value);
    }

    async function reset() {
      loadGame(currentLevel.value);
    }

    function nextLevel() {
      if (currentLevel.value.config.nextLevel) {
        engine.stop();
        level.value = currentLevel.value.config.nextLevel;
        reset();
      }
    }

    function handleFrame(e) {
      const { event, response } = e.data;
      dat.value = response;

      if (event === "requestFrame") {
        _draw(response);
      }

      if (!response.state.isAlive) {
        engine.stop();
      }

      if (event === "loadGame") {
        prepareCanvas(canvasBuffer.value, response);
        prepareCanvas(canvas.value, response);

        _draw(response);
      }
    }

    const params = new URLSearchParams(window.location.search, true);

    const debug = params.has("debug");
    const state = reactive({
      up: false,
      showVectors: false,
      showGhosts: false,
      showCollisions: false,
    });
    const levels = loadLevels({
      ...mainLevels,
      ...testLevels,
    });
    const level = ref("level1");
    let dat = ref({ config: {}, state: {}, map: [] });

    const canvas = ref();
    const canvasBuffer = ref();

    const currentLevel = computed(() => {
      return levels[level.value];
    });

    onMounted(() => {
      canvasBuffer.value = canvas.value.cloneNode();

      engine.events.addEventListener("tick", (dt) =>
        requestFrame({ ...state, dt })
      );

      worker.addEventListener("message", (e) => handleFrame(e));

      const handlePress = () => {
        state.up = true;

        if (dat.value.state && !dat.value.state.isAlive) {
          reset();
        } else if (!engine.running) {
          engine.start();
        }
      };

      const handleRelease = (e) => {
        e.preventDefault();
        e.stopPropagation();
        state.up = false;
      };

      document.addEventListener("contextmenu", (e) => e.preventDefault());
      document.addEventListener("touchstart", handlePress);
      document.addEventListener("keydown", handlePress);
      document.addEventListener("touchend", handleRelease);
      document.addEventListener("keyup", handleRelease);
    });

    onUnmounted(() => {
      worker.terminate();
    });

    watch(level, () => reset(), { immediate: true });
    watch(state, () => {
      try {
        _draw(dat.value);
      } catch {
        // ignore
      }
    });

    return {
      debug,
      levels,
      level,
      currentLevel,
      state,
      dat,
      canvas,
      nextLevel,
    };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
*:focus {
  outline: none;
}

h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.level-select {
  appearance: none;
  background: none;
  border: none;
  font-size: 1rem;
  font-family: monospace;
  margin-bottom: 0.5rem;
}
</style>
