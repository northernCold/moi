<template>
  <smart-modal v-if="show" @close="onHideModal">
    <div slot="header">
      <div class="row-wrapper">
        <h3 class="title">新文件夹</h3>
        <div>
          <button class="icon" @click="onHideModal">
            <svg-icon icon-class="close"></svg-icon>
          </button>
        </div>
      </div>
    </div>
    <div slot="body" class="flex flex-col">
      <label for="selectLabel">名称</label>
      <input
        type="text"
        id="selectLabel"
        v-model="name"
        placeholder="我的新收藏夹"
        @keyup.enter="onAddNewCollection"
      />
    </div>
    <div slot="footer">
      <div class="row-wrapper">
        <span></span>
        <span>
          <button class="icon" @click="onHideModal">取消</button>
          <button class="icon primary" @click="onAddNewCollection">保存</button>
        </span>
      </div>
    </div>
  </smart-modal>
</template>
<script>
import { ref, toRefs } from 'vue'
import { useStore } from 'vuex';
export default {
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
        name,
        flag: "rest"
      });
      context.emit("hide-modal"); 
    };
    const onHideModal = () => {
      context.emit("hide-modal");
      name = "";
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