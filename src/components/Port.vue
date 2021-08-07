<template>
  <span class="port">
    <slot></slot>
  </span>
</template>

<script>
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
      offset: { x: 0, y: 0 }
    }
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
      let el = this.$slots.default && this.$slots.default.length === 1
        && this.$slots.default[0].elm && this.$slots.default[0].elm.offsetWidth
        ? this.$slots.default[0].elm // there is a single valid html el in <slot />
        : this.$el
      this.offset = this.startOffset || {
        x: el.offsetWidth / 2,
        y: el.offsetHeight / 2,
      }
      while (el && !el.classList.contains('content')) {
        this.offset.x += el.offsetLeft || 0
        this.offset.y += el.offsetTop || 0
        el = el.offsetParent
      }
      this.edgesFrom.forEach(edge => {
        Object.assign(edge.fromAnchor, this.offset)
      })
      this.edgesTo.forEach(edge => {
        Object.assign(edge.toAnchor, this.offset)
      })
    }
  },
  watch: {
    edgesFrom: 'updatePosition',
    edgesTo: 'updatePosition',
  },
}
</script>

<style>
.port {
  position: relative;
}
</style>