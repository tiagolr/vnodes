<template>
  <div class="demo demo-sink">
    <div class="viewport">
      <screen ref="screen">
        <template #edges>
          <edge v-for="edge in graph.edges" :data="edge" :nodes="graph.nodes" :key="edge.id">
          </edge>
          <v-marker v-for="edge in graph.edges" :edge="edge" :offset="{x: -4, y:1}">
            <path style="fill:green;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:5.2" d="M2.936 1.722 1.57 2.51.204 3.3V.143L1.57.933z" transform="scale(6)"/>
          </v-marker>
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
import { Screen, Node, Edge, Group, Marker as VMarker, graph } from '../../index'

export default {
  components: {
    Screen,
    Node,
    Edge,
    Group,
    VMarker,
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

