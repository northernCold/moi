<template>
  <fieldset :id="label.toLowerCase()">
    <legend v-if="!noLegend" @click.prevent="collapse">
      <span>{{label}}</span>
      <svg-icon :icon-class="isCollapsed(label) ? 'expand_more' : 'expand_less'"></svg-icon>
    </legend>
    <div class="collapsible" :class="{ hidden: isCollapsed(label.toLowerCase())}">
      <slot></slot>
    </div>
  </fieldset>
</template>
<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

export default {
  props: {
    label: {
      type: String,
      default: "Section"
    },
    noLegend: {
      type: Boolean,
      default: false,
    }
  },
  setup(props) {
    const { label, noLegend } = props;
    const route = useRoute();
    const store = useStore();
    const sectionString = computed(() => `${route.path.replace(/\/+$/), ''}/${label}`);

    const collapse = () => {
      store.commit('setCollapsedSection', sectionString);
    }
    const isCollapsed = _label =>
    {
      return store.state.theme.collapsedSections.includes(sectionString || false);

    }
    
    return {
      sectionString,
      collapse,
      label,
      noLegend,
      isCollapsed
    }
  }
}
</script>
<style scoped lang="scss">
fieldset {
  @apply my-4;
  @apply rounded-lg;
  @apply bg-bgDarkColor;
  @apply transition;
  @apply ease-in-out;
  @apply duration-150;
  @apply w-full;

  legend {
    @apply px-4;
    @apply text-fgColor;
    @apply font-bold;
    @apply cursor-pointer;
  }
}
</style>