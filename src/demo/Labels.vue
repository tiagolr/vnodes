<template>
  <div class="demo">
    <div class="viewport">
      <screen ref="screen">
        <edge v-for="edge in graph.edges" :data="edge" :nodes="graph.nodes" :key="edge.id">
        </edge>
        <node :data="node" ref="node" v-for="node in graph.nodes" :key="node.id">
        </node>

        <v-label v-if="edges.length"
          :edge="edges[0]"
          :perc="parseInt(perc)"
          :offset="{x: parseInt(offsetX), y: parseInt(offsetY)}"
          :align="align"
          :rotate="rotate"
          :connector="connector"
          :useDrag="true"
          ref="label"
          @drag="onDrag">
            <div v-html="contents"></div>
        </v-label>
      </screen>
    </div>
    <div class="sidebar">
      <textarea rows="3" v-model="contents" @input="resizeLabel"></textarea>
      <div>Position {{ perc }}</div>
      <input type="range" v-model="perc" min="0" max="100">
      <div>Offset { x : {{ parseInt(offsetX) }}, y: {{ parseInt(offsetY) }} }</div>
      <input type="range" v-model="offsetX" min="-100" max="100">
      <input type="range" v-model="offsetY" min="-100" max="100">
      <div>Align</div>
      <select v-model="align">
        <option value="center">center</option>
        <option value="top">top</option>
        <option value="top-left">top-left</option>
        <option value="top-right">top-right</option>
        <option value="left">left</option>
        <option value="right">right</option>
        <option value="bottom">bottom</option>
        <option value="bottom-left">bottom-left</option>
        <option value="bottom-right">bottom-right</option>
      </select>
      <div><input type="checkbox" v-model="rotate"><span>Rotate</span></div>
      <div><input type="checkbox" v-model="connector"><span>Connector</span></div>
    </div>
  </div>
</template>

<script>
import Screen from '../components/Screen.vue'
import Node from '../components/Node.vue'
import Edge from '../components/Edge.vue'
import VLabel from '../components/Label.vue'
import graph from '../graph'

export default {
  components: {
    Screen,
    Node,
    Edge,
    VLabel
  },
  data() {
    return {
      graph: new graph(),
      perc: 50,
      offsetX: 0,
      offsetY: 0,
      align: 'center',
      rotate: false,
      connector: true,
      contents: '<small style="padding: 10px">Label</small>'
    }
  },
  computed: {
    nodes: vm => Object.values(vm.graph.nodes),
    edges: vm => Object.values(vm.graph.edges),
  },
  methods: {
    resizeLabel() {
      this.$refs.label.$refs.node.fitContent();
    },
    onDrag (d) {
      this.offsetX += d.x || 0
      this.offsetY += d.y || 0
      this.offsetX = Math.max(Math.min(this.offsetX, 100), -100)
      this.offsetY = Math.max(Math.min(this.offsetY, 100), -100)
    }
  },
  mounted () {
    this.graph.createNode('A')
    this.graph.createNode({
      id: 'B',
      x: 450,
      y: 100
    })
    this.graph.createEdge({
      from: 'A',
      to: 'B',
      fromAnchor: 'right',
      toAnchor: 'left',
      type: 'smooth'
    })

    this.$nextTick(() => {
      this.$refs.screen.zoomNodes(this.nodes)
    })
  }
}
</script>

<style>
/* // #benchmark-demo
//   .node .content
//     background-color: #47696e;
//     color: white;
//   .node:hover .content
//     background-color red
//   .edge
//     stroke #ccc
//     stroke-width 4
//     marker-end: none
//   .edge:hover
//     stroke: red */
</style>