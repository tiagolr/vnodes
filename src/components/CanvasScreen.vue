<script>
import { Application, Graphics } from 'pixi.js'
import { Viewport } from 'pixi-viewport'
import { TinyEmitter } from 'tiny-emitter'
export default {
  props: {
    zoomMin: {
      type: Number,
      default: 0.1
    },
    zoomMax: {
      type: Number,
      default: 10
    },
    nodes: {
      type: Array,
      default: () => []
    },
    edges: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      canvas: {
        app: null,
        viewport: null,
      },
      emitter: new TinyEmitter()
    }
  },
  provide () {
    return {
      canvas: this.canvas,
      emitter: this.emitter
    }
  },
  async mounted () {
    const app = new Application()
    await app.init({
      view: this.$refs.canvas,
      background: 0xffffff,
    })
    this.canvas.app = app
    window.vm = this

    const viewport = new Viewport({
      screenWidth: this.$refs.canvas.width,
      screenHeight: this.$refs.canvas.height,
      events: app.renderer.events,
      passiveWheel: false,
    })
    this.canvas.viewport = viewport

    app.stage.addChild(viewport)

    viewport
      .drag()
      .pinch()
      .wheel()
      .decelerate()

    this.emitter.emit('ready')
  },
  methods: {
  }
}
</script>

<template>
  <canvas ref="canvas"
  ></canvas>
  <slot></slot>
</template>


<style scoped>
canvas {
  width: 100%;
  height: 100%;
  outline: none;
  border: 1px solid #ccc;
}
</style>