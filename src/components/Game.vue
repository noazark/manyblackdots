<template>
  <div class="game">
    <div>
      <span class="level-select">{{ currentLevel.config.name }}</span>
    </div>
    <canvas ref="canvas"></canvas>
    <pre
      v-if="dat.state && dat.state.isWinner && currentLevel.config.nextLevel && levels[currentLevel.config.nextLevel]"
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
import { loadLevels, initializeLevel } from "@/lib/engine";
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
} from "vue";

const worker = new Worker(new URL("../game.worker.js", import.meta.url), {
  type: "module",
});
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
      const next = currentLevel.value.config.nextLevel;
      if (next && levels[next]) {
        engine.stop();
        level.value = next;
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

    // Load custom levels from URL hash: #play=<base64 JSON>
    let startLevel = "level1";
    const hash = window.location.hash.slice(1);
    if (hash.startsWith("play=")) {
      try {
        const raw = decodeURIComponent(hash.slice(5));
        const json = decodeURIComponent(escape(atob(raw)));
        const customLevels = JSON.parse(json);
        let firstKey = null;
        for (const cl of customLevels) {
          const key = cl.config.key || cl.config.name || "custom";
          levels[key] = initializeLevel(cl);
          if (!firstKey) firstKey = key;
        }
        if (firstKey) startLevel = firstKey;
      } catch (e) {
        console.error("Failed to load custom levels:", e);
      }
    }

    const isCustom = hash.startsWith("play=");
    const level = ref(startLevel);
    let dat = ref({ config: {}, state: {}, map: [] });

    const canvas = ref();
    const canvasBuffer = ref();

    const currentLevel = computed(() => {
      return levels[level.value];
    });

    onMounted(() => {
      canvasBuffer.value = canvas.value.cloneNode();

      engine.events.addEventListener("tick", (dt) =>
        requestFrame({ ...state, dt }),
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
      isCustom,
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
