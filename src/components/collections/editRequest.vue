<template>
  <SmartModal v-if="show" @close="onHideModal">
    <div slot="header">
      <div class="row-wrapper">
        <h3 class="title">编辑请求</h3>
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
        v-model="requestUpdateData.name"
        @keyup.enter="onSaveRequest"
        :placeholder="request.name"
      />
    </div>
    <div slot="footer">
      <div class="row-wrapper">
        <span></span>
        <span>
          <button class="icon" @click="onHideModal">关闭</button>
          <button class="icon primary" @click="onSaveRequest">保存</button>
        </span>
      </div>
    </div>
  </SmartModal>
</template>

<script>
import { reactive, toRefs } from 'vue';
import { useStore } from 'vuex';
export default {
  props: {
    show: Boolean,
    collectionIndex: Number,
    folderIndex: Number,
    folderName: String,
    request: Object,
    requestIndex: Number,
  },
  emits: ["hide-modal"],
  setup(props, context) {
    const store = useStore();
    let requestUpdateData = reactive({ name: "" });

    const onSaveRequest = () => {
      const requestUpdated = {
        ...props.request,
        name: requestUpdateData.name || props.request.name
      };

      store.commit("postwoman/editRequest", {
        requestCollectionIndex: props.collectionIndex,
        reqiestFolderName: props.folderName,
        requestFolderIndex: props.folderIndex,
        requestNew: requestUpdated,
        requestIndex: props.requestIndex,
        flag: "rest"
      });
      onHideModal();
    };
    const onHideModal = () => {
      context.emit("hide-modal")
    };

    return {
      ...toRefs(props),
      requestUpdateData,
      onSaveRequest,
      onHideModal
    }
  }
}
</script>
