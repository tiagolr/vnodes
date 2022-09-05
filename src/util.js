/**
 * Simple algorithm to position node on graph
 * Starts looking for position in front of the parent
 * While collisions are detected find empty position perpendicular to collision
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

  const alignV = align === 'down' || align === 'up'
  const alignH = align === 'right' || align === 'left'
  const offsetX = alignV ? sepX * (invertOffset ? -1 : 1) : 0
  const offsetY = alignH ? sepY * (invertOffset ? -1 : 1) : 0

  const boxes = (nodes).filter(n => n.id !== node.id)
  const box = { x: startX, y: startY, width: node.width, height: node.height }

  let cols = boxBoxes(box, boxes)
  while (cols.length) {
    const col = cols[0]
    if (offsetX) {
      box.x = col.x + offsetX + (offsetX > 0 ? col.width : -node.width)
    } else {
      box.y = col.y + offsetY + (offsetY > 0 ? col.height : -node.height)
    }
    cols = boxBoxes(box, boxes)
  }

  return { x: box.x, y: box.y }
}

function boxBox(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y
}

function boxBoxes(box, boxes) {
  return boxes.filter(b => boxBox(b, box))
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

function lineRect(x1, x2, y1, y2, rect) {
  const box = [ rect.x, rect.y, rect.x + rect.width, rect.y + rect.height]
  const intersections = [
    lineLine(x1, y1, x2, y2, box[0], box[1], box[0], box[3]), // left
    lineLine(x1, y1, x2, y2, box[0], box[1], box[2], box[1]), // top
    lineLine(x1, y1, x2, y2, box[2], box[1], box[2], box[3]), // right
    lineLine(x1, y1, x2, y2, box[0], box[3], box[2], box[3]) // bottom
  ].filter(i => i)

  return intersections
    .map(i => Object.assign(i, { distance: Math.sqrt((x1 - i.x) ** 2 + (y1 - i.y) ** 2) }))
    .sort((a, b) => a.distance < b.distance ? 1 : -1) // order intersections by distance
    .pop()
}

const eps = 0.0000001;
function between(a, b, c) {
  return a - eps <= b && b <= c + eps;
}
function lineLine(x1, y1, x2, y2, x3, y3, x4, y4) {
  var x = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) /
    ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
  var y = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) /
    ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
  if (isNaN(x) || isNaN(y)) {
    return false;
  } else {
    if (x1 >= x2) {
      if (!between(x2, x, x1)) {
        return false;
      }
    } else {
      if (!between(x1, x, x2)) {
        return false;
      }
    }
    if (y1 >= y2) {
      if (!between(y2, y, y1)) {
        return false;
      }
    } else {
      if (!between(y1, y, y2)) {
        return false;
      }
    }
    if (x3 >= x4) {
      if (!between(x4, x, x3)) {
        return false;
      }
    } else {
      if (!between(x3, x, x4)) {
        return false;
      }
    }
    if (y3 >= y4) {
      if (!between(y4, y, y3)) {
        return false;
      }
    } else {
      if (!between(y3, y, y4)) {
        return false;
      }
    }
  }
  return { x, y }
}

export default {
  findPosition,
  createDAG,
  dagToFlextree,
  boxBox,
  boxBoxes,
  lineLine,
  lineRect
}