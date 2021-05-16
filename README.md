-------

# vnodes

Vue bare components to create svg interactive graphs, diagrams or node visual tools.

### Demo 

https://txlabs.github.io/vnodes/

### Get started
```html
<template>
  <screen ref="screen">
    <edge v-for="edge in graph.edges" :data="edge" :nodes="graph.nodes" :key="edge.id">
    </edge>

    <node v-for="node in graph.nodes" :data="node" :key="node.id">
      <!-- html can be placed here, defaults to <div>{{node.id}}</div> -->
    </node>
  </screen>
</template>
```
```js
import { Screen, Node, Edge, graph } from 'vnodes'
export default {
  components: {
     Screen, 
     Node, 
     Edge
  }
  data () {
    return {
      graph: new graph()
    }
  }
  created () {
    this.graph.createNode('a')
    this.graph.createNode('b')
    this.graph.createEdge('a', 'b')
    this.graph.graphNodes()
  }
}
```

## Components

- Screen - svg wrapper with zoom, panning and others
- Node - svg element that contain html
- Edge - connect nodes using svg lines
- Group - surround nodes with a container
