<template>
  <div v-show="isActive">
    <slot></slot>
  </div>
</template>
<script>
import { computed, getCurrentInstance, inject, onMounted, ref, toRefs, watch } from 'vue'
export default {
  props: {
    label: { type: String, default: '' },
    icon: { type: String, default: '' },
    id: { required: true },
    selected: {
      type: Boolean,
      default: false,
    }
  },
  setup(props) {
    let isActive = ref(false);
    let selected = ref(props.selected);
    let tabs = inject('tabs');
    watch(
      [tabs.currentName, isActive],
      () => {
        let currentTab = tabs.tabs.find(tab => tab.id === props.id)
        currentTab && (currentTab.isActive = isActive.value);
      }
    )
    watch(
      () => tabs.currentName,
      () => {
        isActive.value = tabs.currentName.value;
      }
    )
    computed(() => {
      isActive.value = tabs.currentName.value;
    })
    onMounted(() => { isActive.value = selected.value })
    return {
      isActive,
      ...toRefs(props)
    }
  }
}
</script>