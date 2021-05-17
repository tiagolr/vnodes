<template>
  <svg class="screen" ref="screen">
    <defs>
      <markers :markers="markers">
      </markers>
    </defs>
    <g>
      <slot>
      </slot>
    </g>
  </svg>
</template>

<script>
import Markers from './Markers'
import SvgPanZoom from '../../lib/svg-pan-zoom/svg-pan-zoom'
export default {
  props: {
    markers: {
      type: Array, // { id:String, type: 'arrow|circle|square|diamond', scale: Number, style: String }
      default: () => []
    }
  },
  components: {
    Markers
  },
  data() {
    return {
      panzoom: null,
    }
  },
  mounted () {
    this.panzoom = SvgPanZoom(this.$refs.screen, {
      dblClickZoomEnabled: false,
      mouseWheelZoomEnabled: true,
      preventMouseEventsDefault: false,
      fit: false,
      contain: false,
      center: false,
      zoomScaleSensitivity: 0.4,
      minZoom: 0.1,
      maxZoom: 5,
      onZoom: scale => this.$emit('panzoom', { scale }),
      onPan: pan => this.$emit('panzoom', ({ x: pan.x, y: pan.y })),
      onUserZoom: e => this.$emit('onuserzoom', e),
      onUserPan: e => this.$emit('onuserpan', e),
      onDoubleClick: () => this.$emit('ondoubleclick'),
      onUpdatedCTM: c => this.$emit('onctm', c)
    })

    this.panzoom.zoomRect = this.zoomRect
    this.panzoom.zoomNode = this.zoomNode
    this.panzoom.panNode = this.panNode
  },
  methods: {
    zoomTo ({x, y, scale}) {
      this.panzoom.zoom(scale)
      this.panzoom.pan( x,y )
    },
    /**
     * Centers and zooms a rectangle
     * @param rect { left, right, top, bottom }
     * @param scale force zoom to a specific value (eg: 1)
     */
    zoomRect (rect, scale=null) {
      const screen = this.$refs.screen
      const width = rect.right - rect.left
      const height = rect.bottom - rect.top
      if (!scale) {
        const dx = width / screen.clientWidth
        const dy = height / screen.clientHeight
        scale = 1 / Math.max(dx, dy)
      }
      const x = -rect.left * scale + ((screen.clientWidth / scale - width) / 2) * scale
      const y = -rect.top * scale + ((screen.clientHeight / scale - height) / 2) * scale

      this.panzoom.zoom(scale)
      this.panzoom.pan({ x, y })
    },
    zoomNode (node) {
      const screen = this.$refs.screen
      const marginX = screen.clientWidth / 2 - node.width / 2
      const marginY = screen.clientHeight / 2 - node.height / 2

      this.zoomRect({
        left: node.x - marginX,
        right: node.x + node.width + marginX,
        top: node.y - marginY,
        bottom: node.y + node.height + marginY
      })
    },
    /**
     * centers the view and zoom on a group nodes
     */
    zoomNodes (nodes, padding=50, scale=null) {
      if (!nodes || !nodes.length) {
        return
      }
      let left = Infinity
      let top = Infinity
      let right = -Infinity
      let bottom = -Infinity

      nodes.forEach(node => {
        if (node.x < left) left = node.x
        if (node.x + node.width > right) right = node.x + node.width
        if (node.y < top) top = node.y
        if (node.y + node.height > bottom) bottom = node.y + node.height
      })

      this.zoomRect({
        left: left - padding,
        top: top - padding,
        right: right + padding,
        bottom: bottom + padding,
      }, scale)
    },
    panNode (node, offsetX=0, offsetY=0) { // centers node on screen
      const zoom = this.panzoom.getZoom()
      const x = this.$el.clientWidth / 2 - (node.x + node.width / 2) * zoom + offsetX
      const y = this.$el.clientHeight / 2 - (node.y + node.height / 2) * zoom + offsetY
      this.panzoom.pan({ x, y })
    }
  },
}
</script>

<style lang="stylus" scoped>
#arrow-end
  fill red !important
.screen
  width 100%
  height 100%
  outline none
  border 1px solid #ccc
</style>
