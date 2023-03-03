<template>
  <path class="edge" :d="path" :id="data.id" v-bind="$attrs">
  </path>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'
import util from '../util'
import Victor from 'victor'
export default {
  props: {
    data: { // graph edge referece
      type: Object,
      required: true // { from: String|Object, to: String|Object }
    },
    nodes: { // graph nodes reference
      type: Array,
    }
  },

  mounted () {
    if (typeof this.data.id === 'undefined') {
      if (this.$set) { // vue 2
        this.$set(this.data, 'id', uuidv4())
      } else { // vue 3
        this.data['id'] = uuidv4()
      }
    }
    if (typeof this.data.pathd === 'undefined') {
      if (this.$set) { // vue 2
        this.$set(this.data, 'pathd', '')
      } else { // vue 3
        this.data['pathd'] = ''
      }
    }
  },

  computed: {
    fromNode: vm => typeof vm.data.from === 'string'
      ? vm.nodes.find(n => n.id === vm.data.from)
      : vm.data.from,
    toNode: vm => typeof vm.data.to === 'string'
      ? vm.nodes.find(n => n.id === vm.data.to)
      : vm.data.to,
    fromAnchor: vm => vm.parseAnchor(vm.data.fromAnchor, vm.fromNode),
    toAnchor: vm => vm.parseAnchor(vm.data.toAnchor, vm.toNode),

    pos () {
      let x1 = this.fromNode.x + (this.fromAnchor.x || 0)
      let y1 = this.fromNode.y + (this.fromAnchor.y || 0)
      let x2 = this.toNode.x + (this.toAnchor.x || 0)
      let y2 = this.toNode.y + (this.toAnchor.y || 0)

      if (this.fromAnchor && this.fromAnchor.snap) {
        if (this.fromAnchor.snap === 'circle') {
          const radius = Math.max(this.fromNode.width, this.fromNode.height) / 2
          const vec = new Victor(x2 - x1, y2 - y1).normalize()
          x1 += vec.x * radius
          y1 += vec.y * radius
        }
        if (this.fromAnchor.snap === 'rect') {
          const i = util.lineRect(x2, x1, y2, y1, this.fromNode)
          if (i) {
            x1 = i.x
            y1 = i.y
          }
        }
      }
      if (this.toAnchor && this.toAnchor.snap) {
        if (this.toAnchor.snap === 'circle') {
          const radius = Math.max(this.toNode.width, this.toNode.height) / 2
          const vec = new Victor(x2 - x1, y2 - y1).normalize()
          x2 -= vec.x * radius
          y2 -= vec.y * radius
        }
        if (this.toAnchor.snap === 'rect') {
          const i = util.lineRect(x1, x2, y1, y2, this.toNode)
          if (i) {
            x2 = i.x
            y2 = i.y
          }
        }
      }
      return { x1, x2, y1, y2 }
    },

    path () {
      const pos = Object.assign({}, this.pos)
      let pathd = `M ${pos.x1},${pos.y1} `
      const distX = pos.x1 - pos.x2
      const distY = pos.y1 - pos.y2

      if (this.data.type === 'hsmooth' || this.data.type === 'smooth' && Math.abs(distX) >= Math.abs(distY)) {
        // add two horizontal control points
        const c1 = { x: pos.x1 - distX / 2, y: pos.y1 }
        const c2 = { x: pos.x2 + distX / 2, y: pos.y2 }
        pathd += ` C ${c1.x},${c1.y} ${c2.x},${c2.y} `
      }
      else if (this.data.type === 'vsmooth' || this.data.type === 'smooth' && Math.abs(distY) > Math.abs(distX)) {
        // add two vertical control points
        const c1 = { x: pos.x1, y: pos.y1 - distY / 2 }
        const c2 = { x: pos.x2, y: pos.y2 + distY / 2 }
        pathd += ` C ${c1.x},${c1.y} ${c2.x},${c2.y} `
      }
      else if (this.data.type === 'ortho' && Math.abs(distX) >= Math.abs(distY)) {
        // add two horizontal points
        const c1 = { x: pos.x1 - distX / 2, y: pos.y1 }
        const c2 = { x: pos.x2 + distX / 2, y: pos.y2 }
        pathd += ` ${c1.x},${c1.y} ${c2.x},${c2.y} `
      }
      else if (this.data.type === 'ortho' && Math.abs(distY) > Math.abs(distX)) {
        // add two vertical points
        const c1 = { x: pos.x1, y: pos.y1 - distY / 2 }
        const c2 = { x: pos.x2, y: pos.y2 + distY / 2 }
        pathd += ` ${c1.x},${c1.y} ${c2.x},${c2.y} `
      }

      pathd += ` ${pos.x2} ${pos.y2}`
      this.data.pathd = pathd;
      return pathd
    },
  },
  methods: {
    /**
     * anchor {
     *    x,      coordinates of the anchor relative to the node in pixels or percentage
     *    y,
     *    align,  'center', 'top', 'bottom'... shorthand for x,y bounding box positioning
     *    snap,   'circle' or 'rect' snaps to the bounding box or circle
     * }
     */
    parseAnchor(anchor, node) {
      if (!anchor) return { x: 0, y: 0 }
      let snap = anchor.snap
      let align = anchor.align
      let pos = { x: anchor.x || 0, y: anchor.y || 0 }

      if (typeof anchor === 'string') {
        if (anchor === 'rect' || anchor === 'circle') {
          snap = anchor
          pos = { x: '50%', y: '50%'}
        } else {
          align = anchor
        }
      }

      if (align) {
        if (align === 'center') pos = { x: '50%', y: '50%' }
        else if (align === 'left') pos = { x: 0, y: '50%' }
        else if (align === 'right') pos = { x: '100%', y: '50%' }
        else if (align === 'top') pos = { x: '50%', y: 0 }
        else if (align === 'top-left') pos = { x: 0, y: 0 }
        else if (align === 'top-right') pos = { x: '100%', y: 0 }
        else if (align === 'bottom') pos = { x: '50%', y: '100%'}
        else if (align === 'bottom-left') pos = { x: 0, y: '100%'}
        else if (align === 'bottom-right') pos = { x: '100%', y: '100%'}
        else throw new Error('unkown anchor align' + align)
      }

      if (pos.x.endsWith) { // convert pos string to number
        pos.x = pos.x.endsWith('%')
          ? parseInt(pos.x) / 100 * node.width
          : parseInt(pos.x)
      }
      if (pos.y.endsWith) { // convert pos string to number
        pos.y = pos.y.endsWith('%')
         ? parseInt(pos.y) / 100 * node.height
         : parseInt(pos.y)
      }

      return {
        x: pos.x,
        y: pos.y,
        snap
      }
    },

  },
}
</script>

<style scoped>
.edge {
  stroke-width: 4;
  stroke: green;
  /* marker-start: url(#arrow-start) */
  marker-end: url(#arrow-end);
  fill: none;
}
</style>
