<template>
  <SmartModal v-if="show" @close="hideModal">
    <div slot="header">
      <div class="row-wrapper">
        <h3 class="title">确认</h3>
        <div>
          <button class="icon" @click="hideModal">
            <svg-icon icon-class="close"></svg-icon>
          </button>
        </div>
      </div>
    </div>
    <div slot="body" class="flex flex-col">
      <label>{{ title }}</label>
    </div>
    <div slot="footer">
      <div class="row-wrapper">
        <span></span>
        <span>
          <button class="icon" @click="hideModal">
            {{ no }}
          </button>
          <button class="icon primary" @click="resolve">
            {{ yes }}
          </button>
        </span>
      </div>
    </div>
  </SmartModal>
</template>

<script>
import SmartModal from "@/components/smart/modal";
import { onMounted, onUnmounted, toRefs } from 'vue';

export default {
  components: {
    SmartModal
  },
  emits: ["hide-modal", "resolve"],
  props: {
    show: Boolean,
    title: "",
    yes: {
      type: String,
      default: function () {
        return "是"
      },
    },
    no: {
      type: String,
      default: function () {
        return "否"
      },
    },
  },
  setup(props, context) {
    const hideModal = () => {
      context.emit("hide-modal");
    }
    const resolve = () => {
      context.emit("resolve");
    }
    const keyListener = e => {
      if (e.key === "Escape") {
        e.preventDefault();
        hideModal();
      }
    }
    
    onMounted(() => {
      document.addEventListener("keydown", keyListener);
    })

    onUnmounted(() => {
      document.addEventListener("keydown", keyListener);
    })

    return {
      ...toRefs(props),
      hideModal,
      resolve
    }
  },
}
</script>
