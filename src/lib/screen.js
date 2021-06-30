import { PROP_DRAWABLE } from "./engine";

function cameraX(data) {
  const camera = data.map.find((el) => el.type === "camera");
  return camera.x;
}

export function prepareCanvas(canvas, data) {
  const ctx = canvas.getContext("2d");
  const camera = data.map.find((el) => el.type === "camera");

  canvas.width = camera.w * 2;
  canvas.height = camera.h * 2;
  canvas.style.width = `${camera.w}px`;
  canvas.style.height = `${camera.h}px`;
  ctx.scale(2, 2);

  return ctx;
}

export function flush(buffer, canvas) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(buffer, 0, 0, canvas.width / 2, canvas.height / 2);
}

function _drawRect(ctx, data, r) {
  const camera = data.map.find((el) => el.type === "camera");
  const x = r.x;
  const y = camera.h - r.y - r.h;
  const width = r.w;
  const height = r.h;

  ctx.fillStyle = r.color;

  if (data.state.showCollisions && r.inCollision) {
    ctx.fillStyle = "red";
  }

  ctx.fillRect(x - cameraX(data), y, width, height);
}

export function drawVectors(ctx, data) {
  const drawables = data.map.filter((el) =>
    el.properties.includes(PROP_DRAWABLE)
  );
  const camera = data.map.find((el) => el.type === "camera");
  drawables.forEach((r) => {
    ctx.strokeStyle = "red";
    ctx.beginPath();
    const cx = r.x - cameraX(data) + r.w / 2;
    const cy = camera.h - r.y - r.h + r.h / 2;

    const vx = r.dx * 50;
    const vy = r.dy * 50;
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + vx, cy - vy);
    ctx.stroke();
  });
}

export function drawGhosts(ctx, data) {
  const camera = data.map.find((el) => el.type === "camera");
  const drawables = data.map.filter((el) =>
    el.properties.includes(PROP_DRAWABLE)
  );
  drawables.forEach((r) => {
    ctx.fillStyle = "blue";
    ctx.fillRect(r.x0 - cameraX(data), camera.h - r.y0 - r.h, r.w, r.h);
  });
}

export function drawRects(ctx, data) {
  const drawables = data.map.filter((el) =>
    el.properties.includes(PROP_DRAWABLE)
  );
  drawables.forEach((r) => _drawRect(ctx, data, r));
}

export function drawGameOver(ctx, data) {
  const camera = data.map.find((el) => el.type === "camera");

  ctx.fillStyle = "#333333";
  ctx.textAlign = "center";
  ctx.font = "24px monospace";
  ctx.fillText("Game Over", camera.w / 2, camera.h / 2);
}

export function drawGameWon(ctx, data) {
  const camera = data.map.find((el) => el.type === "camera");
  ctx.fillStyle = "#efefef";
  ctx.textAlign = "center";
  ctx.font = "24px monospace";
  ctx.fillText(
    data.config.nextLevel ? "You Win!" : "Kill Screen",
    camera.w / 2,
    camera.h / 2
  );
}

export function draw(canvas, data) {
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (data.state.showGhosts) {
    drawGhosts(ctx, data);
  }

  drawRects(ctx, data);

  if (data.state.showVectors) {
    drawVectors(ctx, data);
  }

  if (!data.state.isAlive) {
    drawGameOver(ctx, data);
  }

  if (data.state.isWinner) {
    drawGameWon(ctx, data);
  }
}
