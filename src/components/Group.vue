<template>
  <foreignObject
    class="group"
    :x="minX - padding.left"
    :y="minY - padding.top"
    :width="width + (padding.left + padding.right)"
    :height="height + (padding.top + padding.bottom)"
    @mousedown="onMousedown"
  >
    <div class="content" ref="content">
      <slot>
      </slot>
    </div>
  </foreignObject>
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
      type: Object,
      default: () => ({ left: 10, right: 10, top: 10, bottom: 10 })
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
.group .content
  width: 100%
  height: 100%
  position absolute
  border-radius 7px
  background-color: rgba(100, 100, 100, .25)
  display inline-block
</style>