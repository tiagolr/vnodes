<template>
  <div class="sink">
    <div class="demo">
      <screen ref="screen">
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
.sink {
  position: relative;
  display: flex;
}
.demo {
  height: 500px;
}
.sidebar {
  padding-left: 20px;
  max-width: 300px
}
@media only screen and (max-width: 1000px) {
  .sink {
    flex-flow: column wrap;
  }
  .sidebar {
    max-width: 100%;
    width: 100%;
  }
}
</style>
