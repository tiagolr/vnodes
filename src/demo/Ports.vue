<template>
  <div class="demo" id="ports-demo">
    <div class="viewport">
      <screen ref="screen">
        <edge v-for="edge in graph.edges.filter(e => !e.active)"
          :data="edge"
          :nodes="graph.nodes"
          :key="edge.id"
        ></edge>
        <!--
          <edge v-if="activeEdge"
              :data="{
                from intput && edge.from || mouseDist
                to output && edge.to || mouseDist
              }"
          ></edge>
         -->
        <node :data="node" ref="node" v-for="node in graph.nodes" :key="node.id">
          <div style="text-align: center"><strong>{{ node.title }}</strong></div>
          <table>
            <td>
              <tr v-for="input in node.inputs" :key="node.id+'i'+input">
                  <port :edgesTo="getInputEdges(node, input)">
                    <div class="port-inner"
                      @mousedown.stop="startConnect(node, { input })"
                      @mouseup.stop="createConnect(node, { input })"
                      :class="getInputEdges(node, input).length && 'connected'">
                    </div>
                  </port>
                {{input}}
              </tr>
            </td>
            <td>
              <tr v-for="output in node.outputs" :key="node.id+'o'+output">
                {{output}}
                <port :edgesFrom="getOutputEdges(node, output)">
                  <div class="port-inner"
                    @mousedown.stop="startConnect(node, { output })"
                    @mouseup.stop="createConnect(node, { input })"
                    :class="getOutputEdges(node, output).length && 'connected'">
                  </div>
                </port>
              </tr>
            </td>
          </table>
        </node>
      </screen>
    </div>
    <div class="sidebar">
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
      isConnecting: null, // { node: {}, input: int, output: int }
      mouseDist: { x: 0, y: 0 },
      zoom: 1
    }
  },
  methods: {
    startConnect (node, {input, output}) {
      if (this.isConnecting) {
        return
      }
      console.log('startconnect from', node.id, {input, output})
      const edges = input ? this.getInputEdges(node, input)
        : output ? this.getOutputEdges(node, output) : []

      if (edges.length) {
        edges[0].active = true
      } else {
        console.log('startconnect creating-edge')
        this.graph.createEdge({
          from: node.id,
          to: node.id,
          fromPort: input || output,
          toPort: input || output
        })
      }

      this.isConnecting = {
        node, input, output
      }
      this.mouseDist = { x: 0, y: 0 }
      this.zoom = this.$refs.screen.panzoom.getZoom()
    },
    createConnect (node, {input, output}) {
      console.log('createConnect to', node.id, {input, output})
      if (!this.isConnecting) {
        return
      }
      if (this.isValidConnection({node, input, output}, this.isConnecting)) {
        console.log('createConnect VALID CONNECT')
        if (input) {
          this.activeEdge.to = node
          this.activeEdge.toPort = input
        } else if (output) {
          this.activeEdge.from = node
          this.activeEdge.fromPort = output
        }
        this.stopConnect()
      } else {
        console.log('createConnect INVALID CONNECT')
        this.cancelConnect()
      }
    },
    cancelConnect () {
      if (!this.isConnecting) {
        return
      }
      console.log('cancelConnect', this.isConnecting.node.id, this.isConnecting.input, this.isConnecting.output)
      const dist = Math.sqrt(this.mouseDist.x ** 2, this.mouse.dist.y ** 2 )
      if (!edge.from.id || !edge.to.id || dist > 30) {
        this.graph.removeEdge(edge)
      }
      this.stopConnect()
    },
    stopConnect () {
      if (this.activeEdge) {
        this.activeEdge.active = false
      }
      this.isConnecting = null
    },
    isValidConnection (conA, conB) {
      return (conA && conB && conA.node && conB.node)
       && (conA.node !== conB.node)
       && (conA.input && conB.output || conB.input && conA.output)
    },
    // edges that go to this input
    getInputEdges (node, input) {
      return this.graph.edges
        .filter(e => e.to === node.id && e.toPort === input)
    },
    // edges that start from this output
    getOutputEdges (node, output) {
      return this.graph.edges
        .filter(e => e.from === node.id && e.fromPort === output)
    },
    onmousemove (e) {
      if (this.isConnecting) {
        this.mouseDist.x += e.movementX / this.zoom
        this.mouseDist.y += e.movementY / this.zoom
      }
    }
  },
  computed: {
    activeEdge: vm => vm.graph.edges
      .find(e => e.active)
  },
  mounted () {
    window.pz = this.$refs.screen.panzoom
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
      toPort: '1',
      active: false
    })
    this.$nextTick(() => {
      this.$refs.screen.zoomNodes(this.graph.nodes, { scale: 1 })
    })
    // document.addEventListener('mouseup', this.cancelConnect)
    // document.addEventListener('mousemove', this.onmousemove)
  },
  beforeDestroy () {
    // document.removeEventListener('mouseup', this.cancelConnect)
    // document.removeEventListener('mousemove', this.onmousemove)
  },
}
</script>

<style scoped>
.port-inner {
  width: 15px;
  height: 15px;
  border-radius: 10px;
  background-color: red;
  display: inline-block;
  cursor: pointer;
}

.port-inner:hover {
  background-color: blue;
}

.port-inner.connected {
  background-color: yellow;
}

</style>