import { createPinia } from 'pinia';
// import { createPersistedState } from 'pinia-plugin-persistedstate';
import piniaPluginPersistedstate from "pinia-plugin-persistedstate"
const pinia = createPinia();

// const persistedLocalStorage = createPersistedState({
//     storage: localStorage,
//     beforeRestore: () =>{
//         console.log("RESTORING")
//     } ,
//     debug: true,
//     // Specify the key to use for storing the state
//     key: id => `pinia-state_${id}`,

// })
// pinia.use(persistedLocalStorage)

pinia.use(piniaPluginPersistedstate)


// let isTabHidden = false;

// // Detect when the visibility of the page changes
//  document.addEventListener('visibilitychange', () => {
//  if (document.visibilityState === 'hidden') {
//      isTabHidden = true;
//  }
// });


// // Add event listener for page refresh
// window.addEventListener('beforeunload', () => {
//     if (!isTabHidden){
//         // Iterate through all keys in local storage
//         for (let i = 0; i < localStorage.length; i++) {
//             const key = localStorage.key(i);
//             // Check if the key starts with "__Pinia_State__"
//             if (key.startsWith('__Pinia_State__')) {
//                 // Remove the item from local storage
//                 localStorage.removeItem(key);
//             }
//         }
//     }
// });



export default pinia