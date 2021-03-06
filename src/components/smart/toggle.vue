<template>
  <div @click="onToggle()" class="inline-block cursor-pointer">
    <label class="toggle" :class="{ on: on }" ref="toggle">
      <span class="handle"></span>
    </label>
    <label class="pl-0 align-middle cursor-pointer">
      <slot />
    </label>
  </div>
</template>
<script>
import { ref } from 'vue';
export default {
  props: {
    on: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["change"],
  setup(props, context) {
    const toggle = ref(null);
    const onToggle = () => {
      const containsOnClass = toggle.classList.toggle("on");
      context.emit("change", containsOnClass);
    };
    return {
      toggle,
      onToggle
    }
  }
}
</script>
<style scoped lang="scss">
$useBorder: false;
$borderColor: var(--fg-light-color);
$activeColor: var(--ac-color);
$inactiveColor: var(--fg-light-color);
$inactiveHandleColor: var(--bg-color);
$activeHandleColor: var(--act-color);
$width: 32px;
$height: 16px;
$handleSpacing: 4px;
$transition: all 0.2s ease-in-out;

.toggle {
  @apply relative;
  @apply inline-block;
  @apply align-middle;
  @apply rounded-full;
  @apply p-0;
  @apply m-4;
  @apply cursor-pointer;
  @apply flex-shrink-0;

  width: $width;
  height: $height;
  border: if($useBorder, 2px solid $borderColor, none);
  background-color: if($useBorder, transparent, $inactiveColor);
  transition: $transition;
  box-sizing: initial;

  .handle {
    @apply absolute;
    @apply inline-block;
    @apply inset-0;
    @apply rounded-full;
    @apply pointer-events-none;

    transition: $transition;
    margin: $handleSpacing;
    background-color: $inactiveHandleColor;
    width: #{$height - ($handleSpacing * 2)};
    height: #{$height - ($handleSpacing * 2)};
  }

  &.on {
    background-color: $activeColor;
    border-color: $activeColor;

    .handle {
      background-color: $activeHandleColor;
      left: #{$width - $height};
    }
  }
}
</style>
