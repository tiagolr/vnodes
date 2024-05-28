<script>
import { Application, Graphics } from 'pixi.js'
import { Viewport } from 'pixi-viewport'
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
    }
  },
  async mounted () {
    const app = new Application()
    await app.init({view: this.$refs.canvas })
    this.$refs.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
    })
    window.app = app
    window.vm = this

    const viewport = new Viewport({
      screenWidth: this.$refs.canvas.width,
      screenHeight: this.$refs.canvas.height,
      events: app.renderer.events
    })

    app.stage.addChild(viewport)

    viewport
      .drag()
      .pinch()
      .wheel()
      .decelerate()



    this.nodes.forEach(node => {
      const obj = new Graphics()
        .roundRect(node.x, node.y, node.width, node.height , 20)
        .fill(0xff0000);
      viewport.addChild(obj)
    })

  },
  methods: {
  }
}
</script>

<template>
  <canvas ref="canvas"
  ></canvas>
</template>


<style scoped>
canvas {
  width: 100%;
  height: 100%;
  outline: none;
  border: 1px solid #ccc;
}
</style>