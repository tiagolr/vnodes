<template>
  <div id="demo">
    <h1></h1>
    <sink>
    </sink>
  </div>
</template>

<script>
import Sink from './Sink'

export default {
  components: {
    Sink
    // TODO + tabs href
    // html in nodes (node select, edit html, fit nodes)
    // connectors (connector select, edit fields)
    // anchors/ports
    // genealogy tree https://bl.ocks.org/d3noob/43a860bc0024792f8803bba8ca0d5ecd https://observablehq.com/@erikbrinkman/d3-dag-sugiyama
    // virtual render
    // orthogonal, ..., metro
    // css animations
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
