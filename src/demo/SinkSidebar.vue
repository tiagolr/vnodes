<template>
  <div class="sidebar">

    <textarea v-model="graphText" placeholder="add multiple lines" rows="8"></textarea>
    <h5>Graph</h5>
    <div>
      <span>type </span>
      <select v-model="graphType">
        <option value="basic">basic</option>
        <option value="basic-invert">basic-invert</option>
        <option value="tree">tree</option>
      </select>
    </div>
    <div>
      <span>dir </span>
      <select v-model="graphDir">
        <option value="left">left</option>
        <option value="right">right</option>
        <option value="up">up</option>
        <option value="down">down</option>
      </select>
    </div>
    <div>
      <button @click="graphNodes">Graph Nodes</button>
    </div>

    <h5>Edges</h5>
    <div>
      <span>type </span>
       <select v-model="connType">
        <option value="linear">linear</option>
        <option value="auto">auto</option>
        <option value="hsmooth">hsmooth</option>
        <option value="vsmooth">vsmooth</option>
      </select>
    </div>
    <div>
      <span>snap </span>
      <select v-model="edgeSnap">
        <option value="">fixed</option>
        <option value="rect">rect</option>
        <option value="circle">circle</option>
      </select>
    </div>

    <h5></h5>

    <div class="footer">
      <div>
        <span>GroupNodes</span>
        <input type="checkbox" id="groupNodes" v-model="groupNodes">
    </div>
      <button @click="zoomNodes">Zoom Nodes</button>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  export default {
    props: {
      graph: { required: true }
    },
    data() {
      return {
        graphType: 'basic',
        graphDir: 'right',
        graphText: 'a/b/c\nb/d',
        graphError: '',
        connType: '',
        groupNodes: false,
        edgeAlign: '',
        edgeSnap: '',
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.createNodes()
      })
    },
    methods: {
      zoomNodes () {
        let left = Infinity
        let top = Infinity
        let right = -Infinity
        let bottom = -Infinity

        this.graph.nodes.forEach(node => {
          if (node.x < left) left = node.x
          if (node.x + node.width > right) right = node.x + node.width
          if (node.y < top) top = node.y
          if (node.y + node.height > bottom) bottom = node.y + node.height
        })

        left -= 50
        top -= 50
        right += 50
        bottom += 50

        this.$parent.$refs.screen.zoomRect({ left, top, right, bottom })
      },
      createNodes () {
        this.graph.reset()
        const graph = this.parsedGraph
        const visitNode = (node, parent) => {
          if (!this.graph.nodes.find(n => n.id === node.id)) {
            this.graph.createNode(node.id)
          }
          if (parent) {
            if (!this.graph.edges.find(c => c.fromNode === parent.id && c.toNode === parent.id)) {
              this.graph.createEdge(parent.id, node.id)
            }
          }
          node.children.forEach(c => visitNode(c, node))
        }
        graph.forEach(n => visitNode(n))
        this.graphNodes(true)
      },
      graphNodes (all) {
        this.graph.graphNodes({
          nodes: this.graph.nodes,
          edges: this.graph.edges,
          type: this.graphType,
          dir: this.graphDir
        })
      }
    },
    computed: {
      parsedGraph () {
        const visited = []
        const graph = []
        const lines = this.graphText.split('\n')
        lines.forEach(line => {
          line.split('/').forEach((entry, i, arr) => {
            const id = entry.trim()
            if (!id) {
              return
            }
            const pid = i && arr[i - 1].trim()
            const node = { id, children: [] }
            const parent = pid && visited.find(n => n.id === pid)

            if (parent) {
              parent.children.push(node)
            } else {
              graph.push(node)
            }

            visited.push(node)
          })
        })
        return graph
      },
    },
    watch: {
      parsedGraph () {
        Vue.nextTick(this.createNodes)
      },
      connType (type) {
        this.graph.edges.forEach(edge => {
          edge.type = type
        })
      },
      graphDir () {
        this.graphNodes()
      },
      graphType () {
        this.graphNodes()
      },
      groupNodes (bool) {
        this.$emit('toggleGroupNodes', bool)
      },
      edgeSnap (value) {
        this.graph.edges.forEach(edge => {
          this.$set(edge.fromAnchor, 'snap', value)
          this.$set(edge.toAnchor, 'snap', value)
        })
      },
      edgeAlign (value) {
        this.graph.edges.forEach(edge => {
          this.$set(edge.fromAnchor, 'align', value)
          this.$set(edge.toAnchor, 'align', value)
        })
      },
      anchorX (value) {
        if (!value) {
          value = '50%'
        } else if (!value.endsWith('%')) {
          value = parseFloat(value)
        }
        this.graph.edges.forEach(edge => {
          edge.fromAnchor.x = value
          edge.toAnchor.x = value
        })
      },
      anchorY (value) {
        if (!value) {
          value = '50%'
        } else if (!value.endsWith('%')) {
          value = parseFloat(value)
        }
        this.graph.edges.forEach(edge => {
          edge.fromAnchor.y = value
          edge.toAnchor.y = value
        })
      }
    },
  }
</script>

<style lang="stylus" scoped>
.sidebar {
  position: absolute;
  left: 1020px;
  right: 0;
  top: 0;
  height: 800px;
  text-align: left;
}
.sidebar > * {
  margin-bottom: 10px
}
.footer
  margin-bottom 0px
  position absolute
  bottom 0
</style>