<template>
  <div class="wrapper">
    <div class="content">
      <div class="columns">
        <app-sidenav></app-sidenav>
        <main>
          <router-view></router-view>
        </main>
      </div>
    </div>
  </div>
</template>
<script>
import AppSidenav from "./sidenav";
import { ref } from "vue"

export default {
  components: {
    AppSidenav
  },
  setup () {
    return {
      text: ref("hello vue3.0")
    }
  }
}
</script>