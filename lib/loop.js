// taken from https://github.com/mattdesl/raf-loop/blob/master/index.js
// modified to remove external dependencies

function Event(name) {
  this.name = name;
  this.callbacks = [];
}
Event.prototype.registerCallback = function(callback) {
  this.callbacks.push(callback);
};

function Reactor() {
  this.events = {};
}

Reactor.prototype.registerEvent = function(eventName) {
  const event = new Event(eventName);
  this.events[eventName] = event;
};

Reactor.prototype.dispatchEvent = function(eventName, eventArgs) {
  this.events[eventName].callbacks.forEach(function(callback) {
    callback(eventArgs);
  });
};

Reactor.prototype.addEventListener = function(eventName, callback) {
  this.events[eventName].registerCallback(callback);
};

export function Loop(fn) {
  if (!(this instanceof Loop)) {
    return new Loop(fn);
  }
  this.events = new Reactor();
  this.events.registerEvent('tick');

  this.running = false;
  this.last = Date.now();
  this._frame = 0;
  this._tick = this.tick.bind(this);

  if (fn) {
    this.events.addEventListener('tick', fn);
  }
}

Loop.prototype.start = function() {
  if (this.running) {
    return;
  }
  this.running = true;
  this.last = Date.now();
  this._frame = requestAnimationFrame(this._tick);
  return this;
};

Loop.prototype.stop = function() {
  this.running = false;
  if (this._frame !== 0) {
    cancelAnimationFrame(this._frame);
  }
  this._frame = 0;
  return this;
};

Loop.prototype.tick = function() {
  this._frame = requestAnimationFrame(this._tick);
  const time = Date.now();
  const dt = time - this.last;
  this.events.dispatchEvent('tick', dt);
  this.last = time;
};
