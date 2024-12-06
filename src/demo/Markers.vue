<template>
  <div id="markers-demo" class="demo">
    <div class="viewport">
      <screen ref="screen" v-if="visible">
        <template #edges>
          <edge v-for="(edge, i) in edges" :key="i" :data="edge" :nodes="nodes">
          </edge>

          <v-marker :edge="edges[0]" :perc="100">
            <path :style="`fill:${color};stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:5.2`" d="M2.936 1.722 1.57 2.51.204 3.3V.143L1.57.933z" transform="scale(6)"/>
          </v-marker>
          <v-marker :edge="edges[0]" :perc="0">
            <path :style="`fill:${color};stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:5.2`" d="m.008 2.65 2.636-1.331L5.281-.015v5.332L2.644 3.983Z" transform="scale(3.5)"/>
          </v-marker>

          <v-marker :edge="edges[1]" :perc="100">
            <rect x="0" y="0" width="15" height="15" :fill="color"/>
          </v-marker>
          <v-marker :edge="edges[1]" :perc="0">
            <rect x="0" y="0" width="15" height="15" :fill="color"/>
          </v-marker>

          <v-marker :edge="edges[2]" :perc="100">
            <circle cx="8" cy="8" r="8" :fill="color"/>
          </v-marker>
          <v-marker :edge="edges[2]" :perc="0">
            <circle cx="8" cy="8" r="8" :fill="color"/>
          </v-marker>

          <v-marker :edge="edges[3]" :perc="100" :offset="{x:0, y: -1}">
            <path :stroke="color" d="M10.875 1.125L1.125 10.875M1.125 1.125L10.875 10.875" stroke="#090909" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" transform="scale(1.3)"/>
          </v-marker>
          <v-marker :edge="edges[3]" :perc="0" :offset="{x:0, y: -1}">
            <path :stroke="color" d="M10.875 1.125L1.125 10.875M1.125 1.125L10.875 10.875" stroke="#090909" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" transform="scale(1.3)"/>
          </v-marker>

          <v-marker :edge="edges[4]" :perc="100" :offset="{x:-7, y: 0}">
            <path :fill="color" d="M16.4142 16.4142C17.1953 15.6332 17.1953 14.3668 16.4142 13.5858L3.68629 0.857864C2.90524 0.0768158 1.63891 0.0768158 0.857864 0.857864C0.0768158 1.63891 0.0768158 2.90524 0.857864 3.68629L12.1716 15L0.857864 26.3137C0.0768158 27.0948 0.0768158 28.3611 0.857864 29.1421C1.63891 29.9232 2.90524 29.9232 3.68629 29.1421L16.4142 16.4142ZM14 17H15V13H14V17Z"/>

          </v-marker>
          <v-marker :edge="edges[4]" :perc="0" :offset="{x:7, y: 0}">
            <path :fill="color" d="M0.585786 16.4142C-0.195262 15.6332 -0.195262 14.3668 0.585786 13.5858L13.3137 0.857864C14.0948 0.0768158 15.3611 0.0768158 16.1421 0.857864C16.9232 1.63891 16.9232 2.90524 16.1421 3.68629L4.82843 15L16.1421 26.3137C16.9232 27.0948 16.9232 28.3611 16.1421 29.1421C15.3611 29.9232 14.0948 29.9232 13.3137 29.1421L0.585786 16.4142ZM3 17H2V13H3V17Z"/>
          </v-marker>

          <text x="350" y="155" class="small">triangle</text>
          <text x="350" y="205" class="small">square</text>
          <text x="350" y="255" class="small">circle</text>
          <text x="350" y="305" class="small">cross</text>
          <text x="350" y="355" class="small">arrow</text>
        </template>
      </screen>
    </div>
    <div class="sidebar">
      <!-- <div>Position {{ perc }}</div> -->
      <!-- <input type="range" v-model="perc" min="0" max="100"> -->
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
        {id: '1b', x: 300, y: 150 , width: 1, height: 1},
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
        { id: 'a1b1', from: '1a', to: '1b', type: 'smooth' },
        { id: 'a2b2', from: '2a', to: '2b', type: 'smooth' },
        { id: 'a3b3', from: '3a', to: '3b', type: 'smooth' },
        { id: 'a4b4', from: '4a', to: '4b', type: 'smooth' },
        { id: 'a5b5', from: '5a', to: '5b', type: 'smooth' },
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