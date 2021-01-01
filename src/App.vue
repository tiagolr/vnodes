<template>
  <div id="app">
    <div style="width: 1000px; height: 800px;">
      <screen ref="screen">
        <group v-if="groupNodes" :nodes="graph.nodes">
        </group>

        <edge v-for="edge in graph.edges" :data="edge" :nodes="graph.nodes" :key="edge.id">
        </edge>

        <node v-for="node in graph.nodes" :data="node" :key="node.id">
        </node>
      </screen>
    </div>
    <Sidebar :graph="graph" @toggleGroupNodes="toggleGroupNodes">
    </Sidebar>
  </div>
</template>

<script>
import Vue from 'vue'
import Sidebar from './demo/Sidebar'
import Screen from './components/Screen'
import Node from './components/Node'
import Edge from './components/Edge'
import Group from './components/Group'
import graph from './graph'

export default {
  components: {
    Screen,
    Node,
    Edge,
    Group,
    Sidebar
  },
  data() {
    return {
      graph: new graph(),
      groupNodes: false,
    }
  },
  methods: {
    toggleGroupNodes(bool) {
      this.groupNodes = bool
    }
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
