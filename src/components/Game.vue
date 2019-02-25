<template>
  <div class="game">
    <select class="level-select" v-model="level">
      <option :value="k" v-for="v,k in levels">{{v.config.name || k}}</option>
    </select>
    <canvas ref="canvas"></canvas>
    <pre v-if="dat.state && dat.state.isWinner && currentLevel.config.nextLevel"><a href="" @click.prevent="nextLevel">next level</a></pre>
    <pre v-else>{{currentLevel.config.description}}</pre>
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
      levels: loadLevels({
        ...mainLevels,
        ...testLevels
      }),
      level: 'level1',
      state: {
        up: false
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
    this.canvas = this.$refs.canvas
    this.canvasBuffer = this.$refs.canvas.cloneNode()

    engine.events.addEventListener('tick', dt => this.requestFrame({...this.state, dt}))

    worker.onmessage = (e) => this.draw(e)

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

    draw(e) {
      const {event, response} = e.data

      if (event === 'requestFrame') {
        draw(this.canvasBuffer, response)
        flush(this.canvasBuffer, this.canvas)

        if (!response.state.isAlive) {
          engine.stop()
        }
      }

      if (event === 'loadGame') {
        prepareCanvas(this.canvasBuffer, response)
        prepareCanvas(this.canvas, response)

        this.requestFrame({...this.state, dt: 0})
      }

      if (response) {
        this.dat = response
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
