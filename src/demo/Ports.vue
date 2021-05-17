<template>
  <div class="demo" id="ports-demo">
    <div class="viewport">
      <screen ref="screen">
        <edge v-for="edge in graph.edges" :data="edge" :nodes="graph.nodes" :key="edge.id" @click="() => select(edge)">
        </edge>
        <node :data="node" ref="node" v-for="node in graph.nodes" :key="node.id">
        </node>
      </screen>
    </div>
    <div class="sidebar">
      <!-- [ ] group nodes -->
      <!-- Label [input] -->
      <!-- Align label <top, left, right, bottom> -->
    </div>
  </div>
</template>

<script>
import Screen from '../components/Screen'
import Node from '../components/Node'
import Edge from '../components/Edge'
import graph from '../graph'
export default {
  components: {
    Screen,
    Node,
    Edge
  },
  data() {
    return {
      graph: new graph(),
    }
  },
  mounted () {
    this.graph.createNode('a')
    this.graph.createNode({
      id: 'b',
      x: 200,
      y: 100,
    })
    this.graph.createEdge({
      from: 'a',
      to: 'b',
      fromPort: 'o1',
      toPort: 'i1'
    })
  }
}
</script>

<style lang="stylus">
</style>