<template>
  <span class="port">
    <slot></slot>
  </span>
</template>

<script>
import util from "../util";

/**
 * Offsets edges to its position when placed inside a node
 */
export default {
  props: {
    id: String, // optional id
    startOffset: Object, // {x, y}, contents center if null
    edgesFrom: {
      type: Array,
      default: () => []
    },
    edgesTo: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      offset: { x: 0, y: 0 },
      position: util.isSafari() ? 'static': 'relative'
    }
  },
  watch: {
    edgesFrom: 'updatePosition',
    edgesTo: 'updatePosition',
  },
  mounted () {
    this.updatePosition()
  },
  methods: {
    /**
     * Calculate html offset of this element
     * and update edges anchors to this element offset
     */
    updatePosition () {
      this.offset = this.startOffset || {
        x: this.$el.offsetWidth / 2,
        y: this.$el.offsetHeight / 2,
      }
      const rectPort = this.$el.getBoundingClientRect()
      const rectNode = this.$el.closest('.screen').querySelector('edges').getBoundingClientRect()
      const diffx = rectPort.left - rectNode.left
      const diffy = rectPort.top - rectNode.top

      const panzoom = this.$el.closest(".svg-pan-zoom_viewport")
      if (!panzoom) {
        console.debug('port failed to find panzoom container')
        return
      }

      const zoom = new DOMMatrix(window.getComputedStyle(panzoom).transform).a
      this.offset.x += diffx / zoom
      this.offset.y += diffy / zoom

      this.edgesFrom.forEach(edge => {
        Object.assign(edge.fromAnchor, this.offset)
      })
      this.edgesTo.forEach(edge => {
        Object.assign(edge.toAnchor, this.offset)
      })
    }
  },
}
</script>

<style>
.port {
  position: v-bind("position");
}
</style>