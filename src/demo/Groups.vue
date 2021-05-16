<template>
  <div class="demo" id="edit-demo">
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
  }
}
</script>

<style lang="stylus">
</style>