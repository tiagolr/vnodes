<template>
    <div :style="transform" class="label">
      <slot></slot>
    </div>
</template>

<script>
import Node from './Node.vue'
export default {
  components: {
    Node,
  },
  props: {
    edge: {
      type: Object,
      required: true
    },
    perc: { // position from 0 to 100 along the edge
      type: Number,
      default: 50
    },
    offset: {
      type: Object,
      default: () => ({x: 0, y: 0})
    },
    align: {
      type: String,
      default: 'center'
    },
    rotate: {
      type: Boolean,
      default: false
    },
    useDrag: {
      type: Boolean,
      default: false
    },
    connector: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      pos: { x: 0, y: 0 },
      node: {
        id: Math.random().toString(36).slice(2),
        x: 250,
        y: 0,
        width: 100,
        height: 100
      },
      angle: 0,
    }
  },
  mounted () {
    this.$nextTick(this.getPosition)
  },
  methods: {
    getPosition () {
      console.log('getting...')
      const el = document.getElementById(this.edge.id)
      if (!el) return;
      const length = el.getTotalLength() * this.perc / 100
      this.pos = el.getPointAtLength(length)

      if (this.rotate) {
        const delta = el.getPointAtLength(length + 0.01)
        this.angle = Math.atan2(delta.y - this.pos.y, delta.x - this.pos.x);
      } else {
        this.angle = 0
      }
    },
  },
  computed: {
    translate: vm => vm.align === 'top' ? 'translate(-50%, -100%)'
      : vm.align === 'bottom' ? 'translate(-50%, 0%)'
      : vm.align === 'left' ? 'translate(-100%, -50%)'
      : vm.align === 'right' ? 'translate(0, -50%)'
      : vm.align === 'top-left' ? 'translate(-100%, -100%)'
      : vm.align === 'top-right' ? 'translate(0%, -100%)'
      : vm.align === 'bottom-left' ? 'translate(-100%, 0%)'
      : vm.align === 'bottom-right' ? 'translate(0%, 0%)'
      : 'translate(-50%, -50%)',
    transform: vm => ({
      position: 'absolute',
      left: vm.pos.x + vm.offset.x + 'px',
      top: vm.pos.y + vm.offset.y + 'px',
      transformOrigin: '50% 50%',
      transform: `rotate(${vm.angle}rad) ${vm.translate}`
    })
  },
  watch: {
    edge: {
      deep: true,
      handler: 'getPosition'
    },
    perc: 'getPosition',
    rotate: 'getPosition'
  },
}
</script>

<style>
.label {
  background-color: #bbe4bb;
  border-radius: 8px;
}
</style>
