# vnodes

Vue bare components to create svg interactive graphs, diagrams or node visual tools.

### Demo

https://gr1m1um.github.io/vnodes/

### Install

```bash
npm install vnodes
```

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

Components are independent and can be imported separately.

### Screen

Svg wrapper with zoom, panning and other features.

```html
<screen>
  <circle cx="50" cy="50" r="50" fill="red"/>
</screen>
```

### Node

Html wrapper for svg with additional features like, dragging and fitting contents.


```html
<svg width="500" height="500">
  <node :data="{
    id: 'test',
    x: 100,
    y: 100,
    width: 250,
    height: 150}">
      <h1>My First Node!</h1>
  </node>
</svg>
```

### Edge

Connects nodes using svg lines

```html
<edge :data="{
  from: { x: 0, y: 0},
  to: { x: 100, y: 100}}"
></edge>
```

Edges require node references `{ from: id|Object, to: String|Object }`, if nodes are refered by `id(String)` an array `nodes` must be passed:

```html
<edge
  :data="{from: 'A', to: 'B'}"
  :nodes="[{id: 'A' ... ]">
</edge>
```

Edges can take **anchor** information to offset their position relative to a node,

```html
<edge :data="{
  from: nodes[0],
  to: nodes[1],
  fromAnchor: 'center',
  toAnchor: 'top-left',
}">
```
 anchors format can be:

* String `'center', 'left', 'right', 'top', 'top-left', 'top-right', 'bottom', 'bottom-left', 'bottom-right', 'cirlce', 'rect'`
* Object `{ x?:Number|String, y?: Number|String, align?: String, snap?: String }`

Examples of valid anchors:

```js
null
{ x: 0, y: 0}
{ x: 10, y: 10 }
{ x: '50%', '50%' }
{ x: '50%', '50%', snap: 'rect' }
{ align: 'bottom-right' }
'center'
'top-left'
'circle'   // snaps offset to circle with radius node.width/2
'rect'     // snaps offset to node rectangle
```

### Group

Surrounds a group of nodes with a rectangle, allows dragging multiple nodes.

```html
<group :nodes="nodes">
  <h1>Group Label</h1>
</group>
```

### Port

Placed inside a node, automatically offsets edges to a their position inside the nodes html [Ports demo].

### Label

Create a label node that is positioned along an edge

```html
<v-label :edge="graph.edges[0]" :perc="50" :offset="{x: 0, y: -50}">
  <h4>Content</h4>
</v-label>
```

### graph.js

Can be used to store edges and nodes.
Contains utility methods to build graphs, layouts, remove and create nodes, edges and so on.

## Styling

The simplest way to style nodes and edges is using CSS

```css
<style>
svg .node .content {
  border-radius: 50%;
  background-color: red;
}

svg .edge {
  stroke-width: 10;
  stroke: blue;
  marker-start: url(#arrow-start);
}
</style>
```

### Markers

TODO
routing orth manh metro https://resources.jointjs.com/demos/routing
theme apply demo
markers demo
groups demo
edge api review
graph tools, nodes containing edge refs or adj list etc
graph layouts https://www.yworks.com/products/yfiles/features#layout
layered layouts https://github.com/erikbrinkman/d3-dag
layered layouts https://www.yworks.com/pages/layered-graph-layout
css animations demo/theme https://www.yworks.com/products/yfiles/features
https://www.edrawmax.com/online/en/
https://js.cytoscape.org/
