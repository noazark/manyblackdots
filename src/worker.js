import {isJumping, move, detectCollision, handleCollisions} from '@/lib/engine'

const BASE_CONFIG = {
  description: '',
  cameraX: -30,
  showCollisions: false,
  showVectors: false,
  showGhosts: false,
}

let data = {}

function requestFrame(frame) {
  move(data, frame)
  const collisions = detectCollision(data, data.map)
  handleCollisions(data, collisions)
  return data
}

function initializeGame({ config, map }) {
  data = {
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
  }

  return data
}

function handlePress() {
  if (!isJumping(data)) {
    data.state.up = true
  }
}

function handleRelease() {
  data.state.up = false
}


onmessage = function(e) {
  let {event, args} = e.data
  let func

  if (args == null) {
    args = {}
  }

  if (event === 'requestFrame') {
    func = requestFrame
  }

  if (event === 'initializeGame') {
    func = initializeGame
  }

  if (event === 'handlePress') {
    func = handlePress
  }

  if (event === 'handleRelease') {
    func = handleRelease
  }

  const response = func(...args)
  postMessage({event, response})
}
