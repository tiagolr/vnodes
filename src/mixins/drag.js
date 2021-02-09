/**
 * Adds drag behavior to Vue component
 * @drag event emmited
 */
export default {
  props: {
    dragThreshold: {
      type: Number,
      default: 10
    }
  },
  data () {
    return {
      drag: {
        zoom: 1,
        active: false,
        threshold: {
          x: 0,
          y: 0,
          crossed: false
        }
      }
    }
  },
  beforeDestroy () {
    document.removeEventListener('mousemove', this.applyDrag)
    document.removeEventListener('mouseup', this.stopDrag)
  },
  methods: {
    preventClicks (e) {
      if (this.drag.threshold.crossed) {
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()
        document.removeEventListener('click', this.preventClicks, true)
      }
    },
    startDrag () {
      let parent = this.$parent
      while (parent) {
        if (parent.panzoom) {
          this.drag.zoom = parent.panzoom.getZoom()
          break;
        }
        parent = parent.$parent
      }
      this.drag.active = true
      this.drag.threshold = {x: 0, y: 0, crossed: false}
      document.addEventListener('mouseup', this.stopDrag)
      document.addEventListener('mousemove', this.applyDrag)
      document.addEventListener('click', this.preventClicks, true)
    },
    stopDrag () {
      this.drag.active = false
      document.removeEventListener('mouseup', this.stopDrag)
      document.removeEventListener('mousemove', this.applyDrag)
    },
    applyDrag (e) {
      let x = e.movementX / this.drag.zoom
      let y = e.movementY / this.drag.zoom

      if (!this.drag.threshold.crossed) {
        if (Math.abs(this.drag.threshold.x) < this.dragThreshold && Math.abs(this.drag.threshold.y) < this.dragThreshold) {
          this.drag.threshold.x += x
          this.drag.threshold.y += y
          return // don't apply drag until threshold is reached
        } else {
          this.drag.threshold.crossed = true
          x += this.drag.threshold.x
          y += this.drag.threshold.y
        }
      }

      this.$emit('drag', { x, y })
    },
  }
}
