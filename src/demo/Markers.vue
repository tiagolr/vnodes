<template>
  <div id="markers-demo" class="demo">
    <div class="viewport">
      <screen ref="screen" v-if="visible">
        <template #edges>
          <edge v-for="(edge, i) in edges" :key="i" :data="edge" :nodes="nodes">
          </edge>
          <v-marker :edge="edges[0]" :perc="parseInt(perc)">
          </v-marker>
          <text x="350" y="155" class="small">#arrow-start, #arrow-end</text>
          <text x="350" y="205" class="small">#square</text>
          <text x="350" y="255" class="small">#circle</text>
          <text x="350" y="305" class="small">#cross</text>
          <text x="350" y="355" class="small">#arrow-slim-start, #arrow-slim-end</text>
        </template>
      </screen>
    </div>
    <div class="sidebar">
      <div>Position {{ perc }}</div>
      <input type="range" v-model="perc" min="0" max="100">
    </div>
  </div>
</template>

<script>
import Screen from '../components/Screen.vue'
import Node from '../components/Node.vue'
import Edge from '../components/Edge.vue'
import VMarker from '../components/Marker.vue'
import graph from '../graph'

export default {
  components: {
    Screen,
    Node,
    Edge,
    VMarker,
  },
  data() {
    return {
      perc: 50,
      graph: new graph(),
      color: '#00f',
      visible: true,
      nodes: [
        {id: '1a', x: 100, y: 150, width: 1, height: 1},
        {id: '1b', x: 300, y: 50 , width: 1, height: 1},
        {id: '2a', x: 100, y: 200, width: 1, height: 1},
        {id: '2b', x: 300, y: 200, width: 1, height: 1},
        {id: '3a', x: 100, y: 250, width: 1, height: 1},
        {id: '3b', x: 300, y: 250, width: 1, height: 1},
        {id: '4a', x: 100, y: 300, width: 1, height: 1},
        {id: '4b', x: 300, y: 300, width: 1, height: 1},
        {id: '5a', x: 100, y: 350, width: 1, height: 1},
        {id: '5b', x: 300, y: 350, width: 1, height: 1},
      ],
      edges: [
        { from: '1a', to: '1b', type: 'smooth' },
        { from: '2a', to: '2b', type: 'smooth' },
        { from: '3a', to: '3b', type: 'smooth' },
        { from: '4a', to: '4b', type: 'smooth' },
        { from: '5a', to: '5b', type: 'smooth' },
      ]
    }
  }
}
</script>

<style>
#markers-demo .edge {
  stroke: v-bind('color');
}
</style>