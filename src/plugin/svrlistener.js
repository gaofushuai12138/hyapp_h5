import {useStore} from "vuex" //1.从vuex中引入useStore

function startListen(store) {
  setInterval(function() {
    let cnt = store.state.store_count + 1
    store.commit("store_setCount", cnt)
  }, 1000)
}

export default startListen