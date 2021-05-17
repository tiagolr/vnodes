<template>
  <div class="demo" id="ports-demo">
    <div class="viewport">
      <screen ref="screen">
        <edge v-for="edge in graph.edges" :data="edge" :nodes="graph.nodes" :key="edge.id" @click="() => select(edge)">
        </edge>
        <node :data="node" ref="node" v-for="node in graph.nodes" :key="node.id">
          <div style="text-align: center"><strong>{{ node.title }}</strong></div>
          <table>
            <td>
              <tr v-for="input in node.inputs" :key="node.id+'i'+input">
                <span @mousedown.prevent.stop="test">
                  <port :edgesTo="getInputEdges(node, input)">
                    <div style="width: 10px; height: 10px; background-color: red; display: inline-block"></div>
                  </port>
                </span>
                {{input}}
              </tr>
            </td>
            <td>
              <tr v-for="output in node.outputs" :key="node.id+'o'+output">
                {{output}}
                <span @mousedown.prevent.stop="test">
                  <port :edgesFrom="getOutputEdges(node, output)" @mousedown.prevent.stop="test">
                    <div style="width: 10px; height: 10px; background-color: red; display: inline-block"></div>
                  </port>
                </span>
              </tr>
            </td>
          </table>
        </node>
      </screen>
    </div>
    <div class="sidebar">
      <!-- [ ] group nodes -->
      <!-- padding [   ] -->
      <!-- Label [input] -->
      <!-- Align label <top, left, right, bottom> -->
    </div>
  </div>
</template>

<script>
import Screen from '../components/Screen'
import Node from '../components/Node'
import Edge from '../components/Edge'
import Port from '../components/Port'
import graph from '../graph'
export default {
  components: {
    Screen,
    Node,
    Edge,
    Port
  },
  data() {
    return {
      graph: new graph(),
    }
  },
  methods: {
    test () {
      console.log('test')
    },
    getInputEdges (node, input) { // get edges that go to this input
      return this.graph.edges
        .filter(e => e.to === node.id && e.toPort === input)
    },
    getOutputEdges (node, output) { // get edges that start from this output
      return this.graph.edges
        .filter(e => e.from === node.id && e.fromPort === output)
    }
  },
  mounted () {
    this.graph.createNode({
      id: 'a',
      title: 'nodeA',
      inputs: ['1'],
      outputs: ['1', '2', '3']
    })
    this.graph.createNode({
      id: 'b',
      x: 200,
      y: 100,
      title: 'B',
      inputs: ['1', '2'],
      outputs: ['1', '2']
    })
    this.graph.createEdge({
      from: 'a',
      to: 'b',
      fromPort: '1',
      toPort: '1'
    })
    this.$nextTick(() => {
      this.$refs.screen.zoomNodes(this.graph.nodes, { scale: 1 })
    })
  }
}
</script>

<style lang="stylus">
</style>