<template>
  <div class="demo" id="styles-demo">
    <div class="viewport">
      <screen ref="screen" v-if="visible">
        <edge v-for="edge in graph.edges" :data="edge" :nodes="graph.nodes" :key="edge.id">
        </edge>
        <node :data="node" ref="node" v-for="node in graph.nodes" :key="node.id">
        </node>
      </screen>
    </div>
    <div class="sidebar">
      <textarea v-model="theme" style="height: 100%"></textarea>
    </div>
  </div>
</template>

<script>
import parse from 'css-parse'
import Screen from '../components/Screen'
import Node from '../components/Node'
import Edge from '../components/Edge'
import graph from '../graph'

export default {
  components: {
    Screen,
    Node,
    Edge,
  },
  data() {
    return {
      graph: new graph(),
      visible: true,
      theme: `
.node .content {
  background-color: pink;
}
`.trim(),
    }
  },
  mounted () {
    this.graph.createNode('a')
    this.graph.createNode('b')
    this.graph.createNode('c')
    this.graph.createNode('d')
    this.graph.createNode('e')
    this.graph.createNode('f')
    this.graph.createNode('g')
    this.graph.createNode('h')
    this.graph.createNode('i')

    const fromAnchor = 'rect'
    const toAnchor = 'rect'
    this.graph.createEdge('a', 'b', {fromAnchor, toAnchor})
    this.graph.createEdge('a', 'c', {fromAnchor, toAnchor})
    this.graph.createEdge('a', 'd', {fromAnchor, toAnchor})
    this.graph.createEdge('d', 'e', {fromAnchor, toAnchor})
    this.graph.createEdge('e', 'f', {fromAnchor, toAnchor})
    this.graph.createEdge('f', 'g', {fromAnchor, toAnchor})
    this.graph.createEdge('f', 'h', {fromAnchor, toAnchor})
    this.graph.createEdge('f', 'i', {fromAnchor, toAnchor})

    this.graph.graphNodes({ type: 'tree' })
    this.applyTheme();
    window.t = this
  },
  methods: {
    forceRender () {
      this.visible = false
      return this
        .$nextTick()
        .then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs.screen.zoomNodes(this.graph.nodes, { scale: 1 })
          })
        })
    },
    async applyTheme () {

      // TRY
      // ref.$forceUpdate()
      // ref.$mount()
      let rules
      try {
        rules = parse(this.theme)
          .stylesheet.rules
          .filter(r => r.type === 'rule')
      } catch (e) {
        return;
      }

      await this.forceRender();
      rules.forEach(rule => {
        const sel = rule.selectors.length ? '#styles-demo ' + rule.selectors.join(', ') : ''
        const els = [...document.querySelectorAll(sel)]
        rule.declarations
          .filter(dec => dec.type === 'declaration')
          .forEach(dec => {
            els.filter(el => el).forEach(el => {
              const prop = dec.property.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
              el.style[prop] = dec.value
            })
          })
      })
    }
  },
  watch: {
    theme: 'applyTheme'
  }
}
</script>

<style>
</style>