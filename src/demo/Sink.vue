<template>
  <div style="position: relative">
    <div class="demo">
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
.demo {
  display: inline-block;
  width: calc(100% - 250px);
  height: 500px;
}
.sidebar {
  display: inline-block;
  width: 250px
}
@media only screen and (max-width: 600px) {
  .demo {
    width: 100%
  }
  .sidebar {
    width: 100%
  }
}
</style>
