<template>
  <div id="markers-demo" class="demo">
    <div class="viewport">
      <screen ref="screen" v-if="visible">
        <template #edges>
          <edge v-for="(edge, i) in edges" :key="i" :data="edge" :nodes="nodes">
          </edge>

          <v-marker :edge="edges[0]" :perc="100">
            <path :style="`fill:${color};stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:5.2`" d="M2.936 1.722 1.57 2.51.204 3.3V.143L1.57.933z" transform="scale(6)"/>
          </v-marker>
          <v-marker :edge="edges[0]" :perc="0">
            <path :style="`fill:${color};stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:5.2`" d="m.008 2.65 2.636-1.331L5.281-.015v5.332L2.644 3.983Z" transform="scale(3.5)"/>
          </v-marker>

          <v-marker :edge="edges[1]" :perc="100">
            <rect x="0" y="0" width="15" height="15" :fill="color"/>
          </v-marker>
          <v-marker :edge="edges[1]" :perc="0">
            <rect x="0" y="0" width="15" height="15" :fill="color"/>
          </v-marker>

          <v-marker :edge="edges[2]" :perc="100">
            <circle cx="8" cy="8" r="8" :fill="color"/>
          </v-marker>
          <v-marker :edge="edges[2]" :perc="0">
            <circle cx="8" cy="8" r="8" :fill="color"/>
          </v-marker>

          <v-marker :edge="edges[3]" :perc="100" :offset="{x:0, y: -1}">
            <path :stroke="color" d="M10.875 1.125L1.125 10.875M1.125 1.125L10.875 10.875" stroke="#090909" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" transform="scale(1.3)"/>
          </v-marker>
          <v-marker :edge="edges[3]" :perc="0" :offset="{x:0, y: -1}">
            <path :stroke="color" d="M10.875 1.125L1.125 10.875M1.125 1.125L10.875 10.875" stroke="#090909" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" transform="scale(1.3)"/>
          </v-marker>

          <v-marker :edge="edges[4]" :perc="100" :offset="{x:-7, y: 0}">
            <path :fill="color" d="M16.4142 16.4142C17.1953 15.6332 17.1953 14.3668 16.4142 13.5858L3.68629 0.857864C2.90524 0.0768158 1.63891 0.0768158 0.857864 0.857864C0.0768158 1.63891 0.0768158 2.90524 0.857864 3.68629L12.1716 15L0.857864 26.3137C0.0768158 27.0948 0.0768158 28.3611 0.857864 29.1421C1.63891 29.9232 2.90524 29.9232 3.68629 29.1421L16.4142 16.4142ZM14 17H15V13H14V17Z"/>

          </v-marker>
          <v-marker :edge="edges[4]" :perc="0" :offset="{x:7, y: 0}">
            <path :fill="color" d="M0.585786 16.4142C-0.195262 15.6332 -0.195262 14.3668 0.585786 13.5858L13.3137 0.857864C14.0948 0.0768158 15.3611 0.0768158 16.1421 0.857864C16.9232 1.63891 16.9232 2.90524 16.1421 3.68629L4.82843 15L16.1421 26.3137C16.9232 27.0948 16.9232 28.3611 16.1421 29.1421C15.3611 29.9232 14.0948 29.9232 13.3137 29.1421L0.585786 16.4142ZM3 17H2V13H3V17Z"/>
          </v-marker>

          <v-marker :edge="edges[5]" :perc="parseFloat(perc)" :offset="{x: 0, y: -17}">
            <path :fill="color" transform="scale(3)" d="M12.2059 4.4699L11.8973 4.47607L11.8954 4.47611H11.6967H11.6315L11.6091 4.41475L10.5534 1.5085C10.4725 1.28676 10.3257 1.09515 10.1325 0.9595C9.9393 0.82387 9.7092 0.75076 9.4732 0.75H8.47982C8.1883 0.75 7.95197 0.98633 7.95197 1.27785C7.95197 1.56937 8.1883 1.8057 8.47982 1.8057H9.4735H9.5386L9.561 1.86692L10.4677 4.35099L10.5133 4.47611H10.3801H7.39304H7.32761L7.30544 4.41448L7.08181 3.79346L7.03697 3.66876H7.23657L7.23782 3.66751V3.66876C7.52934 3.66876 7.76567 3.43243 7.76567 3.14091C7.76567 2.84939 7.52934 2.61306 7.23782 2.61306H5.37472C5.08321 2.61306 4.84687 2.84939 4.84687 3.14091C4.84687 3.43243 5.08321 3.66876 5.37472 3.66876H5.84049H5.90572L5.92801 3.73005L7.05827 6.8351L7.10379 6.96019H6.97075H6.55468H6.47811L6.46325 6.88506C6.19826 5.54197 5.07267 4.54851 3.66256 4.48221C1.94475 4.48218 0.43898 5.88875 0.5019 7.6054C0.56168 9.2364 1.86357 10.5 3.51167 10.5C4.99462 10.5 6.19228 9.4822 6.46321 8.0912L6.47792 8.0159H6.55468H9.163H9.2395L9.2544 8.091C9.5181 9.4277 10.6343 10.4182 12.035 10.4928C13.7282 10.5831 15.218 9.177 15.2179 7.4815C15.2177 5.79422 13.8932 4.4699 12.2059 4.4699ZM5.26295 8.0159H5.39322L5.35107 8.1392C5.07751 8.9393 4.30881 9.4959 3.38552 9.4405C2.41304 9.3821 1.60302 8.5591 1.55773 7.5859C1.50464 6.4451 2.38451 5.53185 3.51167 5.53185C4.37834 5.53185 5.09007 6.07342 5.35107 6.83692L5.39322 6.96019H5.26295H3.60484C3.3134 6.96019 3.07714 7.1964 3.07714 7.4879C3.07714 7.7794 3.3134 8.0159 3.60484 8.0159H5.26295ZM9.7961 5.68127C9.5307 6.03116 9.3385 6.43404 9.2545 6.88411L9.2403 6.96019H9.163H8.29352H8.2284L8.20604 6.89897L7.75267 5.65693L7.70699 5.53185H7.84011H9.7219H9.9094L9.7961 5.68127ZM12.1006 9.4416C11.0953 9.3912 10.2629 8.5211 10.2499 7.5146C10.242 6.89693 10.5114 6.36489 10.9342 6.00144L11.0364 5.91366L11.0825 6.04026L11.6462 7.5924C11.7457 7.866 12.0479 8.0073 12.3216 7.9083C12.596 7.8091 12.7377 7.5061 12.6381 7.2319L12.0687 5.663L12.0233 5.53807H12.1563C12.1558 5.53807 12.1565 5.53807 12.1587 5.5378C12.1611 5.5375 12.1639 5.53704 12.1689 5.53617C12.1768 5.53488 12.1938 5.53185 12.2121 5.53185C13.3069 5.53185 14.1683 6.39333 14.1683 7.488C14.1683 8.6181 13.2441 9.4989 12.1006 9.4416Z" fill="#090909"/>
          </v-marker>

          <text x="350" y="155" class="small">triangle</text>
          <text x="350" y="205" class="small">square</text>
          <text x="350" y="255" class="small">circle</text>
          <text x="350" y="305" class="small">cross</text>
          <text x="350" y="355" class="small">arrow</text>
        </template>
      </screen>
    </div>
    <div class="sidebar">
      <div>Position {{ perc }}</div>
      <input type="range" v-model="perc" min="0" max="100">
      <div>Color {{ color }}</div>
      <input type="range" v-model="colorPerc" min="0" max="100">
    </div>
  </div>
</template>

<script>
import Screen from '../components/Screen.vue'
import Node from '../components/Node.vue'
import Edge from '../components/Edge.vue'
import VMarker from '../components/Marker.vue'
import graph from '../graph'

export default {
  components: {
    Screen,
    Node,
    Edge,
    VMarker,
  },
  data() {
    return {
      perc: 50,
      colorPerc: 65,
      graph: new graph(),
      color: '#00f',
      visible: true,
      nodes: [
        {id: '1a', x: 100, y: 150, width: 1, height: 1},
        {id: '1b', x: 300, y: 150 , width: 1, height: 1},
        {id: '2a', x: 100, y: 200, width: 1, height: 1},
        {id: '2b', x: 300, y: 200, width: 1, height: 1},
        {id: '3a', x: 100, y: 250, width: 1, height: 1},
        {id: '3b', x: 300, y: 250, width: 1, height: 1},
        {id: '4a', x: 100, y: 300, width: 1, height: 1},
        {id: '4b', x: 300, y: 300, width: 1, height: 1},
        {id: '5a', x: 100, y: 350, width: 1, height: 1},
        {id: '5b', x: 300, y: 350, width: 1, height: 1},
        {id: '6a', x: 480, y: 350, width: 1, height: 1},
        {id: '6b', x: 700, y: 150, width: 1, height: 1},
      ],
      edges: [
        { id: 'a1b1', from: '1a', to: '1b', type: 'smooth' },
        { id: 'a2b2', from: '2a', to: '2b', type: 'smooth' },
        { id: 'a3b3', from: '3a', to: '3b', type: 'smooth' },
        { id: 'a4b4', from: '4a', to: '4b', type: 'smooth' },
        { id: 'a5b5', from: '5a', to: '5b', type: 'smooth' },
        { id: 'a6b6', from: '6a', to: '6b', type: 'smooth' },
      ]
    }
  },
  mounted () {
    this.$refs.screen.panzoom.zoom(1.15)
  },
  watch: {
    colorPerc: {
      immediate: true,
      handler (val) {
        this.color = this.valueToColor(val)
      }
    }
  },
  methods: {
    valueToColor(value) {
      const v = Math.max(0, Math.min(100, value));
      const hue = (v / 100) * 360;
      const rgb = this.hslToRgb(hue, 1, 0.5);
      return `#${rgb[0].toString(16).padStart(2, '0')}${rgb[1].toString(16).padStart(2, '0')}${rgb[2].toString(16).padStart(2, '0')}`;
    },

    // HSL to RGB Conversion Function
    hslToRgb(h, s, l) {
      const c = (1 - Math.abs(2 * l - 1)) * s; // Chroma
      const x = c * (1 - Math.abs((h / 60) % 2 - 1)); // Intermediate value
      const m = l - c / 2;

      let r = 0, g = 0, b = 0;
      if (h >= 0 && h < 60) {
          r = c; g = x; b = 0;
      } else if (h >= 60 && h < 120) {
          r = x; g = c; b = 0;
      } else if (h >= 120 && h < 180) {
          r = 0; g = c; b = x;
      } else if (h >= 180 && h < 240) {
          r = 0; g = x; b = c;
      } else if (h >= 240 && h < 300) {
          r = x; g = 0; b = c;
      } else if (h >= 300 && h < 360) {
          r = c; g = 0; b = x;
      }
      return [
          Math.round((r + m) * 255),
          Math.round((g + m) * 255),
          Math.round((b + m) * 255)
      ];
    }
  }
}
</script>

<style>
#markers-demo .edge {
  stroke: v-bind('color');
}
</style>