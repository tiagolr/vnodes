<template>
  <div class="demo demo-sink">
    <div class="viewport">
      <screen ref="screen">
        <template #edges>
          <edge v-for="edge in graph.edges" :data="edge" :nodes="graph.nodes" :key="edge.id">
          </edge>
          <v-marker v-for="edge in graph.edges" :edge="edge" :offset="{x:-4, y: 0}">
            <path style="fill:green;stroke-linecap:round;stroke-linejoin:round;" d="M7.75 4.75L0.25 9.08013L0.25 0.419876L7.75 4.75Z" transform="scale(2)"/>
          </v-marker>
        </template>
        <template #nodes>
          <group v-if="groupNodes" :nodes="$refs.sidebar.filterNodes || graph.nodes">
          </group>
          <node v-for="node in graph.nodes" :data="node" :key="node.id">
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

