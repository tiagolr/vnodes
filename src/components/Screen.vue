<template>
  <div class="screen">
    <svg ref="edges" class="edges">
      <slot>
      </slot>
    </svg>
    <div class="nodes" ref="nodes" style="overflow: hidden">
      <div class="nodes-inner" ref="nodesInner" style="width: 100%; height: 100%">
        <slot name="nodes">
        </slot>
      </div>
    </div>
    <svg ref="overflay" class="overlay">
    </svg>
  </div>
</template>

<script>
import SvgPanZoom from '../../lib/svg-pan-zoom/svg-pan-zoom.js'
export default {
  props: {
    options: {
      type: Object,
      default: () => ({})
    }
  },
  emits: [
    'dblclick',
    'zoom',
    'pan',
    'user-zoom',
    'user-pan',
    'ctm'
  ],
  data() {
    return {
      panzoom: null,
    }
  },
  mounted () {
    this.panzoom = SvgPanZoom(this.$refs.edges, Object.assign({
      dblClickZoomEnabled: false,
      mouseWheelZoomEnabled: true,
      preventMouseEventsDefault: true,
      controlIconsEnabled: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      fit: false,
      contain: false,
      center: false,
      zoomScaleSensitivity: 0.4,
      minZoom: 0.1,
      maxZoom: 5,
      onZoom: zoom => this.$emit('zoom', zoom),
      onPan: pan => this.$emit('pan', pan),
      onUserZoom: e => this.$emit('user-zoom', e),
      onUserPan: e => this.$emit('user-pan', e),
      onDoubleClick: e => this.$emit('dblclick', e),
      onUpdatedCTM: m => this.onUpdatedCTM(m)
    }, this.options))

    this.panzoom.zoomRect = this.zoomRect
    this.panzoom.zoomNode = this.zoomNode
    this.panzoom.panNode = this.panNode
  },
  methods: {
    zoomTo ({x, y, scale}) {
      this.panzoom.zoom(scale)
      this.panzoom.pan( x,y )
    },
    onUpdatedCTM (m) {
      const { a, b, c, d, e, f } = m;
      this.$refs.nodesInner.style.transform = `matrix(${a}, ${b}, ${c}, ${d}, ${e}, ${f})`

      this.$emit('ctm', m)
    },
    /**
     * Centers and zooms a rectangle
     * @param rect { left, right, top, bottom }
     * @param scale force zoom to a specific value (eg: 1)
     */
    zoomRect (rect, opts = {zoom: null}) {
      let zoom = opts.zoom
      const screen = this.$refs.edges
      const width = rect.right - rect.left
      const height = rect.bottom - rect.top
      if (!zoom) {
        const dx = width / screen.clientWidth
        const dy = height / screen.clientHeight
        zoom = 1 / Math.max(dx, dy)
      }
      const x = -rect.left * zoom + ((screen.clientWidth / zoom - width) / 2) * zoom
      const y = -rect.top * zoom + ((screen.clientHeight / zoom - height) / 2) * zoom

      this.panzoom.zoom(zoom)
      this.panzoom.pan({ x, y })
    },
    zoomNode (node) {
      const screen = this.$refs.edges
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
    zoomNodes (nodes, opts = { padding: 50, zoom: null }) {
      if (!nodes || !nodes.length) {
        return
      }
      const padding = opts.padding || 50
      const zoom = opts.zoom
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

      left -= padding
      top -= padding
      right += padding
      bottom += padding
      const rect = { left, top, right, bottom }

      this.zoomRect({...rect}, { zoom })
      return rect
    },

    panNode (node, opts = { offsetX, offsetY }) { // centers node on screen
      const offsetX = opts.offsetX || 0
      const offsetY = opts.offsetY || 0
      const zoom = this.panzoom.getZoom()
      const x = this.$el.clientWidth / 2 - (node.x + node.width / 2) * zoom + offsetX
      const y = this.$el.clientHeight / 2 - (node.y + node.height / 2) * zoom + offsetY
      this.panzoom.pan({ x, y })
    },

    getZoom () {
      return this.panzoom.getZoom()
    },

    getPan () {
      return this.panzoom.getPan()
    }
  },
}
</script>

<style>
.screen {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
.screen .edges, .screen .nodes, .screen .overlay {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
.screen .nodes, .screen .overlay, .screen .nodes .nodes-inner {
  pointer-events: none;
}
.screen .nodes-inner *, .screen .overlay * {
  pointer-events: auto;
}
.nodes-inner {
  transform-origin: top left;
  position: relative;
}
</style>
