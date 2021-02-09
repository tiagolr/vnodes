<template>
  <div id="demo">
    <span v-if="tab === 'sink'">
      <h1></h1>
      <sink>
      </sink>
    </span>
    <span v-if="tab === 'html-nodes'">
      <html-nodes>
      </html-nodes>
    </span>
  </div>
</template>

<script>
import Sink from './Sink'
import HtmlNodes from './HtmlNodes'

export default {
  components: {
    Sink,
    HtmlNodes,
    //
    // ** sep layouts, demo + sugyama https://bl.ocks.org/d3noob/43a860bc0024792f8803bba8ca0d5ecd https://observablehq.com/@erikbrinkman/d3-dag-sugiyama
    // * path labels and markers
    // virtual render demo
    // ** connectors: orthogonal, ..., metro https://gojs.net
  },
  data() {
    return {
      // tab: 'html-nodes'
      tab: 'sink'
    }
  },
}
</script>

<style>
#demo {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
