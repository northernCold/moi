<template>
  <section class="tabs-wrapper">
    <div class="tabs" :class="styles">
      <ul>
        <li
          v-for="(tab, index) in tabs"
          :class="{ 'is-active': tab.isActive}"
          :key="index"
          @keyup.enter="selectTab(index)"
        >
          <a :href="tab.href" @click="selectTab(tab)">
            <svg-icon v-if="tab.icon" :icon-lcass="tab.icon"></svg-icon>
            <span v-if="tab.label">{{tab.label}}</span>
          </a>
        </li>
      </ul>
    </div>
    <div class="tabs-details">
      <slot></slot>
    </div>
  </section>
</template>
<script>
import Section from "@/components/app/section";
import { getCurrentInstance, onMounted, provide, reactive, ref, watch, watchEffect } from 'vue';

export default {
  components: { Section },
  props: {
    styles: {
      type: String,
      default: ""
    }
  },
  setup(props, context) {
    let tabs = reactive([]);
    let currentName = ref("");
    const selectTab = ({id}) => {
      currentName.value = id;
    }
    tabs = reactive(context.slots.default().map(v => v.props));
    provide("tabs", {
      currentName,
      selectTab,
      tabs
    });
    return {
      selectTab,
      currentName,
      tabs,
      styles: props.styles
    }
  }
}
</script>
<style lang="scss" scoped>
.tabs-wrapper {
  @apply flex;
  @apply flex-col;
  @apply flex-nowrap;
  @apply flex-1;

  .tabs {
    @apply flex;
    @apply whitespace-nowrap;
    @apply overflow-auto;
    @apply mt-4;

    ul {
      @apply flex;
      @apply w-0;
    }

    li {
      @apply inline-flex;
      @apply items-center;
      @apply justify-center;

      a {
        @apply flex;
        @apply items-center;
        @apply justify-center;
        @apply py-2;
        @apply px-4;
        @apply text-fgLightColor;
        @apply text-sm;
        @apply rounded-lg;
        @apply cursor-pointer;
        @apply transition-colors;
        @apply ease-in-out;
        @apply duration-150;

        .svg-icon {
          @apply m-4;
        }

        &:hover {
          @apply text-fgColor;
        }
      }


      .svg-icon {
        @apply m-4;
      }

      &:hover {
        @apply text-fgColor;
      }

      &:focus a {
        @apply text-fgColor;
      }

      &.is-active a {
        @apply bg-brdColor;
        @apply text-fgColor;
      }
    }

  }
}

@media (max-width: 768px) {
  ul,
  ol {
    @apply flex-row;
    @apply flex-nowrap;
  }
}
</style>