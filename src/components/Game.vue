<template>
  <div class="game">
    <select v-model="level">
      <option :value="v" v-for="k,v in levels">{{v}}</option>
    </select>
    <a href="" @click.prevent="reset">reset</a>
    <canvas ref="canvas"></canvas>
    <p>
      press any button to begin
      <br>
      press any button to jump
    </p>
  </div>
</template>

<script>
import { isJumping, draw, move } from '@/lib/engine';
import { Loop } from '@/lib/loop';
import * as mainLevels from '@/maps/main';
import * as testLevels from '@/maps/tests';

const BASE_CONFIG = {
  cameraX: (d) => {
    return d.map.find((el) => el.type === 'hero').x - 30;
  },
  showCollisions: false,
  showVectors: false,
  showGhosts: false,
};


const levels = {};
Object.assign(levels, mainLevels, testLevels);

function initalizeGame(level) {
  const { config, map } = levels[level]();

  return {
    canvas: {
      h: 300,
      w: 300
    },
    state: {
      offset: 0,
      isAlive: true,
      up: false,
      down: false,
      left: false,
      right: false,
    },
    config: Object.assign({}, BASE_CONFIG, config),
    map,
  };
}
let data = {};

function prepareCanvas(data, canvas) {
  const ctx = canvas.getContext('2d');

  canvas.width = data.canvas.w * 2;
  canvas.height = data.canvas.h * 2;
  canvas.style.width = `${data.canvas.w}px`;
  canvas.style.height = `${data.canvas.h}px`;
  ctx.scale(2, 2);

  return ctx
}

function flush(canvas, ctx, buffer) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(buffer, 0, 0, canvas.width/2, canvas.height/2);
}

export default {
  data () {
    return {
      levels,
      level: 'level1'
    }
  },

  watch: {
    level: {
      handler() {
        this.reset()
      },
      immediate: true
    }
  },

  mounted() {
    const canvasBuffer = document.createElement('canvas');
    const ctxBuffer = prepareCanvas(data, canvasBuffer)

    const canvas = this.$refs.canvas;
    const ctx = prepareCanvas(data, canvas);

    const engine = new Loop((dt) => {
      move(data, { dt });
      draw(canvasBuffer, ctxBuffer, data);
      flush(canvas, ctx, canvasBuffer)

      if (!data.state.isAlive) {
        engine.stop();
      }
    });

    function handlePress() {
      if (!isJumping(data)) {
        data.state.up = true;
      }

      if (!data.state.isAlive) {
        data = initalizeGame(this.level);

        move(data, { dt: 0 });
        draw(canvasBuffer, ctxBuffer, data);
        flush(canvas, ctx, canvasBuffer)
      } else if (!engine.running) {
        engine.start();
      }
    }

    function handleRelease() {
      data.state.up = false;
    }

    document.addEventListener('touchstart', handlePress.bind(this));
    document.addEventListener('keydown', handlePress.bind(this));
    document.addEventListener('touchend', handleRelease.bind(this));
    document.addEventListener('keyup', handleRelease.bind(this));

    engine.tick();
    engine.stop();
  },

  methods: {
    reset() {
      data = initalizeGame(this.level)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
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
</style>
