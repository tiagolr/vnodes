<template>
  <g>
    <foreignObject
      class="node"
      :x="data.x"
      :y="data.y"
      :width="data.width"
      :height="data.height"
      @mousedown="onMousedown"
      >
      <div class="content" ref="content"
        @click="e => $emit('click', e)"
        :style="styleContent || {}"
        >
        <div v-if="!$slots.default" class="default-label">
          {{ data.id }}
        </div>
        <slot>
        </slot>
      </div>
    </foreignObject>
  </g>
</template>

<script>
import drag from '../mixins/drag'

export default {
  mixins: [
    drag
  ],
  props: {
    data: {
      x: Number,
      y: Number,
      width: Number,
      height: Number
    },
    disableDrag: Boolean,  // set false to override drag behavior
    disableFit: Boolean, // disable initial fitContent() call
    styleContent: Object,
  },
  mounted () {
    if (!this.disableFit) {
      this.fitContent()
    }
    this.$on('drag', ({ x, y }) => {
      this.data.x += x
      this.data.y += y
    })
  },
  methods: {
    /**
     * Override data width and height to the node contents
     */
    fitContent () {
      this.data.width = this.$refs.content.offsetWidth
      this.data.height = this.$refs.content.offsetHeight
    },
    onMousedown (e) {
      e.stopPropagation()
      if (!this.disableDrag) {
        e.preventDefault();
        this.startDrag();
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.content
  border-radius 7px
  background-color: rgba(100, 200, 100, .9)
  display inline-block
  position: relative

.default-label
  text-align center
  font-weight bold
  width auto
  height auto
  min-width 30px
  min-height 30px
  line-height 30px
  padding 10px
</style>