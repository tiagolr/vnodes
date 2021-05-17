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
    startOffset: Object, // { x, y }
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
      let el = this.$el
      if (this.$slots.default
          && this.$slots.default.length === 1
          && this.$slots.default[0].elm
          && this.$slots.default[0].elm.offsetWidth) {
        el = this.$slots.default[0].elm // if there is a single valid root in <slot> use it to calc offset
      }
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
