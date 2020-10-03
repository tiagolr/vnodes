import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

// TODO
//   - panzoom no screen, debugGraphics em Node, e Port
//   - rename :data to :model
//   - rename port -> anchor?
//   - CSS escape port ids

new Vue({
  render: h => h(App),
}).$mount('#app')