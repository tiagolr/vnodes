/**
 * Simple algorithm to position node on graph
 * Positions node parallel to the parent
 */
function findPosition (node, parent, align="right", nodes, sep={ x: 40, y: 40 }, invertOffset=false) {
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

  const boxes = (nodes)
    .filter(n => n.id !== node.id)
    .map(n => [n.x, n.y, n.width, n.height])

  const nodebox = [ // [ x1, y1, x2, y2 ]
    startX,
    startY,
    node.width,
    node.height
  ]

  // find node position perpendicular to its parent
  const alignV = align === 'down' || align === 'up'
  const alignH = align === 'right' || align === 'left'
  const offsetX = alignV ? sepX * (invertOffset ? -1 : 1) : 0
  const offsetY = alignH ? sepY * (invertOffset ? -1 : 1) : 0

  let cols = boxBoxes(nodebox, boxes)
  while (cols.length) {
    const col = { x: cols[0][0], y: cols[0][1], width: cols[0][2], height: cols[0][3]}
    if (offsetX) {
      nodebox[0] = col.x + offsetX + (offsetX > 0 ? col.width : -node.width)
    } else {
      nodebox[1] = col.y + offsetY + (offsetY > 0 ? col.height : -node.height)
    }
    cols = boxBoxes(nodebox, boxes)
  }

  return { x: nodebox[0], y: nodebox[1]}
}

function boxBox(x1, y1, w1, h1, x2, y2, w2, h2) {
    return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2
}

function boxBoxes(box, boxes) {
  return boxes.filter(b => boxBox(b[0], b[1], b[2], b[3], box[0], box[1], box[2], box[3]))
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