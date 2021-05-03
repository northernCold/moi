<template>
  <aside class="nav-first">
    <nav class="primary-nav">
      <router-link
        to="index"
        v-tooltip.right="'home'"
        :class="linkActive('/')">
        <app-logo alt style="height: 24px;"></app-logo>
      </router-link>
      <router-link
        to="realtime"
        v-tooltip.right="'realtime'"
        :class="linkActive('/realtime')">
        <svg-icon icon-class="language"></svg-icon>
      </router-link>
      <router-link
        to="graphql"
        v-tooltip.right="'graphql'"
        :class="linkActive('/graphql')">
        <svg-icon icon-class="graphql"></svg-icon>
      </router-link>
      <router-link
        to="doc"
        v-tooltip.right="'documentation'"
        :class="linkActive('/doc')">
        <svg-icon icon-class="topic"></svg-icon>
      </router-link>
      <router-link
        to="settings"
        v-tooltip.right="'settings'"
        :class="linkActive('/settings')">
        <svg-icon icon-class="settings"></svg-icon>
      </router-link>
    </nav>
    <nav class="secondary-nav">
      <a>
        <svg-icon icon-class="cloud_upload"></svg-icon>
      </a>
      <a>
        <svg-icon icon-class="toc"></svg-icon>
      </a>
      <a>
        <svg-icon icon-class="cloud_download"></svg-icon>
      </a>
    </nav>
  </aside>
</template>
<script>
import AppLogo from "./logo";
import { useRoute } from "vue-router"

export default {
  components: {
    AppLogo
  },
  setup() {
    const route = useRoute();
    const linkActive = path => ({
      "link-exact-active": route.path === path,
      "link-active": route.path === path
    })

    return {
      linkActive
    }
  }
}
</script>
<style lang="scss" scoped>
$responsiveWidth: 768px;

.nav-first {
  ::v-deep .svg-icon {
    font-size: 24px;
  }
}

.nav-first {
  @apply z-10;
  @apply h-screen;
  @apply p-2;
  @apply bg-bgDarkColor;
  @apply transition;
  @apply ease-in-out;
  @apply duration-150;
  @apply space-y-2;
}

nav.primary-nav {
  @apply flex;
  @apply flex-col;
  @apply flex-nowrap;
  @apply items-center;
  @apply justify-center;
  @apply space-y-2;
  @apply w-full;

  svg {
    @apply fill-current;
  }

  a {
    @apply inline-flex;
    @apply items-center;
    @apply justify-center;
    @apply flex-shrink-0;
    @apply p-4;
    @apply rounded-full;
    @apply bg-bgLightColor;
    @apply text-fgLightColor;
    @apply fill-current;
    @apply outline-none;
    @apply transition;
    @apply ease-in-out;
    @apply duration-150;
  
    &:hover {
      @apply text-fgColor;
      @apply fill-current;

      svg {
        @apply fill-current;
      }
    }

    &.link-exact-active {
      @apply bg-acColor;
      @apply text-actColor;
      @apply fill-current;

      border-radius: 16px;

      svg {
        @apply fill-current;
      }
    }
  }
}

nav.primary-nav::-webkit-scrollbar,
.nav-first::-webkit-scrollbar {
  @apply hidden;
}

nav.secondary-nav {
  @apply flex;
  @apply flex-col;
  @apply flex-nowrap;
  @apply items-center;
  @apply justify-center;
  @apply border-t-2;
  @apply border-dashed;
  @apply border-brdColor;
  @apply pt-2;
  @apply space-y-2;

  a {
    @apply inline-flex;
    @apply items-center;
    @apply justify-center;
    @apply flex-shrink-0;
    @apply p-4;
    @apply rounded-full;
    @apply bg-bgDarkColor;
    @apply text-fgLightColor;
    @apply fill-current;
    @apply outline-none;
    @apply transition;
    @apply ease-in-out;
    @apply duration-150;

    &:hover {
      @apply text-fgColor;
      @apply fill-current;
    }

    &.current {
      @apply text-acColor;
      @apply fill-current;
    }
  }
}
</style>