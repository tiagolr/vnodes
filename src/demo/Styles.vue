<template>
  <div class="demo" id="styles-demo">
    <div class="viewport">
      <screen ref="screen" v-if="visible">
        <markers :markers="markers">
        </markers>
        <g>
          <edge v-for="edge in graph.edges" :data="edge" :nodes="graph.nodes" :key="edge.id">
          </edge>
          <node :data="node" ref="node" v-for="node in graph.nodes" :key="node.id">
          </node>
        </g>
      </screen>
    </div>
    <div class="sidebar">
      <div>Theme:</div>
      <select v-model="themeSelect" style="width: 100%">
        <option value="blueprint">blueprint</option>
        <option value="reds">reds</option>
        <option value="greys">greys</option>
      </select>
      <codemirror
        v-model="theme"
        :indent-with-tab="true"
        :tab-size="2"
        :extensions="[css()]"
        style="font-size: 13.3333px; font-family: monospace; height: 425px; width: 100%"
      ></codemirror>
    </div>
  </div>
</template>

<script>
import parse from 'css-parse'
import Screen from '../components/Screen.vue'
import Node from '../components/Node.vue'
import Edge from '../components/Edge.vue'
import graph from '../graph'
import Markers from '../components/Markers.vue'
import { Codemirror } from 'vue-codemirror'
import { css } from '@codemirror/lang-css'
import util from '../util'

const themes = {
  reds: `
.screen {
  background-color: white
}

.node .content {
  background-color: pink;
  color: red;
  box-shadow: inset 0px 0px 0px 4px red;
}

.edge {
  stroke: red;
  stroke-linejoin: round;
  marker-end: url(#arrow-end-red);
}
`,
  blueprint: `
.screen {
  background-color: #1A53A9
}

.node .content {
  background-color: #559EF5;
  color: #fff;
  box-shadow: inset 0px 0px 0px 4px #fff;
}

.edge {
  stroke: #fff;
  stroke-linejoin: round;
  marker-start: url(#circle-white);
  marker-end: url(#circle-white);
}`,
  greys:
`
.screen {
  background-color: white
}

.node .content {
  border-radius: 50%;
  background-color: #eee;
  color: #333;
  box-shadow: inset 0px 0px 0px 2px;
}

.edge {
  stroke: #333;
  stroke-width: 2px;
  stroke-linejoin: round;
  marker-end: none;
  stroke-linecap: round;
  stroke-dasharray: 8px;
  stroke-dashoffset: 1000;
  animation: dash 20s linear infinite;
}
`
}

export default {
  components: {
    Screen,
    Node,
    Edge,
    Markers,
    Codemirror
  },
  data() {
    return {
      css,
      themeSelect: 'blueprint',
      graph: new graph(),
      visible: true,
      markers: [
        {id:'arrow-end-red', type:'arrow-end', scale:0.5, style:'fill: red'} ,
        {id:'circle-white', type:'circle', scale:1, style:'fill: white'},
      ],
      theme: themes['blueprint'].trim()
    }
  },
  mounted () {
    this.graph.createNode('a')
    this.graph.createNode('b')
    this.graph.createNode('c')
    this.graph.createNode('d')
    this.graph.createNode('e')
    this.graph.createNode('f')

    const fromAnchor = 'rect'
    const toAnchor = 'rect'
    this.graph.createEdge('a', 'b', {fromAnchor, toAnchor})
    this.graph.createEdge('a', 'c', {fromAnchor, toAnchor})
    this.graph.createEdge('a', 'd', {fromAnchor, toAnchor})
    this.graph.createEdge('c', 'e', {fromAnchor, toAnchor})
    this.graph.createEdge('e', 'f', {fromAnchor, toAnchor})

    this.graph.graphNodes({ type: 'tree', spacing: 50 })
    this.applyTheme();
  },
  methods: {
    selectTheme(theme) {
      this.theme = themes[theme].trim()
    },
    async forceRender () {
      this.visible = false
        await this.$nextTick()
      this.visible = true
        await this.$nextTick()
      this.$refs.screen.zoomNodes(this.graph.nodes, { scale: 1 })
    },
    async applyTheme () {
      // parse theme rules
      let rules
      try {
        rules = parse(this.theme)
          .stylesheet.rules
          .filter(r => r.type === 'rule')
      } catch (e) {
        return;
      }
      // apply each rule to its selector elements
      await this.forceRender();
      rules.forEach(rule => {
        const sel = rule.selectors.length ? '#styles-demo ' + rule.selectors.join(', ') : ''
        const els = [...document.querySelectorAll(sel)]
        rule.declarations
          .filter(dec => dec.type === 'declaration')
          .forEach(dec => {
            els
              .filter(Boolean)
              .forEach(el => {
                const prop = dec.property.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
                console.log(dec.property, prop, dec.value)
                el.style[prop] = dec.value
              })
            })
          })

        // SAFARI FIX - safari has issues setting some properties via el.style
        // hiding the elements and showing them does the trick
        if (util.isSafari()) {
          const els = Array.from(document.querySelectorAll('#styles-demo .edge')).filter(Boolean)
          els.forEach(el => el.style.display = 'none')
          setTimeout(() => {
            els.forEach(el => el.style.display = '')
          }, 0);
        }
    }
  },
  watch: {
    theme: 'applyTheme',
    themeSelect: 'selectTheme'
  }
}
</script>

<style scoped>
.demo :deep(.v-codemirror .cm-gutters) {
  display: none
}
</style>

<style>
@keyframes dash {
  to {
    stroke-dashoffset: 0;
  }
}
</style>