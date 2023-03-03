<template>
  <div class="demo" id="benchmark-demo">
    <div class="viewport">
      <screen ref="screen">
        <edge v-for="edge in graph.edges" :data="edge" :nodes="graph.nodes" :key="edge.id">
        </edge>
        <node :data="node" ref="node" v-for="node in graph.nodes" :key="node.id">
        </node>
      </screen>
    </div>
    <div class="sidebar">
      <div ref="fps" style="margin-bottom:10px"></div>
      <span>Node Count</span>
      <input type="number" v-model=nodeCount step="25">
    </div>
  </div>
</template>

<script>
import Screen from '../components/Screen.vue'
import Node from '../components/Node.vue'
import Edge from '../components/Edge.vue'
import graph from '../graph'
import Stats from 'stats.js'

export default {
  components: {
    Screen,
    Node,
    Edge,
  },
  data() {
    return {
      graph: new graph(),
      nodeCount: 100,
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
          x: Math.random() * this.nodeCount * 12,
          y: Math.random() * this.nodeCount * 12
        })
        this.graph.createEdge(parent, node, { type: 'smooth' })
      }
      this.$refs.screen.zoomNodes(this.graph.nodes)
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
#benchmark-demo .node .content {
  /* background-color #14c56a */
  background-color: #47696e;
  color: white;
}
#benchmark-demo .node:hover .content {
  background-color: red;
}
#benchmark-demo .edge {
  stroke: #ccc;
  stroke-width: 4;
  marker-end: none;
}
#benchmark-demo .edge:hover {
  stroke: red;
}
</style>