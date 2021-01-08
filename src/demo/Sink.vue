<template>
  <div style="position: relative">
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
    <sink-sidebar :graph="graph" @toggleGroupNodes="toggleGroupNodes">
    </sink-sidebar>
  </div>
</template>

<script>
import Vue from 'vue'
import SinkSidebar from './SinkSidebar'
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
    SinkSidebar
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
</style>
