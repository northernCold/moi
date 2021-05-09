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
        tabs.tabs.forEach(tab => {
          tab.isActive = tab.id === tabs.currentName.value
        })
        isActive.value = tabs.currentName.value === props.id;
      }
    )
    onMounted(() => {
      isActive.value = selected.value;
      if (selected.value) {
        tabs.currentName.value = props.id;
      }
    })
    return {
      isActive,
      ...toRefs(props)
    }
  }
}
</script>