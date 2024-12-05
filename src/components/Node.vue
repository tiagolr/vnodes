<template>
  <div
    class="node"
    @mousedown="onMousedown"
    @touchstart="onMousedown"
    :style="nodeStyle"
  >
    <div v-if="!$slots.default" class="default-label">
      {{ data.id }}
    </div>
    <slot>
    </slot>
  </div>
</template>

<script>
import dragMixin from '../mixins/drag.js'
export default {
  mixins: [
    dragMixin
  ],
  props: {
    data: Object, // { x, y, width, height }
    margin: { // margin allows to display borders, shadow etc without clipping contents
      type: Number,
      default: 10,
    },
    fit: {
      type: Boolean,
      default: true,
    },
    useDrag: { // use default drag behavior
      type: Boolean,
      default: true
    },
  },
  emits: [
    'drag'
  ],
  computed: {
    nodeStyle: vm => ({
      left: vm.data.x + 'px',
      top: vm.data.y + 'px',
    })
  },
  mounted () {
    if (this.fit) {
      this.fitContent()
    }
  },
  methods: {
    onDrag ({ x,y }) {
      // eslint-disable-next-line vue/no-mutating-props
      this.data.x += x
      // eslint-disable-next-line vue/no-mutating-props
      this.data.y += y
      this.$emit('drag', { x, y })
    },
    /**
     * Update node width/height from the contents size
     */
    fitContent () {
      // eslint-disable-next-line vue/no-mutating-props
      this.data.width = this.$el.offsetWidth
      // eslint-disable-next-line vue/no-mutating-props
      this.data.height = this.$el.offsetHeight
    },
    onMousedown (e) {
      if (this.useDrag) {
        e.stopPropagation() // prevent viewport drag
        this.startDrag(e)
      }
    }
  }
}
</script>

<style>
.node {
  display: inline-flex;
  position: absolute;
  background-color: rgba(100, 200, 100, .9);
  border-radius: 7px;
}

.node .default-label {
  font-weight: bold;
  width: auto;
  height: auto;
  min-width: 30px;
  min-height: 30px;
  line-height: 30px;
  padding: 10px;
  text-align: center;
}
</style>