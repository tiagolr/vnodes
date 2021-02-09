<template>
  <div style="position: relative">
    <div style="width: 1000px; height: 800px;">
      <screen ref="screen">

        <edge v-for="edge in graph.edges" :data="edge" :nodes="graph.nodes" :key="edge.id" @click="selection = edge">
        </edge>

        <node v-if="showInfo"
          :data="{ x:-200 , y: -200, width: 220, height: 70 }"
          :styleContent="{
            width: '100%',
            height: '100%',
            textAlign: 'center',
            backgroundColor: '#abc',
            cursor: 'default'
          }">
          <h4>Click on a node or edge to edit it</h4>
          <div @click="showInfo = false" style="position: absolute; top: 5px; right: 5px; cursor: pointer; color: #eee"> x </div>
        </node>

        <node v-for="node in graph.nodes" :data="node" :key="node.id" @click="selection = node">
          <div v-html="node.content">
          </div>
        </node>
      </screen>

      <div class="sidebar">
        <div v-if="selection">
          <textarea rows="20" v-model="textarea">
          </textarea>
        </div>
        <div v-if="selection">
          <button @click="applyChanges" :disabled="!selection || textarea === originalText">Apply Changes</button>
        </div>
        <div>
          <span style="font-size: small; color: red">{{ error }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
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
      originalText: '',
      textarea: '',
      error: '',
      selection: null,
      showInfo: true
    }
  },
  mounted () {
    this.graph.createNode({
      id: 'a',
      content: '<h1>Test1</h1>'
    })
    this.graph.createNode({
      id: 'b',
      content: '<h1>Test2</h1>'
    })
    this.graph.createNode({
      id: 'c',
      content: '<h1>Test3</h1>'
    })

    this.graph.createEdge('a', 'b', { type: 'auto' })
    this.graph.createEdge('a', 'c', {
      fromAnchor: {
        x: "50%",
        y: "50%",
        snap: "rect"
      },
      toAnchor: {
        x: 0,
        y: 25,
      }
    })

    Vue.nextTick(() => {
      this.graph.graphNodes({ type: 'tree', spacing: 200 })
      this.$refs.screen.zoomRect({
        left: 0,
        top: -400,
        right: 400,
        bottom: 500,
      })
    })
  },
  methods: {
    applyChanges () {
      this.error = ''

      try {
        const parsed = JSON.parse(this.textarea)
        Object.keys(parsed).forEach(key => {
          Vue.set(this.selection, key, parsed[key])
        })
      } catch (e) {
        this.error = e.message
        return
      }

      this.originalText = this.textarea
    },
  },
  watch: {
    selection (v) {
      this.textarea = JSON.stringify(v, null, '  ')
      this.originalText = this.textarea
      // this.data.isEdgeSelected = !!v.from
    }
  },
}
</script>

<style>
.sidebar {
  position: absolute;
  left: 1020px;
  right: 0;
  top: 0;
  height: 800px;
  text-align: left;
}

.node {
  cursor: pointer;
}

.node .content {
  background-color: rgba(100, 200, 100, 1)
}

.screen .edge {
  cursor: pointer;
  stroke-width: 4
}
</style>
