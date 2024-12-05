<template>
  <div class="demo demo-sink">
    <div class="viewport">
      <screen ref="screen">
        <template #edges>
          <edge v-for="edge in graph.edges" :data="edge" :nodes="graph.nodes" :key="edge.id">
          </edge>
        </template>
        <template #nodes>
          <group v-if="groupNodes" :nodes="$refs.sidebar.filterNodes || graph.nodes">
          </group>
          <node v-for="node in graph.nodes" :data="node" :key="node.id" :drag-threshold="2">
          </node>
        </template>
      </screen>
    </div>
    <sink-sidebar class="sidebar" :graph="graph" @toggleGroupNodes="toggleGroupNodes" ref="sidebar">
    </sink-sidebar>
  </div>
</template>

<script>
import SinkSidebar from './SinkSidebar.vue'
import { Screen, Node, Edge, Group, graph } from '../../index'

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
.demo-sink * {
  user-select: none;
  -webkit-user-select: none;
  cursor: default;
}
</style>

