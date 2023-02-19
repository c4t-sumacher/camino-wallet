import Vue from 'vue'
import store from '@/store'
import VueMeta from 'vue-meta'
import router from '@/router'

import { Datetime } from 'vue-datetime'
import 'vue-datetime/dist/vue-datetime.css'
import i18n from '@/plugins/i18n'
import BootstrapVue from 'bootstrap-vue'
import vuetify from '@/plugins/vuetify'

Vue.use(VueMeta)
Vue.use(BootstrapVue)
Vue.component('datetime', Datetime)

import Access from '../views/wallet/access/Access.vue'
import KeySore from '../views/wallet/access/Keystore.vue'
import Mnemonic from '../views/wallet/access/Mnemonic.vue'
import PrivateKey from '../views/wallet/access/PrivateKey.vue'
import Menu from '../views/wallet/access/Menu.vue'
import Account from '../views/wallet/access/Account.vue'

function mountComponent(type: string) {
    switch (type) {
        case 'Keystore':
            return KeySore
        case 'Mnemonic':
            return Mnemonic
        case 'Menu':
            return Menu
        case 'PrivateKey':
            return PrivateKey
        case 'Account':
            return Account
        default:
            return Access
    }
}

export const mountAccessComponents = (el: string, type: string, props: any) => {
    const { setUpdateStore, setAccount } = props
    const MyPlugin = {
        install(Vue: any) {
            Vue.prototype.globalHelper = () => {
                return {
                    updateSuiteStore: (s: any) => {
                        setUpdateStore(s)
                    },
                    setAccount: () => {
                        setAccount(true)
                    },
                }
            }
        },
    }
    Vue.use(MyPlugin)
    const app = new Vue({
        router,
        store,
        vuetify,
        i18n,
        data: {},
        created: function () {
            store.commit('Accounts/loadAccounts')
        },
        render: (createElement) => {
            const context = {
                props: props,
            }
            return createElement(mountComponent(type), context)
        },
    })
    app.$mount(el)
}
