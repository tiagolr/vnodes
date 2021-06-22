<template>
  <div class="demo" id="group-demo">
    <div class="viewport">
      <screen ref="screen">
        <group v-if="groupNodes.length"
          :nodes="graph.nodes.filter(n => groupNodes.includes(n.id))"
          :padding="{
            left: parseInt(padding),
            right: parseInt(padding),
            top: parseInt(padding) + (label ? 50 : 0),
            bottom: parseInt(padding)
          }">
            <div v-if="label" class="group-label">
              Groups
            </div>
        </group>
        <edge v-for="edge in graph.edges" :data="edge" :nodes="graph.nodes" :key="edge.id">
        </edge>
        <node :data="node" ref="node" v-for="node in graph.nodes" :key="node.id">
        </node>
      </screen>
    </div>
    <div class="sidebar">
      <div class="checkboxes">
        <input type="checkbox" id="a" value="a" v-model="groupNodes">
        <span>A</span>
        <input type="checkbox" id="b" value="b" v-model="groupNodes">
        <span>B</span>
        <input type="checkbox" id="c" value="c" v-model="groupNodes">
        <span>C</span><br>
        <input type="checkbox" id="d" value="d" v-model="groupNodes">
        <span>D</span>
        <input type="checkbox" id="e" value="e" v-model="groupNodes">
        <span>E</span>
        <input type="checkbox" id="f" value="f" v-model="groupNodes">
        <span>F</span><br>
        <input type="checkbox" id="g" value="g" v-model="groupNodes">
        <span>G</span>
        <input type="checkbox" id="h" value="h" v-model="groupNodes">
        <span>H</span>
      </div>
      <div>
        <input type="checkbox" id="label" v-model="label">
        <span>Label</span>
      </div>
      <div>Padding {{padding}}</div>
      <input type="range" v-model="padding" min="10" max="50">
    </div>
  </div>
</template>

<script>
import Screen from '../components/Screen'
import Node from '../components/Node'
import Edge from '../components/Edge'
import Group from '../components/Group'
import graph from '../graph'

export default {
  components: {
    Screen,
    Node,
    Edge,
    Group,
  },
  data() {
    return {
      graph: new graph(),
      groupNodes: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
      padding: 10,
      label: true
    }
  },
  methods: {
  },
  mounted () {
    this.graph.createNode('a')
    this.graph.createNode('b')
    this.graph.createNode('c')
    this.graph.createNode({id: 'd', x: -51, y: 90})
    this.graph.createNode({id: 'e', x: -50, y: -100})
    this.graph.createNode({id: 'f', x: 290, y: -90})
    this.graph.createNode({id: 'g', x: 300, y: 95})
    this.graph.createNode({id: 'h', x: 200, y: 0})

    this.graph.createEdge('a', 'b', {fromAnchor: 'rect', toAnchor: 'rect'})
    this.graph.createEdge('a', 'c', {fromAnchor: 'rect', toAnchor: 'rect'})

    this.graph.graphNodes({ type: 'tree' })
    this.$nextTick(() => {
      this.$refs.screen.zoomNodes(this.graph.nodes, { scale: 0.9 })
    })
  },
}
</script>

<style scoped>
.checkboxes input {
  display: inline
}
.checkboxes label {
  display: inline;
  margin-right: 10px
}
</style>

<style>
.group-label {
  font-weight: bold;
  color: #fff;
  padding: 10px;
  margin: 0;
  background-color: #183e5280;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
</style>