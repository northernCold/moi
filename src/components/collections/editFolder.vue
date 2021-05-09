<template>
  <SmartModal v-if="show" @close="show = false">
    <div slot="header">
      <div class="row-wrapper">
        <h3 class="title">编辑文件夹</h3>
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
        :placeholder="folder.name"
        @keyup.enter="onEditFolder"
      />
    </div>
    <div slot="footer">
      <div class="row-wrapper">
        <span></span>
        <span>
          <button class="icon" @click="onHideModal">取消</button>
          <button class="icon primary" @click="onEditFolder">保存</button>
        </span>
      </div>
    </div>
  </SmartModal>
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
    show: Boolean,
    collectionIndex: Number,
    folder: Object,
    folderIndex: Number,
  },
  emits: ["hide-modal"],
  setup(props, context) {
    const store = useStore();
    let name = ref("");
    
    const onEditFolder = () => {
      store.commit("postwoman/editFolder", {
        collectionIndex: props.collectionIndex,
        folder: { ...props.folder, name: name.value },
        folderIndex: props.folderIndex,
        folderName: props.folder.name
      });
    }
    const onHideModal = () => {
      context.emit("hide-modal");
    }

    return {
      ...toRefs(props),
      name,
      onEditFolder,
      onHideModal
    }
  }
}
</script>