<template>
  <router-view v-slot="{ Component, route }" class="router-view-class">
    <transition :name="$route.meta.transitionName">
      <keep-alive :include="includeList">
        <component :is="Component" :key="route.path" />
      </keep-alive>
    </transition>
  </router-view>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import * as echarts from 'echarts'
import { provide } from 'vue'
import 'animate.css';

export default {
  name: 'App',
  data() {
    return {
      includeList: [],
    }
  },

  components: {
    // HelloWorld
  },

  watch: {
    $route: {
      handler(to, from, p1) {
        if (window.event && window.event.type=='popstate') {
          this.$route.isback = true
        } else {
          this.$route.isback = undefined
        }
        // console.info("watch $route handler", to)
        // console.info(to, from)

        // 根据route中keepAlive
        if(to.meta.keepAlive !== false && this.includeList.indexOf(to.name) === -1){
          this.includeList.push(to.name);
          // console.log(this.includeList);
        }

        if (window.event && window.event.type === "popstate") {
          to.meta.transitionName = "slide-out";
        } else {
          if (to.meta.level > from.meta.level) {
            to.meta.transitionName = "slide-in";
          } else {
            to.meta.transitionName = "slide-out";
          }
        }

        if (from.meta.pop == true) {
          to.meta.transitionName = "fade";
        }
      },
      deep: true
    }
  },

  methods: {
    onCloseModal(e) {
      console.info(e, this.$route)
      history.pushState(null, null, document.URL);
    }
  },

  mounted() {
	},
  
  setup(){
    provide('ec',echarts)//provide
    provide('dsBridge',dsBridge)
  }
  
}
</script>

<style>
  @import 'assets/main.css';
</style>
<style>
.router-view-class {
  min-height: 100vh;
  width: 100vw;
  overflow: hidden;
}

#app {
  overflow: hidden;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
  background: #f8f8f8;
}

/* slide-in */
.slide-in-enter-active,
.slide-out-leave-active {
  position: absolute;
  z-index: 99;
  top:0; left:0;
  width: 100vw;
  transition: all .3s;
} 

.slide-in-enter-from, 
.slide-out-leave-to {
  width: 100vw;
  /* opacity: 0; */
  transform: translateX(100%);
}

.slide-in-leave-active, 
.slide-out-enter-active {
  width: 100vw;
  transition: all .3s;
} 

.slide-in-leave-to, 
.slide-out-enter-from {
  width: 100vw;
  transform: translateX(-100%);
}

/* fade */
.fade-enter-active,
.fade-leave-active {
  position: absolute;
  z-index: 99;
  top:0; left:0;
  transition: opacity .3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
