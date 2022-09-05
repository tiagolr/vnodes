<template>
  <div class="demo" id="markers-demo">
    <div class="viewport">
      <screen ref="screen" v-if="visible" :markers="markers">
        <edge :data="{
          from: { x: 100, y: 150},
          to: { x: 300, y: 150}}"
          style="marker-start: url(#arrow-start-blue); marker-end: url(#arrow-end-blue); stroke: blue"
        ></edge>
        <text x="350" y="155" class="small">#arrow-start, #arrow-end</text>

        <edge :data="{
          from: { x: 100, y: 200},
          to: { x: 300, y: 200}}"
          style="marker-start: url(#squared); marker-end: url(#squared); stroke: blue"
        ></edge>
        <text x="350" y="205" class="small">#square</text>

         <edge :data="{
          from: { x: 100, y: 250},
          to: { x: 300, y: 250}}"
          style="marker-start: url(#circular); marker-end: url(#circular); stroke: blue; "
        ></edge>
        <text x="350" y="255" class="small">#circle</text>

        <edge :data="{
          from: { x: 100, y: 300},
          to: { x: 300, y: 300}}"
          style="marker-start: url(#crossed); marker-end: url(#crossed); stroke: blue; "
        ></edge>
        <text x="350" y="305" class="small">#cross</text>

        <edge :data="{
          from: { x: 100, y: 350},
          to: { x: 300, y: 350}}"
          style="marker-start: url(#arrow-slim-start-blue); marker-end: url(#arrow-slim-end-blue); stroke: blue; "
        ></edge>
        <text x="350" y="355" class="small">#arrow-slim-start, #arrow-slim-end</text>

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
        { id:'squared', type:'square', scale: 1, style:'fill: blue;'},
        { id:'circular', type:'circle', scale: 1, style:'fill: blue'},
        { id:'crossed', type:'cross', scale: 1, style:'stroke: blue'},
        { id:'arrow-slim-start-blue', type:'arrow-slim-start', scale: .5, style:'stroke: blue'},
        { id:'arrow-slim-end-blue', type:'arrow-slim-end', scale: .5, style:'stroke: blue'},
      ],
    }
  }
}
</script>

<style>
</style>