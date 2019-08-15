import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import ConvertNumberHex from './components/ConvertNumberHex.vue'

Vue.use(VueAxios, axios);
Vue.component('convertnumberhex-component', ConvertNumberHex);
new Vue({
  el: '#app',
  data () {
    return {
      pageSetupContent: {},
    }
  },
  mounted () {
    axios
      .get('https://testbank.vn/frontend/web/function-check-vocabulary-lever/setup-page.html')
      .then(response => (this.pageSetupContent = response.data))
  }

});
