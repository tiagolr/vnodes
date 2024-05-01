<script>
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
      canvas: null,
      ctx: null,
      transform: {
        x: 0,
        y: 0,
        zoom: 1,
      },
      drag: {
        active: false,
        startX: 0,
        startY: 0,
        pinchDist: null, // distance used for pinch gesture
        pinchZoom: 0
      }
    }
  },
  mounted () {
    window.vm = this
    this.canvas = this.$refs.canvas
    this.ctx = this.canvas.getContext('2d')
    this.resize()
    this.canvas.addEventListener('mousedown', this.onMouseDown)
    this.canvas.addEventListener('mouseup', this.onMouseUp)
    this.canvas.addEventListener('mousemove', this.onMouseMove)
    this.canvas.addEventListener('wheel', this.onWheel)
    this.canvas.addEventListener('touchstart', this.onTouchStart)
    this.canvas.addEventListener('touchend', this.onTouchEnd)
    this.canvas.addEventListener('touchmove', this.onTouchMove)
    window.addEventListener('resize', this.resize)
  },
  unmounted () {
    this.canvas.removeEventListener('mousedown', this.onMouseDown)
    this.canvas.removeEventListener('mouseup', this.onMouseUp)
    this.canvas.removeEventListener('mousemove', this.onMouseMove)
    this.canvas.removeEventListener('wheel', this.onWheel)
    this.canvas.removeEventListener('touchstart', this.onTouchStart)
    this.canvas.removeEventListener('touchend', this.onTouchEnd)
    this.canvas.removeEventListener('touchmove', this.onTouchMove)
    window.removeEventListener('resize', this.resize)
  },
  methods: {
    getEventLocation(e) {
      const target = e.currentTarget || e.srcElement
      const rect = target.getBoundingClientRect()

      if (e.touches) {
        return {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top
        }
      } else if (e.offsetX && e.offsetY) {
        return {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        }
      }
    },

    getTransformedPoint({x, y}) {
      return this.ctx.getTransform().invertSelf().transformPoint(new DOMPoint(x, y))
    },

    onTouchStart (e) {
      e.preventDefault()
      if (e.touches.length === 1) {
        this.drag.pinchDist = null
        this.onMouseDown(e)
      }
    },

    onTouchEnd (e) {
      if (e.touches.length === 1) this.onMouseUp(e)
    },

    onTouchMove (e) {
      if (e.touches.length === 1) {
        this.onMouseMove(e)
      } else if (e.touches.length === 2) {
        // PINCH GESTURE
        this.drag.active = false
        e.preventDefault()
        const target = e.currentTarget || e.srcElement
        const rect = target.getBoundingClientRect()
        const touch1 = { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top }
        const touch2 = { x: e.touches[1].clientX - rect.left, y: e.touches[1].clientY - rect.top }
        const dist = Math.sqrt((touch1.x - touch2.x) ** 2 + (touch1.y - touch2.y) ** 2)
        if (this.drag.pinchDist === null) {
          this.drag.pinchDist = dist
          this.drag.pinchZoom = this.transform.zoom
        } else {
          const location = { x: (touch1.x + touch2.x) / 2, y: (touch1.y + touch2.y) / 2}
          let zoom = dist / this.drag.pinchDist / (this.transform.zoom / this.drag.pinchZoom)
          const point = this.getTransformedPoint(location)
          const zoomDiff = this.ctx.getTransform().a * zoom
          if (zoomDiff < this.zoomMin || zoomDiff > this.zoomMax) {
            zoom = 1
          }

          this.ctx.translate(point.x, point.y)
          this.ctx.scale(zoom, zoom)
          this.ctx.translate(-point.x, -point.y)

          const transform = this.ctx.getTransform()
          this.transform.zoom = transform.a
          this.transform.x = transform.e
          this.transform.y = transform.f
          this.draw()
        }
      }
    },

    onMouseDown (e) {
      this.drag.active = true
      const location = this.getEventLocation(e)
      const point = this.getTransformedPoint(location)
      this.drag.startX = point.x
      this.drag.startY = point.y
    },

    onMouseUp () {
      this.drag.active = false
    },

    onMouseMove (e) {
      if (!this.drag.active) return
      e.preventDefault()
      const location = this.getEventLocation(e)
      if (!location) return // FIX out of viewport mouse move
      const point = this.getTransformedPoint(location)

      this.ctx.translate(point.x - this.drag.startX, point.y - this.drag.startY)
      const transform = this.ctx.getTransform()
      this.transform.x = transform.e
      this.transform.y = transform.f
      this.draw()
    },

    onWheel (e) {
      e.preventDefault()
      if (this.drag.active) return
      const location = this.getEventLocation(e)
      let zoom = e.deltaY < 0 ? 1.1 : 0.9;
      const point = this.getTransformedPoint(location)
      const zoomDiff = this.ctx.getTransform().a * zoom
      if (zoomDiff < this.zoomMin || zoomDiff > this.zoomMax) {
        zoom = 1
      }

      this.ctx.translate(point.x, point.y)
      this.ctx.scale(zoom, zoom)
      this.ctx.translate(-point.x, -point.y)

      const transform = this.ctx.getTransform()
      this.transform.zoom = transform.a
      this.transform.x = transform.e
      this.transform.y = transform.f
      this.draw()
    },


    resize () {
      this.canvas.width = this.canvas.offsetWidth
      this.canvas.height = this.canvas.offsetHeight
      this.draw()
    },

    draw () {
      const canvas = this.canvas;
      const ctx = this.ctx;
      const transform = this.transform;
      ctx.resetTransform()
      ctx.clearRect(0,0, canvas.width, canvas.height)
      ctx.translate( transform.x, transform.y )
      ctx.scale( transform.zoom, transform.zoom )

      ctx.fillStyle = "#991111"
      ctx.fillRect(-50+100,-50+100,100,100)

      ctx.fillStyle = "#eecc77"
      ctx.fillRect(-35+100,-35+100,20,20)
      ctx.fillRect(15+100,-35+100,20,20)
      ctx.fillRect(-35+100,15+100,70,20)

      ctx.fillStyle = '#276c73'
      ctx.beginPath();
      this.nodes.forEach(node => {
        ctx.roundRect(node.x, node.y, node.width, node.height, 1)
      })
      ctx.stroke()
    }
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