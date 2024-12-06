<template>
<defs>
  <template v-for="marker in all" :key="marker.id">
    <marker
      :id="marker.id" orient="auto"
      :markerWidth="marker.width * marker.scale"
      :markerHeight="marker.height * marker.scale"
      :refX="marker.refX"
      :refY="marker.refY"
      :viewBox="marker.viewBox"
      :stroke-width="2"
      stroke-linecap="round"
    >
      <path :d="marker.path" :style="marker.style">
      </path>
    </marker>
    <!-- <marker v-if="marker.type === 'arrow-start'"
      :id="marker.id" orient="auto"
      :markerWidth="13 * marker.scale"
      :markerHeight="13 * marker.scale"
      :refX="1 * marker.scale"
      :refY="5 * marker.scale">
        <path d="M0,5 L10,10 L10,0 L0,5"
          :style="`transform: scale(${marker.scale});${marker.style}`"/>
    </marker>
    <marker v-if="marker.type === 'arrow-end'"
      :id="marker.id" orient="auto"
      :markerWidth="13 * marker.scale"
      :markerHeight="13 * marker.scale"
      :refX="9 * marker.scale"
      :refY="5 * marker.scale">
        <path d="M0,0 L0,10 L10,5 L0,0"
        :style="`${marker.style};transform: scale(${marker.scale})`"/>
    </marker>
    <marker v-if="marker.type === 'square'"
      :id="marker.id" orient="auto"
      :markerWidth="5 * marker.scale"
      :markerHeight="5 * marker.scale"
      :refX="2.5 * marker.scale"
      :refY="2.5 * marker.scale">
        <rect x="0" y="0" width="5" height="5"
          :style="`transform: scale(${marker.scale});${marker.style}`">
        </rect>
    </marker>
    <marker v-if="marker.type === 'circle'"
      :id="marker.id"
      :markerWidth="10 * marker.scale"
      :markerHeight="10 * marker.scale"
      :refX="2.5 * marker.scale"
      :refY="2.5 * marker.scale">
        <circle cx="2.5" cy="2.5" r="2.5"
          :style="`transform: scale(${marker.scale});${marker.style}`">
        </circle>
    </marker>
    <marker v-if="marker.type === 'cross'" :id="marker.id"
      :markerWidth="13 * marker.scale" orient="auto"
      :markerHeight="13 * marker.scale"
      fill="none" refX="5" refY="5" position="50%">
       <path d="M 3,3 L 7,7 M 3,7 L 7,3"
          fill="none" stroke="green" stroke-width="2"
          :style="`transform: scale(${marker.scale});${marker.style}`"/>
     </marker>
     <marker v-if="marker.type === 'arrow-slim-start'"
      :id="marker.id" orient="auto"
      :markerWidth="13 * marker.scale"
      :markerHeight="13 * marker.scale"
      :refX="1 * marker.scale"
      :refY="5 * marker.scale"
      fill="none" stroke="green" stroke-width="2" stroke-linecap="round">
        <path d="M1,5 L9,9 M9,1 L1,5"
          :style="`transform: scale(${marker.scale});${marker.style}`"/>
    </marker>
    <marker v-if="marker.type === 'arrow-slim-end'"
      :id="marker.id" orient="auto"
      :markerWidth="15 * marker.scale"
      :markerHeight="15 * marker.scale"
      :refX="9 * marker.scale"
      :refY="5 * marker.scale" stroke-linecap="round"
      fill="none" stroke="green" stroke-width="2">
        <path d="M10,5 L1,1 M10,5 L1,9"
        :style="`transform: scale(${marker.scale});${marker.style}`"/>
    </marker> -->
  </template>
</defs>
</template>

<script>
/**
 * markers util used to generate and manage markers
 * each default template can be overriden (color, scale, etc)
 * markers component instance is available from Screen component
 */
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
},
{
  id: 'square',
  type: 'square',
  scale: 0.5,
  style: 'fill: green'
},
{
  id: 'circle',
  type: 'circle',
  scale: 0.5,
  style: 'fill: green'
},
{
  id: 'cross',
  type: 'cross',
  scale: 1,
  style: 'fill: none'
},
{
  id: 'arrow-slim-start',
  type: 'arrow-slim-start',
  scale: 0.5,
  style: 'fill: green'
},
{
  id: 'arrow-slim-end',
  type: 'arrow-slim-end',
  scale: 0.5,
  style: 'fill: green'
}]

export default {
  props: {
    markers: {
      type: Array,
      default: () => []
    } //[{ id:String, type:String, scale:Number, style:String }, ...]
  },
  computed: {
    all () {
      return this.markers
        .filter(m => m.path)
        .map(marker => {
          const tempSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          const tempPath = document.createElementNS("http://www.w3.org/2000/svg", "path");

          tempPath.setAttribute("d", marker.path);
          tempSvg.appendChild(tempPath);
          if (marker.strokeWidth) {
            tempPath.setAttribute("stroke-width", marker.strokeWidth.toString());
          }
          if (marker.strokeLinecap) {
            tempPath.setAttribute("stroke-linecap", marker.strokeLinecap.toString());
          }
          document.body.appendChild(tempSvg);
          const bbox = tempPath.getBBox();
          const width = bbox.width;
          const height = bbox.height;
          const refX = bbox.x + bbox.width / 2
          const refY = bbox.y + bbox.height / 2
          const viewBox = `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`
          document.body.removeChild(tempSvg);
          return Object.assign({ width, height, refX, refY, viewBox }, marker)
        })
        .filter(marker => marker)
    }
  }
}
</script>