<template>
  <foreignObject
      class="node"
      :x="data.x - margin"
      :y="data.y - margin"
      :width="data.width + margin * 2"
      :height="data.height + margin * 2"
      @mousedown="onMousedown"
      :style="margin && `padding: ${margin}`"
    >
    <div class="content" ref="content">
      <div v-if="!$slots.default" class="default-label">
        {{ data.id }}
      </div>
      <slot>
      </slot>
    </div>
  </foreignObject>
</template>

<script>
import drag from '../mixins/drag'
export default {
  mixins: [
    drag
  ],
  props: {
    data: {},
    margin: {
      type: Number,
      default: 10, // margin allows border and out of bounds contents to display
    },
    disableDrag: Boolean,  // set false to override drag behavior
  },
  mounted () {
    this.fitContent()
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
      e.stopPropagation()
      if (!this.disableDrag) {
        e.preventDefault();
        this.startDrag();
      }
    }
  }
}
</script>

<style lang="stylus">
.node .content
  position relative
  border-radius 7px
  background-color: rgba(100, 200, 100, .9)
  display inline-block
  width: auto
  height: auto
  white-space: nowrap;
  width: fit-content;

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