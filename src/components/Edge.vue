<template>
  <path class="edge" :d="path">
  </path>
</template>

<script>
import { intersect } from 'mathjs'
const Victor = require('victor');
export default {
  props: {
    data: { // graph edge referece
      type: Object,
      required: true
    },
    nodes: { // graph nodes reference
      type: Array,
      required: true
    }
  },
  computed: {
    fromNode: vm => vm.nodes.find(n => n.id === vm.data.from),
    toNode: vm => vm.nodes.find(n => n.id === vm.data.to),
    fromAnchor: vm => vm.parseAnchor(vm.data.fromAnchor, vm.fromNode),
    toAnchor: vm => vm.parseAnchor(vm.data.toAnchor, vm.toNode),

    pos () {
      let x1 = this.fromNode.x + (this.fromAnchor.x || 0)
      let y1 = this.fromNode.y + (this.fromAnchor.y || 0)
      let x2 = this.toNode.x + (this.toAnchor.x || 0)
      let y2 = this.toNode.y + (this.toAnchor.y || 0)

      if (this.fromAnchor.snap) {
        if (this.fromAnchor.snap === 'circle') {
          const radius = Math.max(this.fromNode.width, this.fromNode.height) / 2
          const vec = new Victor(x2 - x1, y2 - y1).normalize()
          x1 += vec.x * radius
          y1 += vec.y * radius
        }
        if (this.fromAnchor.snap === 'rect') {
          const i = this.rectIntersect(x2, x1, y2, y1, this.fromNode)
          if (i) {
            x1 = i[0]
            y1 = i[1]
          }
        }
      }
      if (this.toAnchor.snap) {
        if (this.toAnchor.snap === 'circle') {
          const radius = Math.max(this.toNode.width, this.toNode.height) / 2
          const vec = new Victor(x2 - x1, y2 - y1).normalize()
          x2 -= vec.x * radius
          y2 -= vec.y * radius
        }
        if (this.toAnchor.snap === 'rect') {
          const i = this.rectIntersect(x1, x2, y1, y2, this.toNode)
          if (i) {
            x2 = i[0]
            y2 = i[1]
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

      if (this.data.type === 'hsmooth' || this.data.type === 'auto' && Math.abs(distX) >= Math.abs(distY)) {
        // add two horizontal control points
        const c1 = { x: pos.x1 - distX / 2, y: pos.y1 }
        const c2 = { x: pos.x2 + distX / 2, y: pos.y2 }
        pathd += ` C ${c1.x},${c1.y} ${c2.x},${c2.y} `
      }
      else if (this.data.type === 'vsmooth' || this.data.type === 'auto' && Math.abs(distY) > Math.abs(distX)) {
        // add two vertical control points
        const c1 = { x: pos.x1, y: pos.y1 - distY / 2 }
        const c2 = { x: pos.x2, y: pos.y2 + distY / 2 }
        pathd += ` C ${c1.x},${c1.y} ${c2.x},${c2.y} `
      }

      pathd += ` ${pos.x2} ${pos.y2}`
      return pathd
    },
  },
  methods: {
    /**
     * {
     *    x,      coordinates of the anchor relative to the node,
     *    y,      in pixels or percentages
     *    align,  'center', 'top', 'bottom'... shorthand for x,y bounding box positioning
     *    snap,   'circle' or 'rect' snaps to the bounding box or circle
     * }
     */
    parseAnchor(anchor, node) {
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

      if (pos.x.endsWith && pos.x.endsWith('%')) {
        pos.x = parseInt(pos.x) / 100 * node.width
      }
      if (pos.y.endsWith && pos.y.endsWith('%')) {
        pos.y = parseInt(pos.y) / 100 * node.height
      }

      return {
        x: pos.x,
        y: pos.y,
        snap
      }
    },
    rectIntersect(x1, x2, y1, y2, rect) {
      const box = [ rect.x, rect.y, rect.x + rect.width, rect.y + rect.height]
      const intersections = [
        intersect([x1, y1], [x2, y2], [box[0], box[1]], [box[0], box[3]]), // left
        intersect([x1, y1], [x2, y2], [box[0], box[1]], [box[2], box[1]]), // top
        intersect([x1, y1], [x2, y2], [box[2], box[1]], [box[2], box[3]]), // right
        intersect([x1, y1], [x2, y2], [box[0], box[3]], [box[2], box[3]]) // bottom
      ].filter(i => i &&
        i[0] + 0.01 >= box[0] && i[0] - 0.01 <= box[2] &&
        i[1] + 0.01 >= box[1] && i[1] - 0.01 <= box[3]
      )
      // order intersections by distance
      const start = new Victor(x1, y1)
      return intersections
        .map(i => [i[0], i[1], start.distance(new Victor(i[0], i[1]))])
        .sort((a, b) => a[2] < b[2] ? 1 : -1)
        .pop()
    }
  },
}
</script>

<style lang="stylus" scoped>
.edge
  stroke-width: 2
  stroke: green
  marker-end: url(#arrow-end)
  fill: none
</style>
