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
          placeholder="我的新文件"
          @keyup.enter="onAddFolder"
        />
      </div>
    </template>
    <template #footer>
      <div>
        <div class="row-wrapper">
          <span></span>
          <span>
            <button class="icon" @click="onHideModal">取消</button>
            <button class="icon primary" @click="onAddFolder">保存</button>
          </span>
        </div>
      </div>
    </template>
  </smart-modal>
</template>
<script>
import { ref, toRefs } from 'vue'
import SmartModal from "@/components/smart/modal";

export default {
  components: {
    SmartModal
  },
  props: {
    show: Boolean,
    folder: Object,
    folderPath: String,
    collectionIndex: Number,
  },
  emits: ["add-folder", "hide-modal"],
  setup(props, context) {
    let name = ref("");
    
    const onAddFolder = () => {
      context.emit("add-folder", {
        name: name.value,
        folder: props.folder,
        path: props.folderPath || `${props.coolectionIndex}`
      });
    };
    const onHideModal = () => {
      debugger;
      context.emit("hide-modal");
    }

    return {
      ...toRefs(props),
      name,
      onAddFolder,
      onHideModal
    }
  }
}
</script>