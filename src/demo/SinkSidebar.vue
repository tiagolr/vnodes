<template>
  <div>
    <div style="font-weight: bold">Graph</div>
    <textarea v-model="graphText" placeholder="add multiple lines" rows="4"></textarea>
    <div>
      <span>type</span>
      <select v-model="graphType">
        <option value="basic">basic</option>
        <option value="basic-invert">invert</option>
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

    <div style="font-weight: bold">Edges</div>
    <div>
      <span>type </span>
       <select v-model="connType">
        <option value="linear">linear</option>
        <option value="smooth">smooth</option>
        <option value="ortho">ortho</option>
        <option value="hsmooth">hsmooth</option>
        <option value="vsmooth">vsmooth</option>
      </select>
    </div>
    <div>
      <span>snap </span>
      <select v-model="edgeSnap">
        <option value="anchor">anchor</option>
        <option value="rect">rect</option>
        <option value="circle">circle</option>
      </select>
    </div>

    <div style="font-weight: bold">Nodes</div>
    <div><input type="text" placeholder="a,b,c (nodes filter)" v-model="graphNodesFilter"></div>
    <button @click="() => zoomNodes(null, filterNodes)">Zoom Nodes</button>
    <button @click="() => graphNodes(filterNodes)">Graph Nodes</button>
    <div>
      <input type="checkbox" id="groupNodes" v-model="groupNodes">
      <span> Group</span>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      graph: { required: true }
    },
    data() {
      return {
        graphType: 'basic',
        graphDir: 'right',
        graphText: 'a/b/c\nb/d/e/f/g\ne/i',
        graphError: '',
        graphNodesFilter: '',
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
      centerNodes () {
        const panzoom = this.$parent.$refs.screen.panzoom
        this.zoomNodes()
        if (panzoom.getZoom() > 1) {
          this.zoomNodes(1) // fix, only allow zoom out
        }
      },
      zoomNodes (scale=null) {
        let left = Infinity
        let top = Infinity
        let right = -Infinity
        let bottom = -Infinity

        const nodes = this.filterNodes || this.nodes
        nodes.forEach(node => {
          if (node.x < left) left = node.x
          if (node.x + node.width > right) right = node.x + node.width
          if (node.y < top) top = node.y
          if (node.y + node.height > bottom) bottom = node.y + node.height
        })

        left -= 50
        top -= 50
        right += 50
        bottom += 50

        this.$parent.$refs.screen.zoomRect({ left, top, right, bottom }, { scale })
      },
      createNodes () {
        this.graph.reset()
        const graph = this.parsedGraph
        const visitNode = (node, parent) => {
          if (!this.nodes.find(n => n.id === node.id)) {
            this.graph.createNode(node.id)
          }
          if (parent) {
            if (!this.edges.find(c => c.fromNode === parent.id && c.toNode === parent.id)) {
              this.graph.createEdge(parent.id, node.id)
            }
          }
          node.children.forEach(c => visitNode(c, node))
        }
        graph.forEach(n => visitNode(n))
        this.graphNodes()
        this.centerNodes()
      },
      graphNodes (filterNodes) {
        this.graph.graphNodes({
          nodes: filterNodes || this.nodes,
          edges: this.edges,
          type: this.graphType,
          dir: this.graphDir
        })
      }
    },
    computed: {
      nodes: vm => Object.values(vm.graph.nodes),
      edges: vm => Object.values(vm.graph.edges),
      filterNodes () {
        const filtered = this.graphNodesFilter.split(',').map(s => s.trim())
        const nodes = this.nodes.filter(n => filtered.includes(n.id))
        return nodes.length ? nodes : null
      },
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
        this.$nextTick(this.createNodes)
      },
      connType (type) {
        this.edges.forEach(edge => {
          edge.type = type
        })
      },
      graphDir () {
        this.graphNodes()
        this.centerNodes()
      },
      graphType () {
        this.graphNodes()
        this.centerNodes()
      },
      groupNodes (bool) {
        this.$emit('toggleGroupNodes', bool)
      },
      edgeSnap (value) {
        this.edges.forEach(edge => {
          edge.fromAnchor.snap = value
          edge.toAnchor.snap = value
        })
      },
      edgeAlign (value) {
        this.edges.forEach(edge => {
          edge.fromAnchor.align = value
          edge.toAnchor.align = value
        })
      },
      anchorX (value) {
        if (!value) {
          value = '50%'
        } else if (!value.endsWith('%')) {
          value = parseFloat(value)
        }
        this.edges.forEach(edge => {
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
        this.edges.forEach(edge => {
          edge.fromAnchor.y = value
          edge.toAnchor.y = value
        })
      }
    },
  }
</script>
