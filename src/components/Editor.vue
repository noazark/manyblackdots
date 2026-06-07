<template>
  <div class="editor">
    <div class="toolbar">
      <div class="toolbar-group toolbar-btn-group">
        <button
          v-for="t in tools"
          :key="t.id"
          :class="{ active: tool === t.id }"
          @click="tool = t.id"
          :title="t.label + (t.key ? ` (${t.key})` : '')"
        >
          {{ t.label }} <kbd v-if="t.key">{{ t.key }}</kbd>
        </button>
      </div>

      <div class="toolbar-sep"></div>

      <div class="toolbar-group">
        <button @click="togglePlay" :class="{ active: isPlaying }">
          <Play :size="13" /> {{ isPlaying ? "Stop" : "Play" }}
        </button>
      </div>

      <div class="toolbar-sep"></div>

      <div class="toolbar-group">
        <label class="toolbar-check" title="Toggle Jump Arc (J)">
          <input type="checkbox" v-model="showJumpArc" />
          Jump Arc <kbd>J</kbd>
        </label>
      </div>

      <div class="toolbar-group">
        <label class="toolbar-check" title="Toggle Ghost Tracks (G)">
          <input type="checkbox" v-model="showGhosts" />
          Ghosts <kbd>G</kbd>
        </label>
        <a
          v-if="ghostTracks.length > 0"
          href=""
          @click.prevent="ghostTracks = []"
          class="toolbar-link"
        >clear</a>
      </div>

      <div class="toolbar-spacer"></div>

      <div class="toolbar-group">
        <div class="share-group">
          <button @click="showShareMenu = !showShareMenu" class="share-toggle">
            &#9662;
          </button>
          <button @click="copyPlayLink" class="share-btn" title="Copy playable link">
            {{ playLinkCopied ? "Copied!" : (shareMode === 'level' ? "Share Level" : "Share All") }}
          </button>
          <div class="share-menu" v-if="showShareMenu">
            <button @click="selectShareMode('level')">Share Level</button>
            <button @click="selectShareMode('all')">Share All</button>
          </div>
        </div>
        <button @click="showExport = !showExport" title="Export JSON (E)">
          {{ showExport ? "Hide JSON" : "Export JSON" }} <kbd>E</kbd>
        </button>
      </div>
    </div>

    <div class="main-area">
      <div class="level-sidebar">
        <div class="level-sections">
        <div class="level-section"
          @dragover.prevent="onSectionDragOver('playable', $event)"
          @drop.prevent="onSectionDrop('playable')">
          <div class="level-section-header">Playable</div>
          <div
            v-for="level in playableLevels"
            :key="level.id"
            class="level-item"
            :class="{ active: level.id === activeLevelId, 'drop-above': dropTarget === level.id && dropPos === 'before', 'drop-below': dropTarget === level.id && dropPos === 'after' }"
            draggable="true"
            @dragstart="onLevelDragStart(level.id, $event)"
            @dragover.prevent="onLevelDragOver(level.id, $event)"
            @drop.stop.prevent="onLevelDrop(level.id, 'playable')"
            @dragend="onLevelDragEnd"
            @click="switchLevel(level.id)"
          >
            <span class="level-item-name">{{ level.name }}</span>
            <span class="level-item-chain" v-if="level.nextLevel">&#8594; {{ level.nextLevel }}</span>
          </div>
        </div>

        <div class="level-section"
          @dragover.prevent="onSectionDragOver('hidden', $event)"
          @drop.prevent="onSectionDrop('hidden')">
          <div class="level-section-header">Hidden</div>
          <div
            v-for="level in hiddenLevels"
            :key="level.id"
            class="level-item"
            :class="{ active: level.id === activeLevelId, 'drop-above': dropTarget === level.id && dropPos === 'before', 'drop-below': dropTarget === level.id && dropPos === 'after' }"
            draggable="true"
            @dragstart="onLevelDragStart(level.id, $event)"
            @dragover.prevent="onLevelDragOver(level.id, $event)"
            @drop.stop.prevent="onLevelDrop(level.id, 'hidden')"
            @dragend="onLevelDragEnd"
            @click="switchLevel(level.id)"
          >
            <span class="level-item-name">{{ level.name }}</span>
          </div>
        </div>

        </div>
        <div class="level-sidebar-actions">
          <button class="level-add-btn" @click="addNewLevel">+ New Level</button>
          <div class="import-wrap">
            <button class="level-import-btn">Import</button>
            <select class="import-select" @change="importLevel($event)">
              <option value="">Import...</option>
              <option :value="k" v-for="(v, k) in availableLevels" :key="k">
                {{ v.config.name || k }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div class="canvas-wrap">
        <canvas
          ref="canvas"
          @mousedown="onMouseDown"
          @mousemove="onMouseMove"
          @mouseup="onMouseUp"
          @wheel.prevent="onWheel"
          @contextmenu.prevent
        ></canvas>
      </div>

      <div class="sidebar">
        <template v-if="selectedIndex == null">
          <div class="sidebar-header">
            <span class="sidebar-type">Level</span>
          </div>
          <div class="sidebar-section">
            <div class="sidebar-section-title">Name</div>
            <input
              type="text"
              class="prop-input prop-input-full"
              v-model="levelName"
              placeholder="Level name"
            />
          </div>
          <div class="sidebar-section">
            <div class="sidebar-section-title">Description</div>
            <textarea
              class="prop-textarea"
              :value="levelDescription"
              @input="levelDescription = $event.target.value"
              placeholder="Shown below the game"
              rows="3"
            ></textarea>
          </div>
        </template>

        <template v-else-if="selectedIndex === 'heroStart'">
          <div class="sidebar-header">
            <span class="sidebar-type">Start</span>
          </div>
          <div class="sidebar-section">
            <div class="sidebar-section-title">Position</div>
            <div class="prop-row">
              <label class="prop-label">X</label>
              <input
                type="number"
                class="prop-input"
                :value="heroStart.x"
                readonly
                title="Fixed at 0 — drag to shift all objects"
              />
            </div>
          </div>
        </template>

        <template v-else-if="selectedIndex === 'winZone'">
          <div class="sidebar-header">
            <span class="sidebar-type">Goal</span>
          </div>
          <div class="sidebar-section">
            <div class="sidebar-section-title">Position</div>
            <div class="prop-row">
              <label class="prop-label">X</label>
              <input
                type="number"
                class="prop-input"
                :value="winZone"
                @input="setLineProp('winZone', $event)"
              />
            </div>
          </div>
        </template>

        <template v-else>
        <div class="sidebar-header">
          <span class="sidebar-type">{{ selectedEntity.type }}</span>
        </div>

        <div class="sidebar-section">
          <div class="sidebar-section-title">Position</div>
          <div class="prop-row">
            <label class="prop-label">X</label>
            <input
              type="number"
              class="prop-input"
              :value="selectedEntity.x"
              @input="setProp('x', $event)"
            />
          </div>
          <div class="prop-row">
            <label class="prop-label">Y</label>
            <input
              type="number"
              class="prop-input"
              :value="selectedEntity.y"
              @input="setProp('y', $event)"
            />
          </div>
        </div>

        <div class="sidebar-section">
          <div class="sidebar-section-title">Size</div>
          <div class="prop-row">
            <label class="prop-label">W</label>
            <input
              type="number"
              class="prop-input"
              :value="selectedEntity.w"
              @input="setProp('w', $event)"
              min="1"
            />
          </div>
          <div class="prop-row">
            <label class="prop-label">H</label>
            <input
              type="number"
              class="prop-input"
              :value="selectedEntity.h"
              @input="setProp('h', $event)"
              min="1"
            />
          </div>
        </div>

        <div class="sidebar-section" v-if="selectedEntity.type === 'hero'">
          <div class="sidebar-section-title">Velocity</div>
          <div class="prop-row">
            <label class="prop-label">dX</label>
            <input
              type="number"
              class="prop-input"
              :value="selectedEntity.dx"
              @input="setProp('dx', $event)"
              step="0.05"
            />
          </div>
          <div class="prop-row">
            <label class="prop-label">dY</label>
            <input
              type="number"
              class="prop-input"
              :value="selectedEntity.dy"
              @input="setProp('dy', $event)"
              step="0.05"
            />
          </div>
        </div>

        <div class="sidebar-section">
          <div class="sidebar-section-title">Appearance</div>
          <div class="prop-row">
            <label class="prop-label">Color</label>
            <div class="color-row">
              <input
                type="color"
                class="prop-color"
                :value="selectedEntity.color || '#333333'"
                @input="setColor($event)"
              />
              <input
                type="text"
                class="prop-input prop-input-color-text"
                :value="selectedEntity.color || '#333333'"
                @change="setColorText($event)"
              />
            </div>
          </div>
        </div>

        <div class="sidebar-section">
          <div class="sidebar-section-title">Properties</div>
          <div class="prop-flags">
            <span
              v-for="p in selectedEntity.properties"
              :key="p"
              class="prop-flag"
            >{{ p }}</span>
          </div>
        </div>

        <div class="sidebar-section sidebar-delete-section" v-if="selectedEntity.type !== 'hero'">
          <button class="sidebar-delete" @click="deleteSelected">
            Delete <kbd>del</kbd>
          </button>
        </div>
        </template>
      </div>
    </div>

    <div class="status-bar">
      <span v-if="selectedEntity">
        {{ selectedEntity.type }}
        (x:{{ Math.round(selectedEntity.x) }}
        y:{{ Math.round(selectedEntity.y) }}
        w:{{ Math.round(selectedEntity.w) }}
        h:{{ Math.round(selectedEntity.h) }})
      </span>
      <span v-else>
        {{ tool }} tool
      </span>
      <span class="status-right">
        space:pan &middot; arrows:nudge &middot; shift+arrows:x10 &middot; cmd+d:dup &middot; cmd+0:reset zoom &middot; cmd+1:fit
      </span>
    </div>

    <div v-if="showExport" class="export-panel">
      <div class="export-header">
        <span>Level JSON</span>
        <button @click="copyJson">{{ copied ? "Copied!" : "Copy" }}</button>
        <button @click="showExport = false">Close</button>
      </div>
      <textarea readonly :value="exportJson" class="export-textarea"></textarea>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, computed, onMounted, onUnmounted, watch, nextTick } from "vue";
import { Play } from "lucide-vue-next";
import { loadLevels } from "@/lib/engine";
import { Loop } from "@/lib/loop";
import {
  CAMERA,
  BASE_HERO,
  BASE_PLATFORM,
  BASE_OBSTACLE,
  BASE_WIN_ZONE,
  BASE_WALL,
  clouds,
} from "@/lib/build-tools";

import * as mainLevels from "@/maps/main";
import * as testLevels from "@/maps/tests";

const HANDLE_SIZE = 6;
const HIT_MARGIN = 5;
const CAM_SIZE = 300; // gameplay viewport size

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function makeEntity(base, overrides) {
  return Object.assign({}, base, { x0: 0, y0: 0 }, overrides);
}

function entityHitTest(entity, gx, gy) {
  const margin = Math.max(HIT_MARGIN, entity.h < 5 ? 5 : 0);
  return (
    gx >= entity.x - margin &&
    gx <= entity.x + entity.w + margin &&
    gy >= entity.y - margin &&
    gy <= entity.y + entity.h + margin
  );
}

function cornerHitTest(entity, gx, gy, zoom) {
  const threshold = HANDLE_SIZE / zoom + 2;
  const corners = [
    { id: "bl", x: entity.x, y: entity.y },
    { id: "tl", x: entity.x, y: entity.y + entity.h },
    { id: "tr", x: entity.x + entity.w, y: entity.y + entity.h },
    { id: "br", x: entity.x + entity.w, y: entity.y },
  ];
  for (const c of corners) {
    if (Math.abs(gx - c.x) < threshold && Math.abs(gy - c.y) < threshold) {
      return c.id;
    }
  }
  return null;
}

function snapToPlaftormY(gx, entities, heroW, heroH) {
  // Find the highest platform/wall surface directly below (or at) gx
  let bestY = 0;
  const heroLeft = gx;
  const heroRight = gx + heroW;
  for (const ent of entities) {
    if (ent.type !== "platform" && ent.type !== "wall") continue;
    // Check horizontal overlap
    if (heroRight > ent.x && heroLeft < ent.x + ent.w) {
      const surface = ent.y + ent.h;
      if (surface > bestY) bestY = surface;
    }
  }
  return bestY;
}

function lineHitTest(lineX, gx, zoom) {
  const threshold = Math.max(HIT_MARGIN, 6 / zoom);
  return Math.abs(gx - lineX) < threshold;
}

const KILL_BOUNDARY_Y = -100;

function simulateJumpArc(startX, startY, heroW, heroH, heroDx, burnMs) {
  const points = [{ x: startX, y: startY }];
  const dt = 16;
  let x = startX;
  let y = startY;
  let dy = 0;
  const totalBurn = burnMs;
  let elapsed = 0;
  let holding = true;

  for (let i = 0; i < 2000; i++) {
    elapsed += dt;
    if (elapsed > totalBurn) holding = false;

    const burnRemaining = holding ? Math.max(0, (totalBurn - elapsed) / 1000) : 0;

    if (holding && burnRemaining > 0) {
      dy = burnRemaining * 1.001;
    } else {
      dy = dy - 0.08;
    }

    x += dt * heroDx;
    y += dt * dy;

    if (y < KILL_BOUNDARY_Y) {
      // Interpolate to exact boundary
      const prevY = points[points.length - 1].y;
      const prevX = points[points.length - 1].x;
      const t = (KILL_BOUNDARY_Y - prevY) / (y - prevY);
      points.push({ x: prevX + (x - prevX) * t, y: KILL_BOUNDARY_Y });
      break;
    }

    points.push({ x, y });
  }

  return points;
}

export default defineComponent({
  name: "Editor",
  components: { Play },

  setup() {
    const canvas = ref(null);
    const tool = ref("select");
    const showJumpArc = ref(false);
    const showExport = ref(false);
    const shareMode = ref("level");
    const showShareMenu = ref(false);
    const isPlaying = ref(false);
    const copied = ref(false);
    const selectedIndex = ref(null);

    const viewport = reactive({ x: -CAM_SIZE, y: -50 });
    const zoom = ref(1);

    const availableLevels = loadLevels({ ...mainLevels, ...testLevels });

    // --- Level list model ---
    let _nextId = 1;
    function genId() { return 'lvl_' + (_nextId++); }

    function makeDefaultLevelData() {
      return {
        entities: [
          makeEntity(BASE_PLATFORM, { x: -30, y: 0, w: 500 }),
          makeEntity(BASE_HERO, { x: 30, y: 1 }),
        ],
        winZone: 1700,
      };
    }

    // Determine which keys are in the playable chain
    const playableKeys = new Set();
    {
      // Walk the nextLevel chain starting from level1
      let key = "level1";
      while (key && availableLevels[key]) {
        playableKeys.add(key);
        key = availableLevels[key].config.nextLevel;
      }
    }

    function isKillBoundary(ent) {
      return ent.type === "obstacle" && ent.y <= -50 && ent.w >= 1000;
    }

    function importLevelData(key, level) {
      const ents = [];
      let wz = 1700;
      for (const ent of level.map) {
        if (ent.type === "camera") continue;
        if (ent.type === "shape") continue;
        if (ent.type === "win-zone") { wz = ent.x; continue; }
        if (isKillBoundary(ent)) continue;
        ents.push(deepClone(ent));
      }
      const hero = ents.find((e) => e.type === "hero");
      if (hero) {
        const offsetX = hero.x;
        for (const e of ents) { e.x -= offsetX; }
        wz -= offsetX;
      }
      return {
        id: genId(),
        name: level.config.name || key,
        description: level.config.description || "",
        category: playableKeys.has(key) ? "playable" : "hidden",
        winZone: wz,
        entities: ents,
      };
    }

    // Build initial level list from all game levels, playable first in chain order
    const initialLevels = [];
    // Add playable levels in order
    {
      let key = "level1";
      while (key && availableLevels[key]) {
        initialLevels.push(importLevelData(key, availableLevels[key]));
        key = availableLevels[key].config.nextLevel;
      }
    }
    // Add hidden levels
    for (const [key, level] of Object.entries(availableLevels)) {
      if (!playableKeys.has(key)) {
        initialLevels.push(importLevelData(key, level));
      }
    }

    const editorLevels = ref(initialLevels);
    const activeLevelId = ref(editorLevels.value[0]?.id);

    // Current editing refs — synced with active level
    const firstLevel = editorLevels.value[0];
    const levelName = ref(firstLevel?.name || "Untitled");
    const levelDescription = ref(firstLevel?.description || "");
    const gameWidth = computed(() => winZone.value + CAM_SIZE);
    const heroStart = reactive({ x: 0, y: 0 });
    const winZone = ref(firstLevel?.winZone || 1700);
    const entities = ref(firstLevel ? deepClone(firstLevel.entities) : []);

    // Derived level lists
    const playableLevels = computed(() => {
      const levels = editorLevels.value.filter((l) => l.category === "playable");
      // Auto-chain nextLevel
      for (let i = 0; i < levels.length; i++) {
        levels[i].nextLevel = i < levels.length - 1 ? levels[i + 1].name : null;
      }
      return levels;
    });
    const hiddenLevels = computed(() => editorLevels.value.filter((l) => l.category === "hidden"));

    // Drag state for level list
    let dragLevelId = null;
    const dropTarget = ref(null);
    const dropPos = ref(null);

    // Level switching
    function saveCurrentLevel() {
      const lvl = editorLevels.value.find((l) => l.id === activeLevelId.value);
      if (!lvl) return;
      lvl.name = levelName.value;
      lvl.description = levelDescription.value;
      lvl.winZone = winZone.value;
      lvl.entities = deepClone(entities.value);
    }

    function loadLevelById(id) {
      const lvl = editorLevels.value.find((l) => l.id === id);
      if (!lvl) return;
      levelName.value = lvl.name;
      levelDescription.value = lvl.description;
      winZone.value = lvl.winZone;
      entities.value = deepClone(lvl.entities);
      activeLevelId.value = id;
      heroStart.x = 0;
      heroStart.y = snapToPlaftormY(0, entities.value, BASE_HERO.w, BASE_HERO.h);
      selectedIndex.value = null;
      viewport.x = -CAM_SIZE;
      viewport.y = -50;
      nextTick(() => render());
    }

    function switchLevel(id) {
      if (id === activeLevelId.value) return;
      saveCurrentLevel();
      loadLevelById(id);
    }

    function addNewLevel() {
      saveCurrentLevel();
      const data = makeDefaultLevelData();
      const lvl = { id: genId(), name: "Untitled", description: "", category: "playable", ...data };
      editorLevels.value.push(lvl);
      loadLevelById(lvl.id);
    }

    function importLevel(event) {
      const key = event.target.value;
      event.target.value = "";
      if (!key) return;
      const level = availableLevels[key];
      if (!level) return;

      saveCurrentLevel();

      const newEntities = [];
      let importWinZone = 1700;
      for (const ent of level.map) {
        if (ent.type === "camera") continue;
        if (ent.type === "shape") continue;
        if (ent.type === "win-zone") { importWinZone = ent.x; continue; }
        if (isKillBoundary(ent)) continue;
        newEntities.push(deepClone(ent));
      }

      // Normalize so hero start is at x=0
      const loadedHero = newEntities.find((e) => e.type === "hero");
      if (loadedHero) {
        const offsetX = loadedHero.x;
        for (const ent of newEntities) { ent.x -= offsetX; }
        importWinZone -= offsetX;
      }

      const lvl = {
        id: genId(),
        name: level.config.name || key,
        description: level.config.description || "",
        category: "playable",
        winZone: importWinZone,
        entities: newEntities,
      };
      editorLevels.value.push(lvl);
      loadLevelById(lvl.id);
    }

    // Level drag and drop
    function onLevelDragStart(id, e) {
      dragLevelId = id;
      e.dataTransfer.effectAllowed = "move";
    }

    function onLevelDragOver(id, e) {
      if (!dragLevelId || dragLevelId === id) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const midY = rect.top + rect.height / 2;
      dropTarget.value = id;
      dropPos.value = e.clientY < midY ? "before" : "after";
    }

    function onSectionDragOver(category, e) {
      // Allow drop on empty section
    }

    function onLevelDrop(targetId, targetCategory) {
      if (!dragLevelId || dragLevelId === targetId) { onLevelDragEnd(); return; }
      const levels = editorLevels.value;
      const srcIdx = levels.findIndex((l) => l.id === dragLevelId);
      if (srcIdx === -1) { onLevelDragEnd(); return; }
      const [moved] = levels.splice(srcIdx, 1);
      moved.category = targetCategory;
      const tgtIdx = levels.findIndex((l) => l.id === targetId);
      const insertIdx = dropPos.value === "after" ? tgtIdx + 1 : tgtIdx;
      levels.splice(insertIdx, 0, moved);
      onLevelDragEnd();
    }

    function onSectionDrop(category) {
      if (!dragLevelId) return;
      const levels = editorLevels.value;
      const srcIdx = levels.findIndex((l) => l.id === dragLevelId);
      if (srcIdx === -1) { onLevelDragEnd(); return; }
      const [moved] = levels.splice(srcIdx, 1);
      moved.category = category;
      levels.push(moved);
      onLevelDragEnd();
    }

    function onLevelDragEnd() {
      dragLevelId = null;
      dropTarget.value = null;
      dropPos.value = null;
    }

    const tools = [
      { id: "select", label: "Select", key: "V" },
      { id: "platform", label: "Platform", key: "P" },
      { id: "obstacle", label: "Obstacle", key: "O" },
      { id: "wall", label: "Wall", key: "W" },
    ];

    // Drag state
    let drag = null;

    // Play mode state
    let playWorker = null;
    let playLoop = null;
    let savedHeroPos = null;

    // Ghost tracks
    const ghostTracks = ref([]);
    const showGhosts = ref(true);
    let currentGhostTrack = [];

    const selectedEntity = computed(() => {
      if (selectedIndex.value == null) return null;
      return entities.value[selectedIndex.value] || null;
    });

    // Coordinate transforms
    function gameToScreenX(gx) {
      return (gx - viewport.x) * zoom.value;
    }
    function canvasLogicalHeight() {
      if (!canvas.value) return 400;
      const dpr = window.devicePixelRatio || 1;
      return canvas.value.height / dpr;
    }
    function gameToScreenY(gy) {
      return canvasLogicalHeight() - (gy - viewport.y) * zoom.value;
    }
    function screenToGameX(sx) {
      return sx / zoom.value + viewport.x;
    }
    function screenToGameY(sy) {
      return (canvasLogicalHeight() - sy) / zoom.value + viewport.y;
    }

    function getEntityBounds() {
      let minX = Math.min(0, heroStart.x), minY = 0;
      let maxX = Math.max(winZone.value, heroStart.x), maxY = CAM_SIZE;
      for (const ent of entities.value) {
        if (ent.x < minX) minX = ent.x;
        if (ent.y < minY) minY = ent.y;
        if (ent.x + ent.w > maxX) maxX = ent.x + ent.w;
        if (ent.y + ent.h > maxY) maxY = ent.y + ent.h;
      }
      return { minX, minY, maxX, maxY };
    }

    function clampViewport() {
      const bounds = getEntityBounds();
      const dpr = window.devicePixelRatio || 1;
      const viewW = canvas.value ? canvas.value.width / dpr / zoom.value : 1000;
      const viewH = canvas.value ? canvas.value.height / dpr / zoom.value : 400;

      const minVX = bounds.minX - CAM_SIZE;
      const maxVX = bounds.maxX + CAM_SIZE - viewW;
      const minVY = bounds.minY - CAM_SIZE;
      const maxVY = bounds.maxY + CAM_SIZE - viewH;

      viewport.x = Math.max(minVX, Math.min(maxVX, viewport.x));
      viewport.y = Math.max(minVY, Math.min(maxVY, viewport.y));
    }

    function getMouseGameCoords(e) {
      const rect = canvas.value.getBoundingClientRect();
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      return { gx: screenToGameX(sx), gy: screenToGameY(sy) };
    }

    // Rendering
    function render() {
      if (!canvas.value) return;
      const ctx = canvas.value.getContext("2d");
      const dpr = window.devicePixelRatio || 1;
      const cw = canvas.value.width / dpr;
      const ch = canvas.value.height / dpr;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, cw, ch);

      // Background
      ctx.fillStyle = "#f5f5f5";
      ctx.fillRect(0, 0, cw, ch);

      // Grid lines
      ctx.strokeStyle = "#e0e0e0";
      ctx.lineWidth = 0.5;
      const gridSize = 50;
      const startGX = Math.floor(viewport.x / gridSize) * gridSize;
      const startGY = Math.floor(viewport.y / gridSize) * gridSize;
      const endGX = viewport.x + cw / zoom.value;
      const endGY = viewport.y + ch / zoom.value;

      for (let gx = startGX; gx <= endGX; gx += gridSize) {
        const sx = gameToScreenX(gx);
        ctx.beginPath();
        ctx.moveTo(sx, 0);
        ctx.lineTo(sx, ch);
        ctx.stroke();
      }
      for (let gy = startGY; gy <= endGY; gy += gridSize) {
        const sy = gameToScreenY(gy);
        ctx.beginPath();
        ctx.moveTo(0, sy);
        ctx.lineTo(cw, sy);
        ctx.stroke();
      }

      // X axis gradation numbers floating near bottom
      const rulerY = ch - 30;
      ctx.save();
      ctx.font = "9px monospace";
      ctx.fillStyle = "#999";
      for (let gx = startGX; gx <= endGX; gx += gridSize) {
        const sx = gameToScreenX(gx);
        ctx.save();
        ctx.translate(sx + 3, rulerY + 14);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(String(gx), 0, 0);
        ctx.restore();
      }
      ctx.restore();

      // Ground line (y=0)
      const groundY = gameToScreenY(0);
      ctx.strokeStyle = "#999";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(cw, groundY);
      ctx.stroke();

      // Kill boundary at y=-100 (red hatched)
      const killY = gameToScreenY(-100);
      if (killY < ch) {
        // Fill below the kill line with hatched red
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, killY, cw, ch - killY);
        ctx.clip();
        ctx.fillStyle = "rgba(192, 57, 43, 0.08)";
        ctx.fillRect(0, killY, cw, ch - killY);
        // Hatching lines
        ctx.strokeStyle = "rgba(192, 57, 43, 0.3)";
        ctx.lineWidth = 1;
        const spacing = 12;
        for (let i = -cw; i < cw + (ch - killY); i += spacing) {
          ctx.beginPath();
          ctx.moveTo(i, killY);
          ctx.lineTo(i + (ch - killY), ch);
          ctx.stroke();
        }
        ctx.restore();
        // Kill line
        ctx.strokeStyle = "rgba(192, 57, 43, 0.7)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, killY);
        ctx.lineTo(cw, killY);
        ctx.stroke();
      }

      // Camera viewport highlight (follows hero like in-game)
      const hero = entities.value.find((e) => e.type === "hero");
      const camGameX = hero ? Math.max(0, hero.x - 30) : 0;
      const camX = gameToScreenX(camGameX);
      const camY = gameToScreenY(300);
      const camW = 300 * zoom.value;
      const camH = 300 * zoom.value;
      ctx.strokeStyle = "rgba(66, 185, 131, 0.5)";
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.strokeRect(camX, camY, camW, camH);
      ctx.setLineDash([]);

      // Draw entities
      const colorMap = {
        platform: "#6a8caf",
        obstacle: "#c0392b",
        hero: "#2c3e50",
        "win-zone": "#27ae60",
        wall: "#7f8c8d",
        shape: "#bdc3c7",
      };

      entities.value.forEach((ent, i) => {
        const sx = gameToScreenX(ent.x);
        const sy = gameToScreenY(ent.y + ent.h);
        const sw = ent.w * zoom.value;
        const sh = ent.h * zoom.value;

        const displayH = Math.max(sh, 2);
        const displayY = sh < 2 ? sy - (2 - sh) : sy;

        ctx.fillStyle = colorMap[ent.type] || ent.color || "#333";
        if (ent.type === "win-zone") {
          ctx.globalAlpha = 0.3;
        }
        ctx.fillRect(sx, displayY, sw, displayH);
        ctx.globalAlpha = 1;

        // Selection highlight
        if (i === selectedIndex.value) {
          ctx.strokeStyle = "#3498db";
          ctx.lineWidth = 2;
          ctx.strokeRect(sx - 1, displayY - 1, sw + 2, displayH + 2);

          // Corner handles (not for hero — fixed size)
          if (ent.type !== "hero") {
            const hs = HANDLE_SIZE;
            ctx.fillStyle = "#3498db";
            const corners = [
              [sx, displayY],
              [sx, displayY + displayH],
              [sx + sw, displayY],
              [sx + sw, displayY + displayH],
            ];
            corners.forEach(([cx, cy]) => {
              ctx.fillRect(cx - hs / 2, cy - hs / 2, hs, hs);
            });
          }
        }

        // Label
        if (zoom.value >= 0.5) {
          ctx.fillStyle = "#666";
          ctx.font = "9px monospace";
          ctx.fillText(ent.type, sx + 2, displayY - 3);
        }
      });

      // Ghost tracks
      if (showGhosts.value && ghostTracks.value.length > 0) {
        ghostTracks.value.forEach((track, ti) => {
          const age = ghostTracks.value.length - ti;
          const alpha = Math.max(0.15, 0.6 / age);
          ctx.strokeStyle = `rgba(155, 89, 182, ${alpha})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          for (let i = 0; i < track.length; i++) {
            const sx = gameToScreenX(track[i].x);
            const sy = gameToScreenY(track[i].y);
            if (i === 0) ctx.moveTo(sx, sy);
            else ctx.lineTo(sx, sy);
          }
          ctx.stroke();

          // Death/end marker
          const last = track[track.length - 1];
          const lx = gameToScreenX(last.x);
          const ly = gameToScreenY(last.y);
          ctx.fillStyle = `rgba(155, 89, 182, ${alpha})`;
          ctx.beginPath();
          ctx.arc(lx, ly, 3, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // Hero start line
      {
        const sx = gameToScreenX(heroStart.x);
        const selected = selectedIndex.value === "heroStart";
        ctx.strokeStyle = selected ? "#3498db" : "#e67e22";
        ctx.lineWidth = selected ? 2.5 : 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(sx, 0);
        ctx.lineTo(sx, ch);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = selected ? "#3498db" : "#e67e22";
        ctx.font = "9px monospace";
        ctx.fillText("start", sx + 4, 14);
      }

      // Win zone line
      {
        const sx = gameToScreenX(winZone.value);
        const selected = selectedIndex.value === "winZone";
        ctx.strokeStyle = selected ? "#3498db" : "#27ae60";
        ctx.lineWidth = selected ? 2.5 : 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(sx, 0);
        ctx.lineTo(sx, ch);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = selected ? "#3498db" : "#27ae60";
        ctx.font = "9px monospace";
        ctx.fillText("goal", sx + 4, 14);
      }

      // Jump arc
      if (showJumpArc.value) {
        const hero = entities.value.find((e) => e.type === "hero");
        if (hero) {
          drawJumpArc(ctx, hero, 10, "rgba(52, 152, 219, 0.6)");
          drawJumpArc(ctx, hero, 125, "rgba(52, 152, 219, 0.25)");
          drawJumpArc(ctx, hero, 250, "rgba(155, 89, 182, 0.25)");
          drawJumpArc(ctx, hero, 375, "rgba(231, 76, 60, 0.25)");
          drawJumpArc(ctx, hero, 500, "rgba(231, 76, 60, 0.6)");
        }
      }

      // Drag preview
      if (drag && drag.type === "create" && drag.current) {
        const x = Math.min(drag.startGame.gx, drag.current.gx);
        const y = Math.min(drag.startGame.gy, drag.current.gy);
        const w = Math.abs(drag.current.gx - drag.startGame.gx);
        const h = Math.abs(drag.current.gy - drag.startGame.gy);

        const sx = gameToScreenX(x);
        const sy = gameToScreenY(y + h);
        const sw = w * zoom.value;
        const sh = h * zoom.value;

        ctx.fillStyle = "rgba(52, 152, 219, 0.3)";
        ctx.fillRect(sx, sy, sw, Math.max(sh, 2));
        ctx.strokeStyle = "#3498db";
        ctx.lineWidth = 1;
        ctx.strokeRect(sx, sy, sw, Math.max(sh, 2));
      }

      ctx.restore();
    }

    function drawJumpArc(ctx, hero, burnMs, color) {
      const points = simulateJumpArc(
        hero.x + hero.w / 2,
        hero.y + hero.h,
        hero.w,
        hero.h,
        hero.dx || 0.25,
        burnMs
      );

      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      for (let i = 0; i < points.length; i++) {
        const sx = gameToScreenX(points[i].x);
        const sy = gameToScreenY(points[i].y);
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Mouse handlers
    function onMouseDown(e) {
      if (isPlaying.value) return;
      const { gx, gy } = getMouseGameCoords(e);

      // Middle mouse, right mouse, or space+click = pan
      if (e.button === 1 || e.button === 2 || spaceHeld) {
        drag = {
          type: "pan",
          startScreen: { x: e.clientX, y: e.clientY },
          startViewport: { x: viewport.x, y: viewport.y },
        };
        if (canvas.value) canvas.value.style.cursor = "grabbing";
        return;
      }

      if (tool.value === "select") {
        // Check corner handles first (not for hero or line markers)
        if (selectedIndex.value != null && selectedIndex.value !== "heroStart" && selectedIndex.value !== "winZone") {
          const ent = entities.value[selectedIndex.value];
          if (ent && ent.type !== "hero") {
            const corner = cornerHitTest(ent, gx, gy, zoom.value);
            if (corner) {
              drag = {
                type: "resize",
                corner,
                entity: ent,
                startGame: { gx, gy },
                original: { x: ent.x, y: ent.y, w: ent.w, h: ent.h },
              };
              return;
            }
          }
        }

        // Check start/goal line hits
        if (lineHitTest(heroStart.x, gx, zoom.value)) {
          selectedIndex.value = "heroStart";
          drag = {
            type: "moveStart",
            startGame: { gx },
            lastGx: gx,
          };
          render();
          return;
        }
        if (lineHitTest(winZone.value, gx, zoom.value)) {
          selectedIndex.value = "winZone";
          drag = {
            type: "moveLine",
            target: "winZone",
            startGame: { gx },
            originalX: winZone.value,
          };
          render();
          return;
        }

        // Check entity hit
        let hitIdx = null;
        // Iterate in reverse so topmost entities are selected first
        for (let i = entities.value.length - 1; i >= 0; i--) {
          if (entityHitTest(entities.value[i], gx, gy)) {
            hitIdx = i;
            break;
          }
        }

        if (hitIdx != null) {
          selectedIndex.value = hitIdx;
          const ent = entities.value[hitIdx];
          drag = {
            type: "move",
            entity: ent,
            startGame: { gx, gy },
            original: { x: ent.x, y: ent.y },
          };
        } else {
          selectedIndex.value = null;
        }
        render();
        return;
      }

      // Create tools
      if (["platform", "obstacle", "wall"].includes(tool.value)) {
        drag = {
          type: "create",
          toolType: tool.value,
          startGame: { gx, gy },
          current: { gx, gy },
        };
        return;
      }
    }

    function onMouseMove(e) {
      if (!drag) {
        // Update cursor
        if (canvas.value && tool.value === "select" && !isPlaying.value) {
          const { gx, gy } = getMouseGameCoords(e);

          // Check start/goal lines
          if (lineHitTest(heroStart.x, gx, zoom.value) || lineHitTest(winZone.value, gx, zoom.value)) {
            canvas.value.style.cursor = "ew-resize";
            return;
          }

          if (selectedIndex.value != null && selectedIndex.value !== "heroStart" && selectedIndex.value !== "winZone") {
            const ent = entities.value[selectedIndex.value];
            const corner = cornerHitTest(ent, gx, gy, zoom.value);
            if (corner) {
              canvas.value.style.cursor = "nwse-resize";
              return;
            }
          }
          let hit = false;
          for (let i = entities.value.length - 1; i >= 0; i--) {
            if (entityHitTest(entities.value[i], gx, gy)) {
              hit = true;
              break;
            }
          }
          canvas.value.style.cursor = hit ? "move" : "default";
        }
        return;
      }

      if (drag.type === "pan") {
        const dx = e.clientX - drag.startScreen.x;
        const dy = e.clientY - drag.startScreen.y;
        viewport.x = drag.startViewport.x - dx / zoom.value;
        viewport.y = drag.startViewport.y + dy / zoom.value;
        clampViewport();
        render();
        return;
      }

      const { gx, gy } = getMouseGameCoords(e);

      if (drag.type === "moveStart") {
        const deltaX = Math.round(gx - drag.lastGx);
        if (deltaX !== 0) {
          drag.lastGx = gx;
          for (const ent of entities.value) {
            ent.x -= deltaX;
          }
          winZone.value -= deltaX;
          heroStart.y = snapToPlaftormY(heroStart.x, entities.value, BASE_HERO.w, BASE_HERO.h);
        }
        clampViewport();
        render();
        return;
      }

      if (drag.type === "moveLine") {
        const newX = Math.round(drag.originalX + (gx - drag.startGame.gx));
        winZone.value = newX;
        clampViewport();
        render();
        return;
      }

      if (drag.type === "move") {
        const dx = gx - drag.startGame.gx;
        const dy = gy - drag.startGame.gy;
        drag.entity.x = Math.round(drag.original.x + dx);
        drag.entity.y = Math.round(drag.original.y + dy);
        render();
        return;
      }

      if (drag.type === "resize") {
        const ent = drag.entity;
        const orig = drag.original;

        if (drag.corner === "br") {
          ent.w = Math.max(1, Math.round(gx - orig.x));
          ent.h = Math.max(1, Math.round(gy - orig.y));
        } else if (drag.corner === "bl") {
          ent.x = Math.round(Math.min(gx, orig.x + orig.w - 1));
          ent.w = Math.max(1, Math.round(orig.x + orig.w - ent.x));
          ent.h = Math.max(1, Math.round(gy - orig.y));
        } else if (drag.corner === "tr") {
          ent.w = Math.max(1, Math.round(gx - orig.x));
          ent.y = Math.round(Math.min(gy, orig.y + orig.h - 1));
          ent.h = Math.max(1, Math.round(orig.y + orig.h - (ent.y - orig.y + orig.y)));
          // Recalculate: the top-right corner means y+h stays fixed
          const topY = gy;
          const bottomY = orig.y;
          if (topY > bottomY) {
            ent.y = bottomY;
            ent.h = Math.round(topY - bottomY);
          }
        } else if (drag.corner === "tl") {
          const rightX = orig.x + orig.w;
          const bottomY = orig.y;
          ent.x = Math.round(Math.min(gx, rightX - 1));
          ent.w = Math.max(1, Math.round(rightX - ent.x));
          if (gy > bottomY) {
            ent.y = bottomY;
            ent.h = Math.round(gy - bottomY);
          }
        }
        render();
        return;
      }

      if (drag.type === "create") {
        drag.current = { gx, gy };
        render();
        return;
      }
    }

    function onMouseUp(e) {
      if (!drag) return;

      if (drag.type === "create" && drag.current) {
        const x = Math.round(Math.min(drag.startGame.gx, drag.current.gx));
        const y = Math.round(Math.min(drag.startGame.gy, drag.current.gy));
        const w = Math.round(Math.abs(drag.current.gx - drag.startGame.gx));
        const h = Math.round(Math.abs(drag.current.gy - drag.startGame.gy));

        if (w > 2 || h > 2) {
          const bases = {
            platform: BASE_PLATFORM,
            obstacle: BASE_OBSTACLE,
            wall: BASE_WALL,
          };
          const base = bases[drag.toolType];
          const ent = makeEntity(base, {
            x,
            y,
            w,
            h: drag.toolType === "platform" ? 1 : Math.max(h, 1),
          });
          entities.value.push(ent);
          selectedIndex.value = entities.value.length - 1;
        }
      }

      drag = null;
      if (canvas.value && spaceHeld) canvas.value.style.cursor = "grab";
      render();
    }

    function onWheel(e) {
      if (isPlaying.value) return;

      if (e.ctrlKey || e.metaKey) {
        // Zoom
        const { gx, gy } = getMouseGameCoords(e);
        const oldZoom = zoom.value;
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        zoom.value = Math.max(0.1, Math.min(5, zoom.value * delta));

        // Adjust viewport to zoom toward cursor
        viewport.x = gx - (gx - viewport.x) * (oldZoom / zoom.value);
        viewport.y = gy - (gy - viewport.y) * (oldZoom / zoom.value);
      } else {
        // Pan
        viewport.x += e.deltaX / zoom.value;
        viewport.y -= e.deltaY / zoom.value;
      }
      clampViewport();
      render();
    }

    function deleteSelected() {
      if (selectedIndex.value == null) return;
      const ent = entities.value[selectedIndex.value];
      if (ent.type === "hero") return; // Don't delete the hero
      entities.value.splice(selectedIndex.value, 1);
      selectedIndex.value = null;
      render();
    }

    // Space-to-pan state
    let spaceHeld = false;
    let toolBeforeSpace = null;

    function duplicateSelected() {
      if (selectedIndex.value == null || typeof selectedIndex.value !== "number") return;
      const ent = entities.value[selectedIndex.value];
      if (ent.type === "hero") return;
      const clone = deepClone(ent);
      clone.x += 20;
      clone.y += 20;
      entities.value.push(clone);
      selectedIndex.value = entities.value.length - 1;
      render();
    }

    function zoomTo(level) {
      const dpr = window.devicePixelRatio || 1;
      const cw = canvas.value ? canvas.value.width / dpr : 800;
      const ch = canvas.value ? canvas.value.height / dpr : 400;
      const cx = viewport.x + cw / zoom.value / 2;
      const cy = viewport.y + ch / zoom.value / 2;
      zoom.value = level;
      viewport.x = cx - cw / zoom.value / 2;
      viewport.y = cy - ch / zoom.value / 2;
      clampViewport();
      render();
    }

    function zoomToFit() {
      if (!canvas.value) return;
      const dpr = window.devicePixelRatio || 1;
      const cw = canvas.value.width / dpr;
      const ch = canvas.value.height / dpr;
      const bounds = getEntityBounds();
      const padding = 40;
      const contentW = bounds.maxX - bounds.minX + padding * 2;
      const contentH = bounds.maxY - bounds.minY + padding * 2;
      zoom.value = Math.min(cw / contentW, ch / contentH, 5);
      viewport.x = bounds.minX - padding;
      viewport.y = bounds.minY - padding;
      clampViewport();
      render();
    }

    function nudgeSelected(dx, dy) {
      if (selectedIndex.value == null || typeof selectedIndex.value !== "number") return;
      const ent = entities.value[selectedIndex.value];
      ent.x += dx;
      ent.y += dy;
      render();
    }

    // Keyboard shortcuts
    function onKeyDown(e) {
      if (isPlaying.value) return;
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

      const key = e.key;
      const ctrl = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;
      const step = shift ? 10 : 1;

      // Space = hold to pan
      if (key === " " && !spaceHeld) {
        e.preventDefault();
        spaceHeld = true;
        toolBeforeSpace = tool.value;
        if (canvas.value) canvas.value.style.cursor = "grab";
        return;
      }

      // Escape = deselect / cancel drag
      if (key === "Escape") {
        if (drag) {
          drag = null;
          render();
        } else {
          selectedIndex.value = null;
          render();
        }
        return;
      }

      // Delete / Backspace = delete selected
      if (key === "Backspace" || key === "Delete") {
        e.preventDefault();
        deleteSelected();
        return;
      }

      // Ctrl+D = duplicate
      if (ctrl && key.toLowerCase() === "d") {
        e.preventDefault();
        duplicateSelected();
        return;
      }

      // Ctrl+A = select all (no-op for now, prevent default)
      if (ctrl && key.toLowerCase() === "a") {
        e.preventDefault();
        return;
      }

      // Arrow keys = nudge selected
      if (key === "ArrowLeft") { e.preventDefault(); nudgeSelected(-step, 0); return; }
      if (key === "ArrowRight") { e.preventDefault(); nudgeSelected(step, 0); return; }
      if (key === "ArrowUp") { e.preventDefault(); nudgeSelected(0, step); return; }
      if (key === "ArrowDown") { e.preventDefault(); nudgeSelected(0, -step); return; }

      // Zoom: Ctrl+= / Ctrl+- / Ctrl+0
      if (ctrl && (key === "=" || key === "+")) { e.preventDefault(); zoomTo(zoom.value * 1.25); return; }
      if (ctrl && key === "-") { e.preventDefault(); zoomTo(zoom.value / 1.25); return; }
      if (ctrl && key === "0") { e.preventDefault(); zoomTo(1); return; }
      if (ctrl && key === "1") { e.preventDefault(); zoomToFit(); return; }

      // Tool shortcuts (no modifiers)
      if (!ctrl && !shift) {
        const k = key.toLowerCase();
        if (k === "v") tool.value = "select";
        else if (k === "p") tool.value = "platform";
        else if (k === "o") tool.value = "obstacle";
        else if (k === "w") tool.value = "wall";
        else if (k === "j") showJumpArc.value = !showJumpArc.value;
        else if (k === "g") showGhosts.value = !showGhosts.value;
        else if (k === "e") showExport.value = !showExport.value;
      }
    }

    function onKeyUp(e) {
      if (e.key === " ") {
        spaceHeld = false;
        if (toolBeforeSpace) {
          tool.value = toolBeforeSpace;
          toolBeforeSpace = null;
        }
        if (canvas.value) canvas.value.style.cursor = "default";
      }
    }

    // Play mode
    function togglePlay() {
      if (isPlaying.value) {
        stopPlay();
      } else {
        startPlay();
      }
    }

    function startPlay() {
      const hero = entities.value.find((e) => e.type === "hero");
      if (!hero) return;

      savedHeroPos = { x: hero.x, y: hero.y };
      isPlaying.value = true;

      // Build the level for the worker, starting camera where the editor has it
      const camStartX = Math.max(0, hero.x - 30);
      const camera = Object.assign({}, CAMERA, { x: camStartX, x0: camStartX });
      const winZoneEnt = makeEntity(BASE_WIN_ZONE, {
        x: winZone.value, y: 0, w: CAM_SIZE, h: CAM_SIZE,
      });
      const map = [camera, winZoneEnt, ...entities.value.map((e) => deepClone(e))];

      playWorker = new Worker(new URL("../game.worker.js", import.meta.url), {
        type: "module",
      });

      const playState = {
        up: false,
        showVectors: false,
        showGhosts: false,
        showCollisions: false,
      };

      playWorker.addEventListener("message", (e) => {
        const { event, response } = e.data;
        if (event === "loadGame") {
          playRender(response);
        }
        if (event === "requestFrame") {
          playRender(response);
        }
      });

      playWorker.postMessage({
        event: "loadGame",
        args: [{ config: { name: levelName.value }, map }],
      });

      playLoop = new Loop();
      playLoop.events.addEventListener("tick", (dt) => {
        playWorker.postMessage({
          event: "requestFrame",
          args: [{ ...playState, dt }],
        });
      });

      const handlePress = () => {
        playState.up = true;
        if (!playLoop.running) playLoop.start();
      };
      const handleRelease = (e) => {
        e.preventDefault();
        playState.up = false;
      };

      document.addEventListener("keydown", handlePress, { capture: true });
      document.addEventListener("keyup", handleRelease, { capture: true });
      document.addEventListener("touchstart", handlePress);
      document.addEventListener("touchend", handleRelease);

      // Store cleanup
      playWorker._cleanup = () => {
        document.removeEventListener("keydown", handlePress, { capture: true });
        document.removeEventListener("keyup", handleRelease, { capture: true });
        document.removeEventListener("touchstart", handlePress);
        document.removeEventListener("touchend", handleRelease);
      };
    }

    function playRender(data) {
      if (!canvas.value) return;
      const ctx = canvas.value.getContext("2d");
      const dpr = window.devicePixelRatio || 1;
      const cw = canvas.value.width / dpr;
      const ch = canvas.value.height / dpr;

      const camera = data.map.find((el) => el.type === "camera");
      if (!camera) return;

      // Record ghost track
      const playHero = data.map.find((el) => el.type === "hero");
      if (playHero) {
        currentGhostTrack.push({ x: playHero.x + playHero.w / 2, y: playHero.y + playHero.h / 2 });
      }

      // Center viewport on the camera
      viewport.x = camera.x - (cw / zoom.value - camera.w) / 2;
      viewport.y = -(ch / zoom.value - camera.h) / 2;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, cw, ch);
      ctx.fillStyle = "#f5f5f5";
      ctx.fillRect(0, 0, cw, ch);

      // Draw all editor entities at low opacity (full level context)
      const colorMap = {
        platform: "#6a8caf",
        obstacle: "#c0392b",
        hero: "#2c3e50",
        "win-zone": "#27ae60",
        wall: "#7f8c8d",
      };
      ctx.globalAlpha = 0.15;
      entities.value.forEach((ent) => {
        const sx = gameToScreenX(ent.x);
        const sy = gameToScreenY(ent.y + ent.h);
        const sw = ent.w * zoom.value;
        const sh = Math.max(ent.h * zoom.value, 2);
        ctx.fillStyle = colorMap[ent.type] || ent.color || "#333";
        ctx.fillRect(sx, sy, sw, sh);
      });
      ctx.globalAlpha = 1;

      // Game viewport rect in screen coords
      const vpLeft = gameToScreenX(camera.x);
      const vpTop = gameToScreenY(camera.h);
      const vpW = camera.w * zoom.value;
      const vpH = camera.h * zoom.value;

      // Draw game entities at full opacity, clipped to viewport
      ctx.save();
      ctx.beginPath();
      ctx.rect(vpLeft, vpTop, vpW, vpH);
      ctx.clip();

      // White background inside viewport
      ctx.fillStyle = "#f5f5f5";
      ctx.fillRect(vpLeft, vpTop, vpW, vpH);

      const drawables = data.map.filter(
        (el) => el.properties && el.properties.includes("drawable")
      );
      drawables.forEach((r) => {
        const sx = gameToScreenX(r.x);
        const sy = gameToScreenY(r.y + r.h);
        ctx.fillStyle = r.color || "#333";
        ctx.fillRect(sx, sy, r.w * zoom.value, Math.max(r.h * zoom.value, 1));
      });
      ctx.restore();

      // Viewport border (offset 1px outside so platforms at y=0 are visible)
      ctx.strokeStyle = "rgba(66, 185, 131, 0.5)";
      ctx.lineWidth = 3;
      ctx.strokeRect(vpLeft - 2, vpTop - 2, vpW + 4, vpH + 4);

      // Return to editor on death or win
      if (!data.state.isAlive || data.state.isWinner) {
        stopPlay();
      }

      ctx.restore();
      ctx.restore();
    }

    function stopPlay() {
      if (playLoop) {
        playLoop.stop();
        playLoop = null;
      }
      if (playWorker) {
        playWorker._cleanup();
        playWorker.terminate();
        playWorker = null;
      }
      // Save ghost track
      if (currentGhostTrack.length > 1) {
        ghostTracks.value.push([...currentGhostTrack]);
      }
      currentGhostTrack = [];

      if (savedHeroPos) {
        const hero = entities.value.find((e) => e.type === "hero");
        if (hero) {
          hero.x = savedHeroPos.x;
          hero.y = savedHeroPos.y;
        }
        savedHeroPos = null;
      }
      isPlaying.value = false;
      nextTick(() => render());
    }

    // (Level management functions are defined above with the level list model)

    // Export JSON
    const exportJson = computed(() => {
      const camera = Object.assign({}, CAMERA);
      const winZoneEnt = Object.assign({}, BASE_WIN_ZONE, {
        x: winZone.value, y: 0, w: CAM_SIZE, h: CAM_SIZE,
      });
      const map = [camera, winZoneEnt, ...entities.value.map((ent) => {
        const clean = {};
        const keys = ["type", "x", "y", "w", "h", "dx", "dy", "color", "properties"];
        for (const k of keys) {
          if (ent[k] !== undefined) clean[k] = ent[k];
        }
        // Hero exports at start (x=30 default offset, y snapped to platform)
        if (ent.type === "hero") {
          clean.x = 30;
          clean.y = heroStart.y;
        }
        return clean;
      })];

      return JSON.stringify(
        {
          config: {
            name: levelName.value,
            description: levelDescription.value,
            nextLevel: (() => {
              const lvl = editorLevels.value.find((l) => l.id === activeLevelId.value);
              if (!lvl || lvl.category !== "playable") return null;
              const playable = editorLevels.value.filter((l) => l.category === "playable");
              const idx = playable.indexOf(lvl);
              return idx < playable.length - 1 ? playable[idx + 1].name : null;
            })(),
          },
          map,
        },
        null,
        2
      );
    });

    function copyJson() {
      navigator.clipboard.writeText(exportJson.value);
      copied.value = true;
      setTimeout(() => (copied.value = false), 2000);
    }

    // Play link
    const playLinkCopied = ref(false);

    function buildLevelForExport(lvl) {
      const camera = Object.assign({}, CAMERA);
      const wz = Object.assign({}, BASE_WIN_ZONE, {
        x: lvl.winZone, y: 0, w: CAM_SIZE, h: CAM_SIZE,
      });
      const heroY = snapToPlaftormY(0, lvl.entities, BASE_HERO.w, BASE_HERO.h);
      const levelWidth = lvl.winZone + CAM_SIZE;
      const cloudEnts = clouds(80, 0, levelWidth, 150, CAM_SIZE, { color: "#dfdfdf" });
      const map = [camera, wz, ...cloudEnts, ...lvl.entities.map((ent) => {
        // Clone full entity so the game engine has everything it needs
        const full = deepClone(ent);
        if (full.type === "hero") {
          full.x = 30;
          full.y = heroY;
        }
        full.x0 = full.x0 || 0;
        full.y0 = full.y0 || 0;
        return full;
      })];
      return { config: {}, map };
    }

    function levelKey(name) {
      // Consistent key for level lookup (strip spaces, lowercase)
      return name.replace(/\s+/g, "_").toLowerCase();
    }

    function selectShareMode(mode) {
      shareMode.value = mode;
      showShareMenu.value = false;
      copyPlayLink();
    }

    function copyPlayLink() {
      saveCurrentLevel();

      let exported;
      if (shareMode.value === "all") {
        const playable = editorLevels.value.filter((l) => l.category === "playable");
        exported = playable.map((lvl, i) => {
          const built = buildLevelForExport(lvl);
          const key = levelKey(lvl.name);
          const nextKey = i < playable.length - 1 ? levelKey(playable[i + 1].name) : null;
          built.config = {
            name: lvl.name,
            key,
            description: lvl.description || "",
            nextLevel: nextKey,
          };
          return built;
        });
      } else {
        const lvl = editorLevels.value.find((l) => l.id === activeLevelId.value);
        if (!lvl) return;
        const built = buildLevelForExport(lvl);
        built.config = {
          name: lvl.name,
          key: levelKey(lvl.name),
          description: lvl.description || "",
          nextLevel: null,
        };
        exported = [built];
      }

      const json = JSON.stringify(exported);
      const b64 = btoa(unescape(encodeURIComponent(json)));
      const url = window.location.origin + "/#play=" + encodeURIComponent(b64);
      navigator.clipboard.writeText(url);
      playLinkCopied.value = true;
      setTimeout(() => (playLinkCopied.value = false), 2000);
    }

    function setProp(key, event) {
      if (selectedIndex.value == null) return;
      const raw = parseFloat(event.target.value);
      if (isNaN(raw)) return;
      const intKeys = ["x", "y", "w", "h"];
      entities.value[selectedIndex.value][key] = intKeys.includes(key) ? Math.round(raw) : raw;
      render();
    }

    function setColor(event) {
      if (selectedIndex.value == null) return;
      entities.value[selectedIndex.value].color = event.target.value;
      render();
    }

    function setLineProp(target, event) {
      const raw = parseInt(event.target.value, 10);
      if (isNaN(raw)) return;
      if (target === "winZone") {
        winZone.value = raw;
      }
      render();
    }

    function setColorText(event) {
      if (selectedIndex.value == null) return;
      const val = event.target.value.trim();
      if (/^#[0-9a-fA-F]{3,8}$/.test(val)) {
        entities.value[selectedIndex.value].color = val;
        render();
      }
    }

    // URL persistence
    function serializeEnts(ents) {
      return ents.map((ent) => {
        const o = { t: ent.type, x: ent.x, y: ent.y, w: ent.w, h: ent.h };
        if (ent.color && ent.color !== "#333333") o.c = ent.color;
        if (ent.dx !== undefined && ent.dx !== 0) o.dx = ent.dx;
        if (ent.dy !== undefined && ent.dy !== 0) o.dy = ent.dy;
        return o;
      });
    }

    function deserializeEnts(ents) {
      const baseMap = {
        platform: BASE_PLATFORM,
        obstacle: BASE_OBSTACLE,
        wall: BASE_WALL,
        hero: BASE_HERO,
      };
      return ents.map((o) => {
        const base = baseMap[o.t] || BASE_PLATFORM;
        const ent = makeEntity(base, { x: o.x, y: o.y, w: o.w, h: o.h });
        if (o.c) ent.color = o.c;
        if (o.dx !== undefined) ent.dx = o.dx;
        if (o.dy !== undefined) ent.dy = o.dy;
        return ent;
      });
    }

    let _saveTimer = null;
    function debouncedSaveToUrl() {
      if (_saveTimer) clearTimeout(_saveTimer);
      _saveTimer = setTimeout(saveToUrl, 300);
    }

    function saveToUrl() {
      saveCurrentLevel();
      const state = {
        active: activeLevelId.value,
        levels: editorLevels.value.map((l) => ({
          id: l.id,
          name: l.name,
          desc: l.description || undefined,
          cat: l.category,
          win: l.winZone,
          ents: serializeEnts(l.entities),
        })),
      };
      const json = JSON.stringify(state);
      const hash = btoa(unescape(encodeURIComponent(json)));
      history.replaceState(null, "", "#" + hash);
    }

    function loadFromUrl() {
      const hash = window.location.hash.slice(1);
      if (!hash) return false;
      try {
        const json = decodeURIComponent(escape(atob(hash)));
        const state = JSON.parse(json);

        // Support old single-level format
        if (state.ents) {
          entities.value = deserializeEnts(state.ents);
          levelName.value = state.name || "Untitled";
          levelDescription.value = state.desc || "";
          winZone.value = state.win || 1700;
          editorLevels.value[0].name = levelName.value;
          editorLevels.value[0].description = levelDescription.value;
          editorLevels.value[0].winZone = winZone.value;
          editorLevels.value[0].entities = deepClone(entities.value);
          heroStart.x = 0;
          heroStart.y = snapToPlaftormY(0, entities.value, BASE_HERO.w, BASE_HERO.h);
          return true;
        }

        // Multi-level format
        editorLevels.value = state.levels.map((l) => ({
          id: l.id,
          name: l.name,
          description: l.desc || "",
          category: l.cat || "playable",
          winZone: l.win || 1700,
          entities: deserializeEnts(l.ents),
        }));

        // Ensure IDs won't collide
        const maxNum = Math.max(0, ...editorLevels.value.map((l) => {
          const m = l.id.match(/^lvl_(\d+)$/);
          return m ? parseInt(m[1]) : 0;
        }));
        _nextId = maxNum + 1;

        const activeId = state.active || editorLevels.value[0]?.id;
        loadLevelById(activeId);
        return true;
      } catch {
        return false;
      }
    }

    // Canvas resize
    function resizeCanvas() {
      if (!canvas.value) return;
      const parent = canvas.value.parentElement;
      const dpr = window.devicePixelRatio || 1;
      const cssW = parent.clientWidth;
      const cssH = parent.clientHeight;
      canvas.value.width = cssW * dpr;
      canvas.value.height = cssH * dpr;
      canvas.value.style.width = cssW + "px";
      canvas.value.style.height = cssH + "px";
      render();
    }

    onMounted(() => {
      loadFromUrl();
      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);
      document.addEventListener("keydown", onKeyDown);
      document.addEventListener("keyup", onKeyUp);
    });

    onUnmounted(() => {
      window.removeEventListener("resize", resizeCanvas);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
      if (isPlaying.value) stopPlay();
    });

    watch([entities, showJumpArc, showGhosts, ghostTracks, zoom], () => render(), { deep: true });
    watch([entities, winZone, levelName, levelDescription, editorLevels], () => debouncedSaveToUrl(), { deep: true });

    return {
      canvas,
      tool,
      tools,
      showJumpArc,
      showExport,
      isPlaying,
      copied,
      levelName,
      levelDescription,
      selectedIndex,
      selectedEntity,
      viewport,
      availableLevels,
      exportJson,
      entities,
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onWheel,
      deleteSelected,
      togglePlay,
      copyJson,
      playLinkCopied,
      shareMode,
      showShareMenu,
      selectShareMode,
      copyPlayLink,
      heroStart,
      winZone,
      ghostTracks,
      showGhosts,
      setProp,
      setLineProp,
      setColor,
      setColorText,
      // Level list
      editorLevels,
      activeLevelId,
      playableLevels,
      hiddenLevels,
      dropTarget,
      dropPos,
      switchLevel,
      addNewLevel,
      importLevel,
      onLevelDragStart,
      onLevelDragOver,
      onLevelDrop,
      onSectionDragOver,
      onSectionDrop,
      onLevelDragEnd,
    };
  },
});
</script>

<style scoped>
.editor {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: #2a2a2a;
  border-bottom: 1px solid #444;
  flex-wrap: wrap;
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 4px;
}

.toolbar-btn-group {
  gap: 0;
}

.toolbar .toolbar-btn-group button {
  border-radius: 0;
  border-right: none;
}

.toolbar .toolbar-btn-group button:first-child {
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
}

.toolbar .toolbar-btn-group button:last-child {
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  border-right: 1px solid #555;
}

.toolbar-sep {
  width: 1px;
  height: 24px;
  background: #444;
  margin: 0 6px;
}

.toolbar-link {
  font-size: 11px;
  color: #888;
  text-decoration: none;
}

.toolbar-link:hover {
  color: #ccc;
  text-decoration: underline;
}

.toolbar-spacer {
  flex: 1;
}

.share-group {
  display: flex;
  position: relative;
}

.share-group .share-toggle {
  background: #3a3a3a;
  color: #999;
  border: 1px solid #555;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-right: none;
  padding: 4px 5px;
  font-size: 10px;
  cursor: pointer;
}

.share-group .share-toggle:hover {
  background: #4a4a4a;
}

.share-group .share-btn {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.share-menu {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  background: #2a2a2a;
  border: 1px solid #555;
  border-radius: 3px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  z-index: 50;
  min-width: 110px;
}

.share-menu button {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  background: none;
  border: none;
  color: #ccc;
  padding: 6px 12px;
  font-family: monospace;
  font-size: 12px;
  text-align: left;
  cursor: pointer;
}

.share-menu button:hover {
  background: #3a3a3a;
}

.toolbar button {
  background: #3a3a3a;
  color: #ccc;
  border: 1px solid #555;
  padding: 4px 10px;
  font-family: monospace;
  font-size: 12px;
  cursor: pointer;
  border-radius: 3px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.toolbar button:hover {
  background: #4a4a4a;
}

.toolbar button.active {
  background: #3498db;
  color: #fff;
  border-color: #2980b9;
}

.toolbar button:disabled {
  opacity: 0.4;
  cursor: default;
}

kbd {
  display: inline-block;
  font-family: monospace;
  font-size: 10px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 2px;
  padding: 0 3px;
  margin-left: auto;
  padding-left: 6px;
  line-height: 1.4;
  vertical-align: baseline;
  color: #777;
}

.active kbd {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.25);
  color: rgba(255, 255, 255, 0.7);
}

.toolbar-check {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  cursor: pointer;
}

.toolbar-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
}

.input-text {
  background: #333;
  border: 1px solid #555;
  color: #ccc;
  padding: 3px 6px;
  font-family: monospace;
  font-size: 12px;
  width: 120px;
  border-radius: 3px;
}

.input-number {
  background: #333;
  border: 1px solid #555;
  color: #ccc;
  padding: 3px 6px;
  font-family: monospace;
  font-size: 12px;
  width: 70px;
  border-radius: 3px;
}


.main-area {
  display: flex;
  flex: 1;
  min-height: 0;
}

/* Level sidebar (left) */
.level-sidebar {
  width: 180px;
  background: #2a2a2a;
  border-right: 1px solid #444;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.level-sections {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.level-section {
  min-height: 40px;
}

.level-section-header {
  font-size: 10px;
  text-transform: uppercase;
  color: #888;
  padding: 8px 10px 4px;
  letter-spacing: 0.5px;
}

.level-item {
  padding: 5px 10px;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  border-top: 2px solid transparent;
  border-bottom: 2px solid transparent;
}

.level-item:hover {
  background: #333;
}

.level-item.active {
  background: #3a3a3a;
  color: #fff;
  border-left: 2px solid #3498db;
}

.level-item.drop-above {
  border-top-color: #3498db;
}

.level-item.drop-below {
  border-bottom-color: #3498db;
}

.level-item-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.level-item-chain {
  font-size: 9px;
  color: #666;
  flex-shrink: 0;
}

.level-sidebar-actions {
  margin-top: auto;
  padding: 8px;
  border-top: 1px solid #444;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.level-add-btn,
.level-import-btn {
  background: #3a3a3a;
  color: #ccc;
  border: 1px solid #555;
  padding: 4px 8px;
  font-family: monospace;
  font-size: 11px;
  cursor: pointer;
  border-radius: 3px;
  width: 100%;
  text-align: center;
}

.level-add-btn:hover,
.level-import-btn:hover {
  background: #4a4a4a;
}

.import-wrap {
  position: relative;
}

.import-select {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.canvas-wrap {
  flex: 1;
  position: relative;
  overflow: hidden;
  min-width: 0;
}

.canvas-wrap canvas {
  display: block;
}

.status-bar {
  padding: 4px 10px;
  background: #2a2a2a;
  border-top: 1px solid #444;
  font-size: 11px;
  display: flex;
  justify-content: space-between;
  flex-shrink: 0;
}

.status-right {
  opacity: 0.6;
}

.export-panel {
  position: fixed;
  top: 50px;
  right: 20px;
  width: 500px;
  max-height: calc(100vh - 100px);
  background: #2a2a2a;
  border: 1px solid #555;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  z-index: 100;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.export-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-bottom: 1px solid #444;
  font-size: 13px;
}

.export-header button {
  background: #3a3a3a;
  color: #ccc;
  border: 1px solid #555;
  padding: 3px 10px;
  font-family: monospace;
  font-size: 11px;
  cursor: pointer;
  border-radius: 3px;
  margin-left: auto;
}

.export-header button:first-of-type {
  margin-left: auto;
}

.export-header button + button {
  margin-left: 4px;
}

.export-textarea {
  flex: 1;
  min-height: 300px;
  background: #1a1a1a;
  color: #aaa;
  border: none;
  padding: 10px;
  font-family: monospace;
  font-size: 11px;
  resize: none;
}

/* Sidebar */
.sidebar {
  width: 200px;
  background: #2a2a2a;
  border-left: 1px solid #444;
  overflow-y: auto;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  border-bottom: 1px solid #444;
}

.sidebar-type {
  font-size: 13px;
  font-weight: bold;
  text-transform: capitalize;
}

.sidebar-delete-section {
  margin-top: auto;
}

.sidebar-delete {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  background: #3a2020;
  color: #e88;
  border: 1px solid #633;
  padding: 6px 10px;
  font-family: monospace;
  font-size: 12px;
  cursor: pointer;
  border-radius: 3px;
}

.sidebar-delete:hover {
  background: #4a2525;
  border-color: #844;
}

.sidebar-section {
  padding: 8px 10px;
  border-bottom: 1px solid #333;
}

.sidebar-section-title {
  font-size: 10px;
  text-transform: uppercase;
  color: #888;
  margin-bottom: 6px;
  letter-spacing: 0.5px;
}

.prop-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.prop-label {
  font-size: 11px;
  color: #999;
  width: 20px;
  flex-shrink: 0;
}

.prop-input {
  flex: 1;
  background: #1a1a1a;
  border: 1px solid #444;
  color: #ccc;
  padding: 3px 6px;
  font-family: monospace;
  font-size: 12px;
  border-radius: 3px;
  width: 0;
}

.prop-input:focus,
.prop-textarea:focus {
  border-color: #3498db;
  outline: none;
}

.prop-input-full {
  width: 100%;
}

.prop-textarea {
  width: 100%;
  background: #1a1a1a;
  border: 1px solid #444;
  color: #ccc;
  padding: 4px 6px;
  font-family: monospace;
  font-size: 11px;
  border-radius: 3px;
  resize: vertical;
}

.color-row {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
}

.prop-color {
  width: 28px;
  height: 24px;
  border: 1px solid #444;
  border-radius: 3px;
  padding: 1px;
  background: #1a1a1a;
  cursor: pointer;
  flex-shrink: 0;
}

.prop-input-color-text {
  flex: 1;
  min-width: 0;
}

.prop-flags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.prop-flag {
  font-size: 10px;
  background: #333;
  border: 1px solid #444;
  padding: 1px 6px;
  border-radius: 3px;
  color: #aaa;
}
</style>
