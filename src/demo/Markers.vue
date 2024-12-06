<template>
  <div class="demo" id="markers-demo">
    <div class="viewport">
      <screen ref="screen" v-if="visible">
          <template #edges>
            <markers :markers="markers">
            </markers>
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
          </template>
        </screen>
    </div>
    <div class="sidebar">
    </div>
  </div>
</template>

<script>
import Screen from '../components/Screen.vue'
import Node from '../components/Node.vue'
import Edge from '../components/Edge.vue'
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
        { id:'arrow-start-blue', type:'path', scale:0.5, style:'fill: blue', path: 'M0,5 L10,10 L10,0 L0,5'},
        { id:'arrow-end-blue', type:'path', scale:0.5, style:'fill: blue', path: 'M0,0 L0,10 L10,5 L0,0' },
        { id:'squared', type:'rect', scale: 1, style:'fill: blue;'},
        { id:'circular', type:'circle', scale: 1, style:'fill: blue'},
        { id:'crossed', type:'path', scale: 2, style:'stroke: blue', path: 'M 3,3 L 7,7 M 3,7 L 7,3'},
        { id:'arrow-slim-start-blue', type:'path', scale: .5, style:'stroke: blue', path: 'M1,5 L9,9 M9,1 L1,5'},
        { id:'arrow-slim-end-blue', type:'path', scale: .5, style:'stroke: blue', path: 'M10,5 L1,1 M10,5 L1,9', strokeLinecap: 'round'},
      ],
    }
  }
}
</script>

<style>
</style>