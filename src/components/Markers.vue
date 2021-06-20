<template>
<g>
  <g v-for="marker in all" :key="marker.id">
    <marker v-if="marker.type === 'arrow-start'"
        :id="marker.id" orient="auto"
        :markerWidth="13 * marker.scale"
        :markerHeight="13 * marker.scale"
        :refX="1 * marker.scale"
        :refY="5 * marker.scale">
      <path d="M0,5 L10,10 L10,0 L0,5" :style="`${marker.style};transform: scale(${marker.scale})`"/>
    </marker>
    <marker v-if="marker.type === 'arrow-end'"
        :id="marker.id" orient="auto"
        :markerWidth="13 * marker.scale"
        :markerHeight="13 * marker.scale"
        :refX="9 * marker.scale"
        :refY="5 * marker.scale">
      <path d="M0,0 L0,10 L10,5 L0,0" :style="`${marker.style};transform: scale(${marker.scale})`"/>
    </marker>
  </g>
</g>
</template>

<script>
const defaults = [{
  id: 'arrow-start',
  type: 'arrow-start',
  scale: 0.5,
  style: 'fill: green'
},
{
  id: 'arrow-end',
  type: 'arrow-end',
  scale: 0.5,
  style: 'fill: green'
}]

export default {
  props: {
    // array of marker objects { id:String, type:String, scale:Number, style:String }
    markers: Array
  },
  computed: {
    all () {
      return this.markers
        .concat(defaults)
        .map(marker => {
          const base = defaults.find(d => d.type === marker.type)
          if (!base) {
            console.error('unknown marker', marker)
          } else {
            return Object.assign({}, base, marker)
          }
        })
        .filter(marker => marker)
    }
  }
}
</script>