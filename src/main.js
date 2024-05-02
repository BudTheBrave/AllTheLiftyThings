import { createApp } from 'vue'
import App from './App.vue'
import router from "./router"
import { initFirebase } from './firebase/index'
import pinia from './stores/index';
import VueSidebarMenu from 'vue-sidebar-menu'
import './styles/sidebarOverride.scss'
import './styles/_variables.scss'

initFirebase;

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(VueSidebarMenu)


app.mount('#app')






