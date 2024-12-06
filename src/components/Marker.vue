<template>
    <g>
      <g :transform="transform" ref="super">
        <slot></slot>
      </g>
    </g>
</template>

<script>
const radsToDeg = (180 / Math.PI)
export default {
  props: {
    edge: {
      type: Object,
      required: true
    },
    perc: { // position from 0 to 100 along the edge
      type: Number,
      default: 100
    },
    offset: {
      type: Object,
      default: () => ({ x: 0, y: 0 })
    },
    rotate: {
      type: Boolean,
      default: true // disable for slight performance gain
    },
  },
  data() {
    return {
      radsToDeg,
      pos: { x: 0, y: 0 },
      size: { w: 0, h : 0 },
      angle: 0,
      zoom: 1,
      box: {x: 0, y: 0, width: 100, height: 100}
    }
  },
  mounted () {
    this.$nextTick(this.updatePosition)
  },
  computed: {
    transform: vm => `
      translate(${vm.pos.x} ${vm.pos.y})
      rotate(${vm.angle * radsToDeg},${vm.box.x + vm.box.width / 2},${vm.box.y + vm.box.height / 2})
    `,
  },
  methods: {
    updatePosition () {
      const el = document.getElementById(this.edge.id)
      if (!el) return;
      const length = Math.max(el.getTotalLength() * this.perc / 100 - 0.01, 0)
      this.pos = el.getPointAtLength(length)

      if (this.rotate) {
        const delta = el.getPointAtLength(length + 0.01)
        this.angle = Math.atan2(delta.y - this.pos.y, delta.x - this.pos.x)
      } else {
        this.angle = 0
      }

      this.zoom = this.$parent.zoom
      this.box = this.$refs.super.getBBox()

      this.pos.x -= this.box.width / 2
      this.pos.y -= this.box.height / 2

      if (this.offset.x || this.offset.y) {
        this.pos.x += (this.offset.x * Math.cos(this.angle) - this.offset.y * Math.sin(this.angle))
        this.pos.y += (this.offset.x * Math.sin(this.angle) + this.offset.y * Math.cos(this.angle))
      }
    },
  },
  watch: {
    edge: {
      deep: true,
      handler: 'updatePosition'
    },
    '$parent.zoom': 'updatePosition',
    rotate: 'updatePosition',
    perc: 'updatePosition',
    align: 'updatePosition'
  },
}
</script>

<style scoped>

</style>