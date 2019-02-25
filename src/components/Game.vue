<template>
  <div class="game">
    <div>
      <select class="level-select" v-model="level">
        <option :value="k" v-for="(v,k) in levels" :key="k">{{v.config.name || k}}</option>
      </select>
    </div>
    <canvas ref="canvas"></canvas>
    <pre v-if="dat.state && dat.state.isWinner && currentLevel.config.nextLevel"><a href="" @click.prevent="nextLevel">next level</a></pre>
    <pre v-else>{{currentLevel.config.description}}</pre>

    <template v-if="debug">
      <label><input type="checkbox" v-model="state.showVectors"> show vectors</label>
      <br>
      <label><input type="checkbox" v-model="state.showGhosts"> show ghosts</label>
      <br>
      <label><input type="checkbox" v-model="state.showCollisions"> show collisions</label>
    </template>
  </div>
</template>

<script>
// eslint-disable-next-line
import Worker from 'worker-loader!@/worker.worker.js'
import { loadLevels } from '@/lib/engine'
import { draw, prepareCanvas, flush } from '@/lib/screen'
import { Loop } from '@/lib/loop'
import * as mainLevels from '@/maps/main'
import * as testLevels from '@/maps/tests'
import url from 'url'

const worker = new Worker()
const engine = new Loop()

function mapWorker (worker, events) {
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
      debug: false,
      levels: loadLevels({
        ...mainLevels,
        ...testLevels
      }),
      level: 'level1',
      state: {
        up: false,
        showVectors: false,
        showGhosts: false,
        showCollisions: false,
      },
      dat: {
        config: {}
      }
    }
  },

  watch: {
    level: {
      handler () {
        this.reset()
      },
      immediate: true
    },

    state: {
      handler () {
        this.draw(this.dat)
      },
      deep: true
    }
  },

  computed: {
    currentLevel () {
      return this.levels[this.level]
    }
  },

  destroyed () {
    worker.terminate()
  },

  mounted () {
    const params = url.parse(window.location.search, true)

    this.debug = !!params.query.debug

    this.canvas = this.$refs.canvas
    this.canvasBuffer = this.$refs.canvas.cloneNode()

    engine.events.addEventListener('tick', dt =>
      this.requestFrame({...this.state, dt})
    )

    worker.addEventListener('message', e =>
      this.handleFrame(e)
    )

    const handlePress = (e) => {
      this.state.up = true

      if (this.dat && !this.dat.state.isAlive) {
        this.reset()
      } else if (!engine.running) {
        engine.start()
      }
    }

    const handleRelease = (e) => {
      this.state.up = false
    }

    document.addEventListener('contextmenu', (e) => e.preventDefault())
    document.addEventListener('touchstart', handlePress)
    document.addEventListener('keydown', handlePress)
    document.addEventListener('touchend', handleRelease)
    document.addEventListener('keyup', handleRelease)
  },

  methods: {
    ...mapWorker(worker, [
      'loadGame',
      'requestFrame'
    ]),

    draw(response) {
      draw(this.canvasBuffer, response)
      flush(this.canvasBuffer, this.canvas)
    },

    handleFrame(e) {
      const {event, response} = e.data
      this.dat = response

      if (event === 'requestFrame') {
        this.draw(response)
      }

      if (!response.state.isAlive) {
        engine.stop()
      }

      if (event === 'loadGame') {
        prepareCanvas(this.canvasBuffer, response)
        prepareCanvas(this.canvas, response)

        this.draw(response)
      }
    },

    reset () {
      this.loadGame(this.currentLevel)
    },

    nextLevel () {
      if (this.currentLevel.config.nextLevel) {
        engine.stop()
        this.level = this.currentLevel.config.nextLevel
        this.reset()
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
*:focus {
    outline: none;
}

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

.level-select {
  appearance: none;
  background: none;
  border: none;
  font-size: 1rem;
  font-family: monospace;
  margin-bottom: .5rem;
}
</style>
