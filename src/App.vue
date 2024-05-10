<template>
  <div class="appContainer">
    <sidebar-menu 
    :menu="menu" 
    :rtl="true"
    :hideToggle="true"
    :width="'250px'"
    :collapsed="toggleCollapse"
    @update:collapsed="onToggleCollapse"
    
    >
    </sidebar-menu>
    <div 
      @click="toggleCollapse = true"
      class="bodyContainer"
    >
      <myHeader />
      <!-- <NavBar /> -->
      <div class="body">
        <RouterView/>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterView, useRoute } from 'vue-router';
import { ref, watch, } from "vue"
import { useUserStore } from "./stores/userStore.js"
import { storeToRefs } from 'pinia';

//components
import myHeader from './components/myHeader.vue'
// import NavBar from './components/NavBar.vue';

const userStore = useUserStore();
const {user, userData} = storeToRefs(userStore)
const defaultProfileIcon = require("./assets/profileIcon.jpeg");

// const userEmail = ref();


const menu = ref(
    [
        {
            header: 'Main Navigation',
            hiddenOnCollapse: true,
            hidden: false,
        },
        {
            href: '/signIn',
            title: "Sign In",
            icon: {
              element: "img",
              class: "fa fa-user",
              attributes: { src: defaultProfileIcon }
            },
        },
        {
            href: '/profile',
            title: "",
            hidden: true,
            icon: {
              element: "img",
              class: "fa fa-user",
              attributes: { src: defaultProfileIcon }
            },
            child: [
                {
                  href: "/profile/signOut",
                  title: "Sign Out",
                }, 
            ]
        },
        {
            href: '/',
            title: 'Home',
            icon: {
              element: "img",
              attributes: { src: require('./assets/homeIcon.png')}
            }
        },
        {
            href: '/browse',
            title: 'Browse',
            icon: {
              element: "img",
              attributes: { src: require('./assets/browseIcon.png')}
            }
        },
        {
            href: '/search',
            title: 'Search',
            icon: {
              element: "img",
              attributes: { src: require('./assets/searchIcon.png')}
            }
        },
        {
            href: '/favorited',
            title: 'Favorited',
            hidden: true,
            icon: {
              element: "img",
              attributes: { src: require('./assets/favoriteLibary.png')}
            }      
        },
        {
            href: '/bookmarked',
            title: 'Bookmarked',
            hidden: true,
            icon: {
              element: "img",
              class: "max-size-image",
              attributes: { src: require('./assets/bookmarkLibary.png')}  
            } 
        },
        {
            href: '/completed',
            title: 'Completed',
            hidden: true,
            icon: {
              element: "img",
              attributes: { src: require('./assets/completedLibary.png')}
            }      
        },
        {
            title: 'Admin',
            hidden: true,
            icon: {
              element: "img",
              attributes: { src: require('./assets/adminIcon.png')}
            },
            child: [
                {
                    href: '/admin/manageStunt',
                    title: 'Manage Stunts',
                },
                {
                    href: '/admin/manageUser',
                    title: 'Manage User',
                }
            ],
        },
      ]
  ) 



function updateMenu(href, target, value){
  menu.value.forEach(obj => {
    const firstTarget = target[0]
    if(obj.href == href || obj.title == href) {
      if(firstTarget == "icon"){
        obj.icon.attributes.src = value
      } 
      else {
        obj[firstTarget] = value
      }
    }
  })
}

watch([user, userData], ()=>{
    updateMenu("/profile", 
              ["icon"], 
              (user.value.photoURL) ? user.value.photoURL : defaultProfileIcon)
    updateMenu("/profile", 
              ["title"], 
              (user.value.displayName) ? user.value.displayName : user.value.email)
    updateMenu("/profile",
              ["hidden"], 
              (user.value) ? false : true);
    updateMenu("Admin",
              ["hidden"],
              (userData.value.admin) ? false : true) 
    updateMenu("/signIn",
              ["hidden"], 
              (user.value) ? true : false);   
    updateMenu("/bookmarked",
              ["hidden"], 
              (user.value) ? false : true);
    updateMenu("/favorited",
              ["hidden"], 
              (user.value) ? false : true);
    updateMenu("/completed",
              ["hidden"], 
              (user.value) ? false : true);
})


const toggleCollapse = ref(true);
function onToggleCollapse() {
  toggleCollapse.value = false;
}



const route = useRoute();
watch(() => route.path, () => {
  toggleCollapse.value = true
})




</script>

<style lang="scss">

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--primary-text-color);
  background-color: var(--primary-bg-color);
  margin: 0px;
  padding: 0;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

a {
     text-decoration: none;
}

hr {
    border: 1px solid black;
    border-color: var(--primary-dark-bg-color);
}


</style>

<style scoped lang="scss"> 
.appContainer {
  display: flex;
  width: 100vw;
}


.bodyContainer{
  max-width: calc(100vw - 65px);
  height: 100vh;
}

.body {
  height: calc(100vh - 61px);
  background: linear-gradient(to bottom left, var(--primary-bg-color), var(--primary-dark-bg-color));
  padding-top: 5px;
}

.max-size-image {
  max-width: 100%;
  max-height: 100%; 
  width: auto;
  height: auto;
}
</style>
