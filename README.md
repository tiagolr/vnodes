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

Vnodes components are independent and can be used anywhere in your project.

### Screen

Svg wrapper with zoom, panning and other features.

```html
<screen width="300" height="500">
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

Edges data require node references `{ from: String|Object, to: String:Object }`, if nodes are refered by id(String) edges must also include an array with those `nodes` as property.


Edges can take **anchor** information to offset their position relative to a node,

```html
<edge :data="{
  from: nodes[0],
  to: nodes[1],
  fromAnchor: 'center',
  toAnchor: 'top-left'
}">
```
 anchors format can be:

* String `'center', 'left', 'right', 'top', 'top-left', 'top-right', 'bottom', 'bottom-left', 'bottom-right', 'cirlce', 'rect'`

* Object `{ x?:Number | String, y?: Number | String, align?: String, snap?: String }`

Examples of valid anchor values:

```js
null
{ x: 0, y: 0}       // snaps to top left corner
{ x: 10, y: 0 }     // offsets x,y by 10 pixels
{ x: '50%', '50%' } // snaps to center
{ x: '50%', '50%', snap: 'rect' } // offsets around node rectangle
{ align: 'bottom-right' } // same as { x: '100%', y: '100% }
'center'   // same as { x: '50%', y: '50%' }
'top-left' // same as { x: 0, y: 0 }
'circle'   // offsets to circle with radius node.width/2
'rect'     // offsets around node rectangle
```

### Group

Surround nodes with a visible container, allows dragging multiple nodes,

```html
<group :nodes="nodes">
  <h1>Group Label</h1>
</group>
```


### Port

Helper component to offset an edge anchor to a specific position inside the html of a node.

### graph

Graph utils that can be used to store edges and nodes.
Contains utility methods to build graphs, position nodes remove and create nodes, edges etc.

## Styling

The simplest way to style nodes / edges is using CSS

### Markers

TODO

```css
<style>
.node .content {
  border-radius: 50%;
  background-color: red;
}

.edge {
  stroke-width: 10;
  stroke: blue;
  marker-start: url(#arrow-start);
}
</style>
```