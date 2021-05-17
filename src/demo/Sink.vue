<template>
  <div class="demo">
    <div class="viewport">
      <screen ref="screen" :markers="[]">
        <group v-if="groupNodes" :nodes="$refs.sidebar.filterNodes || graph.nodes">
        </group>

        <edge v-for="edge in graph.edges" :data="edge" :nodes="graph.nodes" :key="edge.id">
        </edge>

        <node v-for="node in graph.nodes" :data="node" :key="node.id">
        </node>
      </screen>
    </div>
    <sink-sidebar class="sidebar" :graph="graph" @toggleGroupNodes="toggleGroupNodes" ref="sidebar">
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
    },
  },
}
</script>

<style>
</style>

