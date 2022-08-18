<template>
  <foreignObject
    class="node"
    :class="!fit && 'fill'"
    :x="data.x - margin"
    :y="data.y - margin"
    :width="data.width + margin * 2"
    :height="data.height + margin * 2"
    @mousedown="onMousedown">
      <div class="outer" :style="`padding: ${margin}px;`">
        <div class="content" :class="background && 'background'" ref="content" v-bind="$attrs">
          <div v-if="!$slots.default" class="default-label">
            {{ data.id }}
          </div>
          <slot>
          </slot>
        </div>
      </div>
  </foreignObject>
</template>

<script>
import dragMixin from '../mixins/drag'
export default {
  mixins: [
    dragMixin
  ],
  props: {
    data: {
      // { x, y, width, height }
    },
    margin: { // margin allows to display borders, shadow etc without clipping contents
      type: Number,
      default: 10,
    },
    useDrag: { // use default drag behavior
      type: Boolean,
      default: true
    },
    fit: {  // fit node width/height when mounted
      type: Boolean,
      default: true
    },
    background: { // show background
      type: Boolean,
      default: true
    },
    textSelect: { // allow text selection
      type: Boolean,
      default: false
    },
  },
  mounted () {
    if (this.fit) {
      this.fitContent()
    }
    this.$on('drag', ({ x, y }) => {
      this.data.x += x
      this.data.y += y
    })
  },
  methods: {
    fitContent () {
      this.data.width = this.$refs.content.offsetWidth
      this.data.height = this.$refs.content.offsetHeight
    },
    onMousedown (e) {
      if (!this.textSelect) {
        e.preventDefault() // prevent text select
      }
      if (this.useDrag) {
        e.stopPropagation() // prevent viewport drag
        this.startDrag(e)
      }
    }
  }
}
</script>

<style>
.node .content {
  position: relative;
  white-space: nowrap;
  width: fit-content;
}

.node .background {
  background-color: rgba(100, 200, 100, .9);
  border-radius: 7px;
}

.node.fill .outer,
.node.fill .content,
.node.fill .content > * {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.default-label {
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