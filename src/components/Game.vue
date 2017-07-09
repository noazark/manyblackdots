<template>
  <div class="game">
    <select v-model="level">
      <option :value="v" v-for="k,v in levels">{{v}}</option>
    </select>
    <a href="" @click.prevent="reset">reset</a>
    <canvas ref="canvas"></canvas>
    <pre>{{dat.config.description}}</pre>
  </div>
</template>

<script>
import Worker from  'worker-loader!@/worker';
import { isJumping, draw, flush, prepareCanvas } from '@/lib/engine';
import { Loop } from '@/lib/loop';
import * as mainLevels from '@/maps/main';
import * as testLevels from '@/maps/tests';

const levels = Object.assign({}, mainLevels, testLevels);
const worker = new Worker()

function mapWorker(worker, events) {
  const ret = {}

  events.forEach((event) => {
    ret[event] = function (...args) {
      worker.postMessage({event, args: args})
    }
  })

  return ret
}

export default {
  data () {
    return {
      levels,
      level: 'level1',
      dat: {
        config: {}
      }
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

  destroyed() {
    worker.terminate();
  },

  mounted() {
    const canvasBuffer = document.createElement('canvas');
    let ctxBuffer

    const canvas = this.$refs.canvas;
    let ctx

    const engine = new Loop((dt) => {
      this.requestFrame({dt})
    });

    const draw_ = (response) => {
      this.dat = response
      draw(canvasBuffer, ctxBuffer, response);
      flush(canvas, ctx, canvasBuffer)

      if (!response.state.isAlive) {
        engine.stop();
      }
    }

    worker.onmessage = (e) => {
      const {event, response} = e.data

      if (event === 'requestFrame') {
        draw_(response)
      }

      if (event === 'initializeGame') {
        ctxBuffer = prepareCanvas(response, canvasBuffer)
        ctx = prepareCanvas(response, canvas)

        draw_(response)
      }
    }

    const handlePress = () => {
      if (this.dat && !this.dat.state.isAlive) {
        this.reset()
        this.requestFrame({dt: 0})
      } else if (!engine.running) {
        engine.start();
      }

      this.handlePress()
    }

    const handleRelease = () => {
      this.handleRelease()
    }

    document.addEventListener('touchstart', handlePress);
    document.addEventListener('keydown', handlePress);
    document.addEventListener('touchend', handleRelease);
    document.addEventListener('keyup', handleRelease);
  },

  methods: {
    ...mapWorker(worker, [
      'initializeGame',
      'requestFrame',
      'handleRelease',
      'handlePress'
    ]),

    reset() {
      this.initializeGame(levels[this.level]())
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
