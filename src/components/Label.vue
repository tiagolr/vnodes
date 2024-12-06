<template>
  <div class="label">
    <node
      ref="node"
      :data="node"
      :useDrag="useDrag"
      :style="nodeTransform"
      @drag="e => $emit('drag', e)"
    >
      <slot>
      </slot>
    </node>
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
      const el = document.getElementById(this.edge.id)
      if (!el) return;
      const length = el.getTotalLength() * this.perc / 100
      this.pos = el.getPointAtLength(length)

      if (this.rotate) {
        // const delta = el.getPointAtLength(Math.min(length + 0.01), el.getTotalLength)
        const delta = el.getPointAtLength(length + 0.01)
        this.angle = Math.atan2(delta.y - this.pos.y, delta.x - this.pos.x);
      } else {
        this.angle = 0
      }
    },
    updateNodePos () {
      const align =  { x: 0, y: 0}
      if (this.align === 'center') { align.x = this.node.width / 2; align.y = this.node.height / 2; }
      else if (this.align === 'top') align.x = this.node.width / 2
      else if (this.align === 'top-right') align.x = node.width;
      else if (this.align === 'left') align.y = this.node.height / 2;
      else if (this.align === 'right') { align.x = this.node.width; align.y = this.node.height / 2; }
      else if (this.align === 'bottom-left') { align.y = this.node.height }
      else if (this.align === 'bottom') { align.x = this.node.width / 2; align.y = this.node.height }
      else if (this.align === 'bottom-right') { align.x = this.node.width; align.y = this.node.height }

      this.node.x = this.pos.x + this.offset.x - align.x
      this.node.y = this.pos.y + this.offset.y - align.y
    },
  },
  computed: {
    nodeTransform: vm => `
        transform-origin: 50% 50%;
        transform: rotate(${vm.angle}rad);`,
  },
  watch: {
    edge: {
      deep: true,
      handler: 'getPosition'
    },
    perc: 'getPosition',
    pos: 'updateNodePos',
    'node.width': 'updateNodePos',
    'node.height': 'updateNodePos',
    'offset': 'updateNodePos',
    'offset': 'updateNodePos',
    'align': 'updateNodePos',
    'rotate': 'getPosition'
  },
}
</script>

<style>
.label .node {
  background-color: #bbe4bb;
}
</style>
