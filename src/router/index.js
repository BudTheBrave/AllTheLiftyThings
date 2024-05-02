import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../views/HomeView.vue"
import BrowseView from "../views/BrowseView.vue"
import StuntView from "../views/StuntView.vue"
import NotFoundView from "../views/NotFoundView.vue"
import ManageStuntView from "../views/AdminSubViews/StuntSubViews/ManageStuntView.vue"
import ManageUserView from "../views/AdminSubViews/UserSubViews/ManageUserView.vue"
import RegisterView from "../views/RegisterView.vue"
import SignInView from "../views/SignInView.vue"
import AddNewStuntView from '../views/AdminSubViews/StuntSubViews/AddNewStuntView.vue'
import updateOrDeleteStunt from '../views/AdminSubViews/StuntSubViews/UpdateOrDeleteStuntView.vue'
import ProfileView from '../views/ProfileView.vue'
import SearchView from "../views/SearchView.vue";
import DisplayStuntFromListView from '../views/DisplayStuntFromListView.vue'
const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: HomeView
        },
        {
            path: "/browse",
            name: "browse",
            component: BrowseView
        },
        {
            path: "/stunt/:id",
            name: "stunt",
            component: StuntView
        },
        {
            path: "/search",
            name: "search",
            component: SearchView
        },
        {
            path: "/favorited",
            name: "favorited",
            component: DisplayStuntFromListView,
            beforeEnter: (to, from, next) => {
                const userInfo = JSON.parse(sessionStorage.getItem("__Pinia_State__User"));
                to.params.ids = userInfo.userData.favorited || [];
                to.params.type = "Favorited"
                next();
            }
        },
        {
            path: "/bookmarked",
            name: "bookmarked",
            component: DisplayStuntFromListView,
            beforeEnter: (to, from, next) => {
                const userInfo = JSON.parse(sessionStorage.getItem("__Pinia_State__User"));
                to.params.ids = userInfo.userData.bookmarked || [];
                to.params.type = "Bookmarked"
                next();
            }
        },
        {
            path: "/completed",
            name: "completed",
            component: DisplayStuntFromListView,
            beforeEnter: (to, from, next) => {
                const userInfo = JSON.parse(sessionStorage.getItem("__Pinia_State__User"));
                to.params.ids = userInfo.userData.completed || [];
                to.params.type = "Completed"
                next();
            }
        },
        {
            path: '/register',
            name: "register",
            component: RegisterView
        },
        {
            path: '/signin',
            name: "sign in",
            component: SignInView,
            meta: {
                requiresSignOut: true
            }
        }, 
        {
            path: '/profile',
            name: "Profile",
            component: ProfileView,
            children: [
                {
                    path: "signOut",
                    name: "sign out",
                    component: ManageStuntView,
                },
            ],
            meta: {
                requiresSignIn: true
            }
        },
        {
            path: "/admin",
            children: [
                {
                    path: "manageStunt",
                    name: "manageStunts",
                    component: ManageStuntView,
                },
                {
                    path: "addNewStunt",
                    name: "addNewStunt",
                    component: AddNewStuntView,
                }, 
                {
                    path: "updateOrDeleteStunt",
                    name: "updateOrDeleteStunt",
                    component: updateOrDeleteStunt,
                },
                {
                    path: "manageUser",
                    name: "manage users",
                    component: ManageUserView
                }
            ],
            meta: {
                requiresAdmin: true
            }
        },
        {
            path: "/:pathMatch(.*)*",
            name: "Not Found",
            component: NotFoundView
        }
        
    ]
})



import { userSignOut } from "@/firebase/userOperations";
import { getCurrentUser } from "@/firebase";
import { useUserStore } from "@/stores/userStore";

router.beforeEach(async (to) => {
    const userStore = useUserStore()
    const userData = userStore.userData
    const user = await getCurrentUser()
    if(to.meta.requiresAdmin && !userData.admin) {
        return{
            path: "/",
            query: { redirect: to.fullPath}
        }
    }
    if(to.meta.requiresSignOut && user){
        return {
            path: "/profile",
            query: { redirect: to.fullPath}
        }
    } 
    if(to.meta.requiresSignIn && !user){
        return {
            path: "/signIn",
            query: { redirect: to.fullPath}
        }
    }
    if(to.path == "/profile/signOut"){
        userSignOut()
        return {
            path: "/",
            query: {redirect: to.fullPath}
        }
    }

});



export default router