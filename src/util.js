import boxIntersect from 'box-intersect'

/**
 * Simple algorithm to position node on graph
 * Positions node parallel to the parent
 */
function findPosition (node, parent, align="right", collisions, sep={ x: 40, y: 40 }, invertOffset=false) {
  const sepX = sep.x || sep
  const sepY = sep.y || sep
  const startX = !parent ? 0
  : (align === 'down' || align === 'up')
  ? parent.x
  : align === 'right'
  ? parent.x + parent.width + sepX
  : align === 'left'
  ? parent.x - node.width - sepX
  : -1

  const startY = !parent ? 0
    : (align === 'right' || align === 'left')
      ? parent.y
    : align === 'down'
      ? parent.y + parent.height + sepY
    : align === 'up'
      ? parent.y - node.height - sepY
    : -1

  const boxes = (collisions)
    .filter(n => n.id !== node.id)
    .map(n => [n.x, n.y, n.x + n.width, n.y + n.height])

  const nodebox = [ // [ x1, y1, x2, y2 ]
    startX,
    startY,
    startX + node.width,
    startY + node.height
  ]

  // find node position perpendicular to its parent
  const offsetX = (align === 'down' || align === 'up')
    ? sepX * (invertOffset ? -1 : 1) : 0

  const offsetY = (align === 'right' || align === 'left')
    ? sepY * (invertOffset ? -1 : 1) : 0

  let cols = boxIntersect(boxes, [ nodebox ])
  while (cols.length) {
    const col = collisions[cols[0][0]]
    if (offsetX) {
      if (offsetX > 0) {
        nodebox[0] = col.x + col.width + offsetX
        nodebox[2] = col.x + col.width + node.width + offsetX
      } else {
        nodebox[0] = col.x - node.width + offsetX
        nodebox[2] = col.x + offsetX
      }
    } else {
      if (offsetY > 0) {
        nodebox[1] = col.y + col.height + offsetY
        nodebox[3] = col.y + col.height + node.height + offsetY
      } else {
        nodebox[1] = col.y - node.height + offsetY
        nodebox[3] = col.y + offsetY
      }
    }
    cols = boxIntersect(boxes, [ nodebox ])
  }

  return { x: nodebox[0], y: nodebox[1]}
}

function createDAG (nodes, edges) {
  const _nodes = nodes.map(node => ({
    id: node.id,
    x: node.x,
    y: node.y,
    width: node.width,
    height: node.height,
    parentIds: [],
    children: []
  }))

  const visited = {}
  edges.forEach(c => {
    if (visited[c.from+c.to]) return
    visited[c.from+c.to] = true

    const from = _nodes.find(node => node.id === c.from)
    const to = _nodes.find(node => node.id === c.to)
    if (from && to) {
      from.children.push(to)
      to.parentIds.push(from.id)
    }
  })

  removeCycles(_nodes)
  return _nodes
}

/**
 * Detect and remove cycles from graph
 */
const removeCycles = (nodes) => {
  const cycles = []
  const unvisited = node => node.state === 0
  const visiting = node => node.state === 1
  const visited = node => node.state === 2
  nodes.forEach(node => { node.state = 0 })

  const visit = (node) => {
    node.state = 1 // visiting
    node.children.forEach(child => {
      if (visited(child)) return
      if (visiting(child)) {
        // FOUND CYCLE
        node.children.splice(node.children.indexOf(child), 1)
        child.parentIds.splice(child.parentIds.indexOf(node.id), 1)
        cycles.push(`${child.id}:${node.id}`)
      } else {
        visit(child)
      }
    })
    node.state = 2 // visited
  }

  nodes.forEach(node => {
    if (unvisited(node)) {
      visit(node)
    }
  })

  return cycles
}

// convert dag into structure for flextree layout
const dagToFlextree = (node, graph, flipXY=false, spacing=40) => {
  const entry = {
    id: node.id,
    size: [
      (flipXY ? node.height : node.width) + spacing,
      (flipXY ? node.width: node.height) + spacing
    ],
    children: []
  }
  graph.push(entry)
  node.children.forEach(child => {
    dagToFlextree(child, entry.children, flipXY, spacing)
  })
}

export default {
  findPosition,
  createDAG,
  dagToFlextree
}