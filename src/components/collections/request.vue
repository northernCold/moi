<template>
  <div>
    <div
      :class="['row-wrapper transition duration-150 ease-in-out', { 'bg-bgDarkColor': dragging }]"
      draggable="true"
      @dragstart="dragStart"
      @dragover.stop
      @dragleave="dragging = false"
      @dragend="dragging = false"
    >
      <div>
        <button
          class="icon"
          @click="!doc ? selectRequest() : {}"
          v-tooltip="!doc ? '复用该请求' : ''"
        >
          <span :class="getRequestLabelColor(request.method)">{{ request.method }}</span>
          <span>{{ request.name }}</span>
        </button>
      </div>
      <v-popover>
        <button class="tooltip-target icon" v-tooltip="'更多'">
          <svg-icon icon-class="more_vert"></svg-icon>
        </button>
        <template #popper>
          <div>
            <button
              class="icon"
              @click="
                editRequest({
                  collectionIndex,
                  folderIndex,
                  folderName,
                  request,
                  requestIndex,
                })
              "
              v-close-popper
            >
              <svg-icon icon-class="edit"></svg-icon>
              <span>编辑</span>
            </button>
          </div>
          <div>
            <button class="icon" @click="confirmRemove = true" v-close-popper>
              <svg-icon icon-class="delete"></svg-icon>
              <span>删除</span>
            </button>
          </div>
        </template>
      </v-popover>
    </div>
    <SmartConfirmModal
      :show="confirmRemove"
      :title="'你确认要移除这个请求？'"
      @hide-modal="confirmRemove = false"
      @resolve="removeRequest"
    />
  </div>
</template>

<script>
import { reactive, ref } from 'vue'
import { useStore } from 'vuex';
export default {
  props: {
    request: Object,
    collectionIndex: Number,
    folderIndex: Number,
    folderName: String,
    requestIndex: Number,
    doc: Boolean,
  },
  setup(props, context) {
    const store = useStore();
    let dragging = ref(false);
    let requestMethodLabels = reactive({
      get: "text-green-400",
      post: "text-yellow-400",
      put: "text-blue-400",
      delete: "text-red-400",
      default: "text-gray-400",
    });
    let confirmRemove = ref(false);

    const selectRequest = () => {
      store.commit("postwoman/selectRequest", { request: props.request })
    };
    const dragStart = ({ dataTransfer }) => {
      dragging.value = !dragging.value;
      dataTransfer.setData("oldCollectionIndex", props.collectionIndex)
      dataTransfer.setData("oldFolderIndex", props.folderIndex)
      dataTransfer.setData("oldFolderName", props.folderName)
      dataTransfer.setData("requestIndex", props.requestIndex)
    }
    const removeRequest = () => {
      store.commit("postwoman/removeRequest", {
        collectionIndex: props.collectionIndex,
        folderName: props.folderName,
        requestIndex: props.requestIndex,
        flag: "rest",
      })
      confirmRemove.value = false
    };
    const getRequestLabelColor = (method) => {
      return requestMethodLabels[method.toLowerCase()] || requestMethodLabels.default
    };
    const editRequest = payload => {
      context.emit("edit-request", payload);
    };
    return {
      dragging,
      requestMethodLabels,
      confirmRemove,
      selectRequest,
      dragStart,
      removeRequest,
      getRequestLabelColor,
      editRequest
    }
  },
}
</script>
