<template>
  <div class="demo" id="canvas-demo">
    <div class="viewport">
      <canvas-screen ref="screen" :nodes="graph.nodes" :edges="graph.edges">
      </canvas-screen>
    </div>
    <div class="sidebar">
      <div ref="fps" style="margin-bottom:10px"></div>
      <span>Node Count</span>
      <input type="number" v-model=nodeCount step="25">
    </div>
  </div>
</template>

<script>
import graph from '../graph'
import Stats from 'stats.js'
import CanvasScreen from '../components/CanvasScreen.vue'

export default {
  components: {
    CanvasScreen,
  },
  data() {
    return {
      graph: new graph(),
      nodeCount: 5000,
    }
  },
  methods: {
    makeGraph () {
      this.graph.reset();
      this.graph.createNode('0')
      for (let i=1; i < this.nodeCount; i++) {
        const parent = this.graph.nodes[Math.round(Math.random() * (this.graph.nodes.length - 1))]
        const node = this.graph.createNode({
          id: String(i),
          x: Math.random() * this.nodeCount * 4,
          y: Math.random() * this.nodeCount * 4,
          width: 50,
          height: 50
        })
        this.graph.createEdge(parent, node, { type: 'smooth' })
      }
    },
  },
  mounted () {
    this.makeGraph()
    const stats = new Stats()
    stats.setMode(1)
    stats.domElement.style.setProperty('position', 'relative')
    this.$refs.fps.appendChild(stats.domElement)
    function animate() {
      stats.begin()
      requestAnimationFrame(() => {
        stats.end()
        animate()
      })
    }
    animate()
  },
  watch: {
    nodeCount: 'makeGraph'
  }
}
</script>

<style>
#canvas-demo .node .content {
  /* background-color #14c56a */
  background-color: #47696e;
  color: white;
}
#canvas-demo .node:hover .content {
  background-color: red;
}
#canvas-demo .edge {
  stroke: #ccc;
  stroke-width: 4;
  marker-end: none;
}
#canvas-demo .edge:hover {
  stroke: red;
}
</style>