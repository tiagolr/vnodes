<script>
import { Graphics, Text, Container } from 'pixi.js'
export default {
  props: {
    data: Object
  },

  data() {
    return {
      node: null
    }
  },

  inject: ['emitter', 'canvas'],

  render () { return null },

  mounted () {
    if (this.canvas.viewport) {
      this.mount()
    } else {
      this.emitter.once('ready', this.mount)
    }
  },

  beforeUnmount () {
    this.canvas.viewport.removeChild(this.node)
  },

  methods: {
    mount () {
      this.node = new Container({ x: this.data.x, y: this.data.y })
      const graphics = new Graphics()
        .roundRect(0, 0, this.data.width, this.data.height , 10)
        .fill(0xff0000);
      this.node.addChild(graphics)
      this.canvas.viewport.addChild(this.node)
      const text = new Text({
        text: this.data.id,
        style: {
          fill: 0xffffff,
        }
      })
      text.x = this.data.width / 2;
      text.y = this.data.height / 2;
      text.anchor.set(0.5)
      this.node.addChild(text)
    }
  }
}
</script>

<style scoped>

</style>