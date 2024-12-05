<template>
  <div
    class="node-group"
    @mousedown="onMousedown"
    :style="groupStyle"
  >
    <slot>
    </slot>
  </div>
</template>

<script>
/** */
import drag from '../mixins/drag.js'
export default {
  mixins: [
    drag
  ],
  props: {
    nodes: {
      type: Array,
      default: () => []
    },
    padding: { // additional area covered by group besides nodes minxy, maxxy
      type: Object,
      default: () => ({ left: 10, right: 10, top: 10, bottom: 10 })
    },
    disableDrag: Boolean,
  },
  computed: {
    minX: vm => !vm.nodes.length ? 0 : vm.nodes.reduce((acc, node) => Math.min(acc, node.x), Infinity),
    maxX: vm => !vm.nodes.length ? 0 : vm.nodes.reduce((acc, node) => Math.max(acc, node.x + node.width), -Infinity),
    minY: vm => !vm.nodes.length ? 0 : vm.nodes.reduce((acc, node) => Math.min(acc, node.y), Infinity),
    maxY: vm => !vm.nodes.length ? 0 : vm.nodes.reduce((acc, node) => Math.max(acc, node.y + node.height), -Infinity),
    width: vm => vm.maxX - vm.minX,
    height: vm => vm.maxY - vm.minY,

    contentMargin: vm => vm.margin && ({
      margin: vm.margin + 'px',
      width: `calc(100% - ${vm.margin * 2}px)`,
      height: `calc(100% - ${vm.margin * 2}px)`
    }),

    groupStyle: vm => ({
      left: `${vm.minX - vm.padding.left}px`,
      top: `${vm.minY - vm.padding.top}px`,
      width: `${vm.width + vm.padding.left + vm.padding.right}px`,
      height: `${vm.height + vm.padding.top + vm.padding.bottom}px`
    })
  },
  methods: {
    onDrag ({ x,y }) {
      this.nodes.forEach(node => {
        node.x += x
        node.y += y
      })
    },
    onMousedown (e) {
      e.stopPropagation()
      if (!this.disableDrag) {
        e.preventDefault();
        this.startDrag(e);
      }
    }
  }
}
</script>

<style>
.node-group {
  position: absolute;
  display: inline-flex;
  border-radius: 7px;
  background-color: rgba(100, 100, 100, .25);
  display: inline-block;
}
</style>