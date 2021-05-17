<template>
  <div class="demo" id="edit-demo">
    <div class="viewport">
      <screen ref="screen">
        <g v-for="edge in graph.edges" @click="select(edge)" :key="edge.id">
          <edge :class="selection && selection.id === edge.id && 'selected'"
              :data="edge"
              :nodes="graph.nodes">
            </edge>
        </g>
        <g v-for="node in graph.nodes" @click="select(node)" :key="node.id">
          <node :data="node" ref="node" :class="selection.id === node.id && 'selected'">
            <div v-html="node.html"></div>
          </node>
        </g>
      </screen>
    </div>
    <div class="sidebar">
      <textarea name="" id="" cols="30" rows="10" style="height: 100%"
        :disabled="!selection"
        v-model="editText"
        @change="applyChanges"
        placeholder="Click on a node or edge to start editing"
      >
      </textarea>
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
      selection: null,
      editText: '',
      hover: null
    }
  },
  methods: {
    test () {
      console.log('leave')
    },
    select (obj) {
      this.selection = obj
      this.editText = JSON.stringify(this.selection, null, 2)
    },
    applyChanges () {
      if (!this.selection) {
        return
      }
      const edit = JSON.parse(this.editText)
      Object.assign(this.selection, edit)
      this.$nextTick(() => {
        this.$refs.node.forEach(node => {
          node.fitContent()
        })
      })
    }
  },
  mounted () {
    this.graph.createNode({
      id: 'a',
      html: '<h5 style="margin: 25px">A</h5>'
    })
    this.graph.createNode({
      id: 'b',
      x: 200,
      y: 200,
      html:
      `<div style="margin: 10px; text-align: center"><h4>B</h4><p>Some subtitle</p></div>`
    })
    this.graph.createEdge({
      from: 'a',
      to: 'b',
      toAnchor: { x: '50%', y: '50%', snap: 'rect' },
      type: 'smooth'
    })
    this.$nextTick(() => {
      this.$refs.screen.zoomNodes(this.graph.nodes, 0, 1)
    })
  }
}
</script>

<style lang="stylus">
#edit-demo .node {
  cursor: pointer
}
#edit-demo .edge {
  cursor: pointer
}
.selection .edge {
  stroke-width: 8
  marker-end: none
  stroke: blue
}
</style>