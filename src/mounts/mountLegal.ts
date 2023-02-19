import Vue from 'vue'
import Legal from '../views/wallet/Legal.vue'
import 'vue-datetime/dist/vue-datetime.css'

export const mountLegal = (el: string) => {
    const app = new Vue({
        render: (createElement) => {
            return createElement(Legal)
        },
    })
    app.$mount(el)
}
