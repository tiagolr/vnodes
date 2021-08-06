<template>
  <div class="demo" id="edit-demo">
    <div class="viewport" @click="select(null)">
      <screen ref="screen">
        <g v-for="edge in graph.edges" @click.stop="select(edge)" :key="edge.id">
          <edge :class="selection && selection.id === edge.id && 'selected'"
            :data="edge"
            :nodes="graph.nodes">
          </edge>
        </g>
        <g v-for="node in graph.nodes" @click.stop="select(node)" :key="node.id">
          <node :data="node" ref="node" :class="isSelected(node) && 'selected'">
            <div v-html="node.html">
            </div>
          </node>
        </g>
      </screen>
    </div>
    <div class="sidebar">
      <textarea style="height: 100%; margin: 0"
        :disabled="!selection"
        v-model="editText"
        placeholder="Click on a node or edge to start editing"
        spellcheck="false"
      ></textarea>
    </div>
  </div>
</template>

<script>
import Screen from '../components/Screen'
import Node from '../components/Node'
import Edge from '../components/Edge'
import graph from '../graph'
import pretty from 'pretty'
import stringify from 'javascript-stringify'
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
    select (obj) {
      this.selection = obj
      const editText = { ...obj }
      delete editText.pathd
      editText.html = editText.html && "\n" + pretty(editText.html) + "\n"
      this.editText = stringify(editText, null, 2)
        .replace(/\\n/g, "\n")
        .replace(/html: '([^]*)'/g, 'html: `$1`')
    },
    applyChanges () {
      if (!this.selection) {
        return
      }
      try {
        const edit = eval('('+this.editText+')')
        Object.assign(this.selection, edit)
        this.$nextTick(() => {
          this.$refs.node.forEach(node => {
            node.fitContent()
          })
        })
      } catch (_) {
        console.log('fack', _)
      }
    },
    isSelected (node) {
      return this.selection
        && this.selection.id === node.id
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
      this.$refs.screen.zoomNodes(this.graph.nodes, {scale: 1})
    })
  },
  watch: {
    editText: 'applyChanges'
  },
}
</script>

<style>
#edit-demo .node:hover .content {
  background-color: rgb(90 200 90);
}

#edit-demo .node.selected .content {
  background-color: rgba(100, 200, 100, 1);
  box-shadow: 0px 0px 0px 2px #333;
}

#edit-demo .node .content {
  cursor: pointer;
}

#edit-demo .edge {
  cursor: pointer;
}
#edit-demo .edge:hover {
  /* stroke-width: 4 */
  stroke: rgb(90 200 90)
}
#edit-demo .edge.selected {
  /* stroke-width: 4 */
  stroke: #333
}
</style>