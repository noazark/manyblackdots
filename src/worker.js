import {isJumping, move, detectCollision, handleCollisions} from '@/lib/engine'

let data = {}

function requestFrame(frame) {
  move(data, frame)
  const collisions = detectCollision(data, data.map)
  handleCollisions(data, collisions)
  return data
}

function loadGame(data_) {
  data = data_

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

  const handlers = {
    requestFrame,
    loadGame,
    handlePress,
    handleRelease
  }

  const response = handlers[event](...args)
  postMessage({event, response})
}
