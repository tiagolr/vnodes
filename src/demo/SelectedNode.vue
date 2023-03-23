<template>
  <div class="demo">
    <div class="viewport">
      <screen ref="screen" :markers="[]">
        <edge
          v-for="edge in graph.edges"
          :data="edge"
          :nodes="graph.nodes"
          :key="edge.id"
        >
        </edge>

        <node
          v-for="node in graph.nodes"
          :data="node"
          :key="node.id"
          :showDelete="true"
          @onSelect="onNodeSelect"
          @onDelete="onDelete"
        >
        </node>
      </screen>
    </div>
  </div>
</template>

<script>
import { Screen, Node, Edge, Group, graph } from "../../index";

export default {
  components: {
    Screen,
    Node,
    Edge,
    Group,
  },
  data() {
    return {
      graph: new graph(),
    };
  },
  mounted() {
    this.graph.createNode("A");
    this.graph.createNode({
      id: "B",
      x: 150,
      y: 50,
      data: [
        {
          id: "402ea6aa-85d8-4f6a-ba33-85cf600abcf4",
          type: "text",
          value: "",
          buttons: [],
        },
      ],
    });

    this.graph.createNode({
      id: "C",
      x: 250,
      y: 0,
      data: [
        {
          id: "402ea6aa-85d8-4f6a-ba33-85cf600abcf4",
          type: "text",
          value: "",
          buttons: [],
        },
      ],
    });

    this.graph.createNode({
      id: "D",
      x: 250,
      y: 100,
      data: [
        {
          id: "402ea6aa-85d8-4f6a-ba33-85cf600abcf4",
          type: "text",
          value: "",
          buttons: [],
        },
      ],
    });

    this.graph.createEdge({
      from: "A",
      to: "B",
      fromAnchor: "right",
      toAnchor: "left",
      type: "smooth",
    });

    this.$nextTick(() => {
      this.$refs.screen.zoomNodes(this.graph.nodes);
    });
  },
  methods: {
    onNodeSelect(data) {
      alert(JSON.stringify(data));
    },
    onDelete(nodeId) {
      // TODO
      // Write custom logic to remove edges while deleting node linked to another one
      const index = this.graph.nodes.findIndex((m) => m.id === nodeId);
      this.graph.nodes.splice(index, 1);
    },
  },
};
</script>

<style></style>
