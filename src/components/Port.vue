<template>
  <span class="port">
    <svg :width="radius * 2 + strokeWidth" :height="radius * 2 + strokeWidth">
      <circle
        :r="10"
        :cx="10 + 2 / 2"
        :cy="10 + 2 / 2"
        :stroke-width="2"
        :fill="'green'"
      ></circle>
    </svg>
  </span>
</template>

<script>
export default {
  props: {
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
    updateOffset () {
      // calculate html offset of this element
      this.offset = { x: 0, y: 0 }
      let el = this.$el
      while (el) {
        this.offset.x += el.offsetLeft || 0
        this.offset.y += el.offsetTop || 0
        el = el.offsetParent
      }
      // update edges anchor to the offset of this element
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
