import uuid from 'uuid'
import util from './util'
import { flextree } from 'd3-flextree'

export default class Graph {
  constructor() {
    this.nodes = []
    this.edges = []
  }

  positionNode({node, parent, dir = 'right', spacing = 40, invertOffset = false} = {}) {
    node = typeof node === 'string' ? this.nodes.find(n => n.id === node) : node
    parent = typeof parent === 'string' ? this.nodes.find(n => n.id === parent) : parent
    const pos = util.findPosition(node, parent, dir, this.nodes, spacing, invertOffset)
    this.updateNode(node, {x: pos.x, y: pos.y})
  }

  // refs
  // https://gojs.net

  // TODO
  // dagLoad - set [nodes] and [edges] from dag
  // dagBuild - builds and saves dag info into nodes
  // dagBuildEdges - delete all edges and build them from Dag
  // dagSetParent - change dag parent (string or array[string] => array[string])

  graphNodes({nodes, edges, type = 'basic', dir = 'right', spacing = 40} = {}) {
    nodes = nodes || this.nodes
    edges = edges || this.edges

    const dag = util.createDAG(nodes, edges) // removes cycles if any
    if (!dag.length) {
      return
    }

    if (type === 'basic' || type === 'basic-invert') {
      const visited = {}
      const findPos = (node, parent) => {
        if (visited[node.id]) {
          return
        }
        const collisions = nodes.filter(n => !!visited[n.id])
        const pos = util.findPosition(node, parent, dir, collisions, spacing, type === 'basic-invert')
        node.x = pos.x
        node.y = pos.y
        this.updateNode(node.id, {
          x: node.x,
          y: node.y
        })
        visited[node.id] = true
        node.children.forEach(n => findPos(n, node))
      }
      dag
          .filter(node => !node.parentIds.length)
          .forEach(node => findPos(node, null))
    } else if (type === 'tree') {
      const layout = flextree()
      const flipH = (dir === 'left' || dir === 'right')
      const roots = dag.filter(n => !n.parentIds.length)
      roots.forEach(root => {
        const graph = []
        const offsetX = root.x
        const offsetY = root.y
        util.dagToFlextree(root, graph, flipH, spacing)
        const tree = layout.hierarchy(graph[0])
        layout(tree)
        // apply layout to nodes
        const invertX = dir === 'left' ? -1 : 1
        const invertY = dir === 'up' ? -1 : 1
        const applyChanges = n => {
          this.updateNode(n.data.id, {
            x: (flipH ? n.y : n.x) * invertX + offsetX,
            y: (flipH ? n.x : n.y) * invertY + offsetY
          })
          n.children && n.children.forEach(applyChanges)
        }
        applyChanges(tree)
      })
    } else {
      throw new Error('unknown layout type ' + type)
    }
  }

  reset() {
    while (this.edges.length) {
      this.edges.pop()
    }
    while (this.nodes.length) {
      this.nodes.pop()
    }
  }

  createNode(fields = {}) {
    if (typeof fields === 'string') {
      fields = {id: fields} // support a single id string or an object as params
    }
    const node = Object.assign({
      id: uuid(),
      x: 0,
      y: 0,
      width: 50,
      height: 50,
    }, fields)

    this.nodes.push(node)
    return node
  }

  updateNode(node, fields = {}) {
    if (typeof node === 'string') node = this.nodes.find(n => n.id === node)
    if (!node) throw new Error(`node ${node} does not exist`)
    return Object.assign(node, fields)
  }

  removeNode(node) {
    const index = this.nodes.indexOf(node)
    if (index > -1) {
      this.nodes.splice(index, 1)
    }
    return index
  }

  createEdge(from, to, fields = {}) {
    if (arguments.length === 1) {
      // support calling with single argument
      fields = arguments[0]
      from = fields.from
      to = fields.to
    } else {
      // support passing node objects instead of ids
      if (typeof from === 'object') from = from.id
      if (typeof to === 'object') to = to.id
    }
    if (!from) throw new Error('orig required')
    if (!to) throw new Error('dest required')

    const edge = Object.assign({
      id: fields.id || `${from}@${to}`,
      from,
      to,
      fromAnchor: {x: '50%', y: '50%'},
      toAnchor: {x: '50%', y: '50%'},
      type: 'linear',
      pathd: '', // reactive path
    }, fields)

    this.edges.push(edge)
    return edge
  }

  updateEdge(edge, fields) {
    return Object.assign(edge, fields)
  }

  removeEdge(edge) {
    const index = this.edges.indexOf(edge)
    if (index > -1) {
      this.edges.splice(index, 1)
    }
    return index
  }

  reorderGraph() {
    for(let i = 0; i < 200; i++){
      let n = 0
      for(let node of this.nodes){
        for (let otherNode of this.nodes) {
          if(otherNode.id === node.id){
            continue
          }
          else{
            // distance(offset) between two nodes
            let dx = otherNode.x - node.x;
            let dy = otherNode.y - node.y;
            let offset = Math.sqrt(dx * dx + dy * dy);
            // if nodes is linked
            if(this.edges.find(edge => {
              return (edge.to === node.id && edge.from === otherNode.id) ||
                     (edge.from === node.id && edge.to === otherNode.id)
            })){
              if(offset < 500){
                if (offset < 400) {
                  if (offset < 200) {
                    // if linked nodes is so close, up distance between them
                    node.x -= dx;
                    node.y -= dy;
                  } else {
                    node.x -= dx / 3;
                    node.y -= dy / 3;
                  }
                } else {
                  //if linked nodes have medium distance, make them little closer and up force count
                  n++
                  node.x += dx / 6;
                  node.y += dy / 6;
                }
              }
              else{
                //if linked nodes have long distance, make them closer
                node.x += dx / 3;
                node.y += dy / 3;
              }
            }
            // if nodes isn't linked
            else{
              if(offset < 1000){
                if(offset < 100){
                  // if unlinked nodes is very close, make them much further
                  node.x -= dx * 3;
                  node.y -= dy * 3;
                }
                else{
                  // if unlinked nodes is medium close, make them further
                  if(offset < 500){
                    node.x -= dx / 3;
                    node.y -= dy / 3;
                  }
                  else{
                    // if unlinked nodes is not so close, make them little further
                    node.x -= dx / 9;
                    node.y -= dy / 9;
                  }
                }
              }
              else{
                // if distance between nodes is so long, up force count
                n++
              }
            }
          }
        }
        // move all nodes to start of coordinates
        let dx = 0 - node.x
        let dy = 0 - node.y
        node.x += dx / 15
        node.y += dy / 15
      }
      //if force of the nodes is 70% of all graph, graph is reorder
      if(n / (this.nodes.length * this.nodes.length) > 0.7){
        break
      }
    }
  }
}
