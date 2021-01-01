<template>
  <g @mousedown="onMousedown">
    <rect
      :x="minX - padding"
      :y="minY - padding"
      :width="width + padding * 2"
      :height="height + padding * 2"
      :rx="borderRadius"
      :ry="borderRadius"
    ></rect>
  </g>
</template>

<script>
import drag from '../mixins/drag'
export default {
  mixins: [
    drag
  ],
  props: {
    nodes: {
      type: Array,
      default: []
    },
    padding: {
      type: Number,
      default: 10
    },
    borderRadius: {
      type: Number,
      default: 10
    },
    disableDrag: false,
  },
  mounted () {
    this.$on('drag', ({ x, y }) => {
      this.nodes.forEach(node => {
        node.x += x
        node.y += y
      })
    })
  },
  computed: {
    minX: vm => !vm.nodes.length ? 0 : vm.nodes.reduce((acc, node) => Math.min(acc, node.x), Infinity),
    maxX: vm => !vm.nodes.length ? 0 : vm.nodes.reduce((acc, node) => Math.max(acc, node.x + node.width), -Infinity),
    minY: vm => !vm.nodes.length ? 0 : vm.nodes.reduce((acc, node) => Math.min(acc, node.y), Infinity),
    maxY: vm => !vm.nodes.length ? 0 : vm.nodes.reduce((acc, node) => Math.max(acc, node.y + node.height), -Infinity),
    width: vm => vm.maxX - vm.minX,
    height: vm => vm.maxY - vm.minY,
  },
  methods: {
    onMousedown (e) {
      e.stopPropagation()
      if (!this.disableDrag) {
        e.preventDefault();
        this.startDrag();
      }
    }
  }
}
</script>

<style lang="stylus">
rect
  fill ccc
  fill-opacity 0.2
</style>

// TODO
// Slots for labels, align html contents east west north south
// example align right
// .b {
//   widtH: 20px;
//   height: 20px;
//   background-color: blue;
//   position: absolute;
//   right: 0;
//   transform: translateX(100%)
// }