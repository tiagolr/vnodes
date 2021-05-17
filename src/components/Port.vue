<template>
  <span class="port">
    <slot></slot>
  </span>
</template>

<script>
/**
 * Use this component inside a node to offset a connector anchor into its position
 */
export default {
  props: {
    startOffset: Object, // { x, y } - defaults to port center
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
    this.updateOffset()
  },
  methods: {
    /**
     * Calculate html offset of this element
     * and update edges anchors to this element offset
     */
    updateOffset () {
      let el = this.$el
      this.offset = this.startOffset || {
        x: el.offsetWidth / 2,
        y: el.offsetHeight / 2
      }
      while (el) {
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
    edgesFrom: updateOffset,
    edgesTo: updateOffset,
  },
}
</script>

<style lang="stylus" scoped>
.port
  cursor pointer
</style>
