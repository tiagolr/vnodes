<template>
  <g class="label">
    <node data="node" :useDrag="false">
      <slot>
      </slot>
    </node>
  </g>
</template>

<script>
import Node from './Node'
export default {
  components: {
    Node,
  },
  props: {
    edge: {
      type: Object,
      required: true // { id, pathd } required
    },
    perc: {
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
    // rotate: {
    //   type: Boolean,
    //   default: false
    // },
    // useDrag: {
    //   type: Boolean,
    //   default: false
    // },
    // connector: {
    //   type: Boolean,
    //   default: false,
    // }
  },
  data() {
    return {
      pos: { x: 0, y: 0 },
      node: { x: 0, y: 0, width: 100, heigth: 100},
      angle: 0,
    }
  },
  mounted () {
    if (typeof this.edge.pathd !== 'string') {
      console.warn(this.edge, 'edge does not have `pathd:string` defined')
    }
    if (!this.edge.id) {
      throw 'edge must have property `id:string` defined'
    }
    this.$nextTick(this.getPosition)
  },
  methods: {
    getPosition () {
      console.log('getting position')
      const el = document.getElementById(this.edge.id)
      if (!el) {
        throw `element not found: ${this.edge.id}`
      }
      const length = el.getTotalLength() * perc / 100
      this.pos = el.getPointAtLength(length)
    },
    updateNodePos () {
      console.log('Updating node pos')
      const align =  { x: 0, y: 0}
      if (this.align === 'center') { align.x = node.width / 2; align.y = node.height / 2; }
      else if (this.align === 'top') align.x = node.width / 2
      else if (this.align === 'top-right') align.x = node.width
      else if (this.align === 'left') align.y = node.heigth / 2;
      else if (this.align === 'right') { align.x = node.width; align.y = node.height / 2; }
      else if (this.align === 'bottom-left') { align.y = node.height }
      else if (this.align === 'bottom') { align.x = node.width / 2; align.y = node.height }
      else if (this.align === 'bottom-right') { align.x = node.width; align.y = node.height }

      this.node.x = this.pos.x + this.offset.x + align.x
      this.node.y = this.pos.y + this.offset.y + align.y

      // if (this.rotate) {
      //   this.angle = 0 // TODO
      // }
    }
  },
  watch: {
    edge: {
      deep: true,
      handler: 'getPosition'
    },
    perc: 'getPosition',
    pos: 'updateNodePos',
    'node.width': 'updateNodePos',
    'node.heigth': 'updateNodePos'
  },
}
</script>

<style lang="stylus">

</style>