<template>
  <div class="demo" id="markers-demo">
    <div class="viewport">
      <screen ref="screen" v-if="visible" :markers="markers">
        <edge :data="{
          from: { x: 100, y: 150},
          to: { x: 300, y: 150}}"
          style="marker-start: url(#arrow-start-blue); marker-end: url(#arrow-end-blue); stroke: blue"
        ></edge>

        <edge :data="{
          from: { x: 100, y: 200},
          to: { x: 300, y: 200}}"
          style="marker-start: url(#squared); marker-end: url(#squared); stroke: blue"
        ></edge>

         <edge :data="{
          from: { x: 100, y: 250},
          to: { x: 300, y: 250}}"
          style="marker-start: url(#circular); marker-end: url(#circular); stroke: blue; "
        ></edge>

        <edge :data="{
          from: { x: 100, y: 300},
          to: { x: 300, y: 300}}"
          style="marker-start: url(#crossed); marker-end: url(#crossed); stroke: blue; "
        ></edge>

        <edge :data="{
          from: { x: 100, y: 350},
          to: { x: 300, y: 350}}"
          style="marker-start: url(#arrow-slim-start-blue); marker-end: url(#arrow-slim-end-blue); stroke: blue; "
        ></edge>

      </screen>
    </div>
    <div class="sidebar">
      <!-- TODO on click edge (marker) edit its id, type, scale and fill -->
    </div>
  </div>
</template>

<script>
import parse from 'css-parse'
import Screen from '../components/Screen'
import Node from '../components/Node'
import Edge from '../components/Edge'
import graph from '../graph'
import Markers from '../components/Markers.vue'

export default {
  components: {
    Screen,
    Node,
    Edge,
    Markers,
  },
  data() {
    return {
      graph: new graph(),
      visible: true,
      markers: [
        { id:'arrow-start-blue', type:'arrow-start', scale:0.5, style:'fill: blue'},
        { id:'arrow-end-blue', type:'arrow-end', scale:0.5, style:'fill: blue' },
        { id:'squared', type:'square', scale: 1, style:'fill: blue'},
        { id:'circular', type:'circle', scale: 1, style:'fill: blue'},
        { id:'crossed', type:'cross', scale: 1, style:'stroke: blue'},
        { id:'arrow-slim-start-blue', type:'arrow-slim-start', scale: .5, style:'stroke: blue'},
        { id:'arrow-slim-end-blue', type:'arrow-slim-end', scale: .5, style:'stroke: blue'},
      ],
    }
  },
  mounted () {
    // this.graph.createNode('a')
    // this.graph.createNode('b')
    // this.graph.createNode('c')
    // this.graph.createNode('d')
    // this.graph.createNode('e')
    // this.graph.createNode('f')

    // const fromAnchor = 'rect'
    // const toAnchor = 'rect'
    // this.graph.createEdge('a', 'b', {fromAnchor, toAnchor})
    // this.graph.createEdge('a', 'c', {fromAnchor, toAnchor})
    // this.graph.createEdge('a', 'd', {fromAnchor, toAnchor})
    // this.graph.createEdge('c', 'e', {fromAnchor, toAnchor})
    // this.graph.createEdge('e', 'f', {fromAnchor, toAnchor})

    // this.graph.graphNodes({ type: 'tree', spacing: 50 })
    // this.applyTheme();
  },
}
</script>

<style>
</style>