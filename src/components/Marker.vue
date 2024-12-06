<template>
    <g>
      <g v-if="!$slots.default" :transform="transform">
        <rect width="20" height="20"/>
      </g>
      <slot></slot>
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
    align: {
    type: String,
    default: 'center'
    },
    rotate: {
      type: Boolean,
      default: true // disable for slight performance increase
    },
  },
  data() {
    return {
      pos: { x: 0, y: 0 },
      size: { w: 0, h : 0 },
      angle: 0,
      zoom: 1
    }
  },
  mounted () {
    this.$nextTick(this.updatePosition)
  },
  computed: {
    transform: vm => `
      translate(${vm.pos.x} ${vm.pos.y})
      rotate(${vm.angle},${vm.size.w / vm.zoom},${vm.size.h / vm.zoom})
    `,
  },
  methods: {
    updatePosition () {
      const el = document.getElementById(this.edge.id)
      if (!el) return;
      const length = el.getTotalLength() * this.perc / 100
      this.pos = el.getPointAtLength(length)

      if (this.rotate) {
        const delta = el.getPointAtLength(length + 0.01)
        this.angle = Math.atan2(delta.y - this.pos.y, delta.x - this.pos.x) * radsToDeg;
      } else {
        this.angle = 0
      }

      this.zoom = this.$parent.zoom
      const box = this.$el.getBoundingClientRect()
      if (this.align === 'center') {
        this.size.w = box.width,
        this.size.h = box.height,
        this.pos.x -= box.width / 2 / this.zoom
        this.pos.y -= box.height / 2 / this.zoom
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