<template>
  <smart-modal v-if="show" @close="onHideModal">
    <template #header>
      <div>
        <div class="row-wrapper">
          <h3 class="title">新文件夹</h3>
          <div>
            <button class="icon" @click="onHideModal">
              <svg-icon icon-class="close"></svg-icon>
            </button>
          </div>
        </div>
      </div>
    </template>
    <template #body>
      <div class="flex flex-col">
        <label for="selectLabel">名称</label>
        <input
          type="text"
          id="selectLabel"
          v-model="name"
          placeholder="我的新收藏夹"
          @keyup.enter="onAddNewCollection"
        />
      </div>
    </template>
    <template #footer>
      <div>
        <div class="row-wrapper">
          <span></span>
          <span>
            <button class="icon" @click="onHideModal">取消</button>
            <button class="icon primary" @click="onAddNewCollection">保存</button>
          </span>
        </div>
      </div>
    </template>
  </smart-modal>
</template>
<script>
import { ref, toRefs } from 'vue'
import { useStore } from 'vuex';
import SmartModal from "@/components/smart/modal";

export default {
  components: {
    SmartModal
  },
  props: {
    show: Boolean
  },
  emits: ["hide-modal"],
  setup(props, context) {
    let store = useStore();
    let name = ref("");

    const onAddNewCollection = () => {
      if (!name.value) {
        // to do toast
        return;
      }
      store.commit("postwoman/addNewCollection", {
        name: name.value,
        flag: "rest"
      });
      context.emit("hide-modal"); 
    };
    const onHideModal = () => {
      context.emit("hide-modal");
      name.value = "";
    };

    return {
      ...toRefs(props),
      name,
      onAddNewCollection,
      onHideModal
    }
  }
}
</script>