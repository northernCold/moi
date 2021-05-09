<template>
  <div>
    <div
      :class="['row-wrapper transition duration-150 ease-in-out', { 'bg-bgDarkColor': dragging }]"
      @dragover.prevent
      @drop.prevent="dropEvent"
      @dragover="dragging = true"
      @drop="dragging = false"
      @dragleave="dragging = false"
      @dragend="dragging = false"
    >
      <div>
        <button class="icon" @click="toggleShowChildren">
          <svg-icon icon-class="arrow_right" v-show="!showChildren && !isFiltered"></svg-icon>
          <svg-icon icon-class="arrow_drop_down" v-show="showChildren || isFiltered"></svg-icon>
          <svg-icon icon-class="folder_open"></svg-icon>
          <span>{{ folder.name }}</span>
        </button>
      </div>
      <v-dropdown>
        <button class="tooltip-target icon" v-tooltip.left="'更多'">
          <svg-icon icon-class="more_vert"></svg-icon>
        </button>
        <template #popper>
          <div>
            <button
              class="icon"
              @click="addFolder({ folder, path: folderPath })"
              v-close-popper
            >
              <svg-icon icon-class="create_new_folder"></svg-icon>
              <span>新文件夹</span>
            </button>
          </div>
          <div>
            <button
              class="icon"
              @click="editFolder({ folder, folderIndex, collectionIndex })"
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
      </v-dropdown>
    </div>
    <div v-show="showChildren || isFiltered">
      <ul v-if="folder.folders && folder.folders.length" class="flex-col">
        <li
          v-for="(subFolder, subFolderIndex) in folder.folders"
          :key="subFolder.name"
          class="ml-8 border-l border-brdColor"
        >
          <CollectionsFolder
            :folder="subFolder"
            :folder-index="subFolderIndex"
            :collection-index="collectionIndex"
            :doc="doc"
            :folder-path="`${folderPath}/${subFolderIndex}`"
            @add-folder="addFolder($event)"
            @edit-folder="editFolder($event)"
            @edit-request="editRequest($event)"
          />
        </li>
      </ul>
      <ul class="flex-col">
        <li
          v-for="(request, index) in folder.requests"
          :key="index"
          class="flex ml-8 border-l border-brdColor"
        >
          <CollectionsRequest
            :request="request"
            :collection-index="collectionIndex"
            :folder-index="folderIndex"
            :folder-name="folder.name"
            :request-index="index"
            :doc="doc"
            @edit-request="$emit('edit-request', $event)"
          />
        </li>
      </ul>
      <ul
        v-if="
          folder.folders &&
          folder.folders.length === 0 &&
          folder.requests &&
          folder.requests.length === 0
        "
      >
        <li class="flex ml-8 border-l border-brdColor">
          <p class="info"><svg-icon icon-class="not_interested"></svg-icon> 空文件夹</p>
        </li>
      </ul>
    </div>
    <SmartConfirmModal
      :show="confirmRemove"
      title="你确认要移除这个文件夹？"
      @hide-modal="confirmRemove = false"
      @resolve="removeFolder"
    />
  </div>
</template>

<script>
import { reactive, ref, toRefs } from 'vue';
import { useStore } from 'vuex'
import CollectionsRequest from "./request";
import SmartConfirmModal from "@/components/smart/confirm-modal";

export default {
  name: "CollectionsFolder",
  components: {
    CollectionsRequest,
    SmartConfirmModal
  },
  props: {
    folder: Object,
    folderIndex: Number,
    collectionIndex: Number,
    folderPath: String,
    doc: Boolean,
    isFiltered: Boolean,
  },
  emits: ["add-folder", "edit-folder", "edit-request"],
  setup(props, context) {
    const store = useStore();
    let showChildren = ref(false);
    let dragging = ref(false);
    let selectedFolder = reactive({});
    let confirmRemove = ref(false);

    const toggleShowChildren = () => {
      showChildren.value = !showChildren.value;
    };
    const removeFolder = () => {
      store.commit("postwoman/removeFolder", {
        collectionIndex: props.collectionIndex,
        folderName: props.folder.name,
        folderIndex: props.folderIndex,
        flag: "rest",
      })
      // to do toast
    };
    const dropEvent = ({ dataTransfer }) => {
      dragging.value = !dragging.value;
      const oldCollectionIndex = dataTransfer.getData("oldCollectionIndex")
      const oldFolderIndex = dataTransfer.getData("oldFolderIndex")
      const oldFolderName = dataTransfer.getData("oldFolderName")
      const requestIndex = dataTransfer.getData("requestIndex")
      const flag = "rest"

      store.commit("postwoman/moveRequest", {
        oldCollectionIndex,
        newCollectionIndex: props.collectionIndex,
        newFolderIndex: props.folderIndex,
        newFolderName: props.folder.name,
        oldFolderIndex,
        oldFolderName,
        requestIndex,
        flag,
      })
    };

    const addFolder = payload => {
      context.emit("add-folder", payload)
    };
    const editFolder = payload => {
      context.emit("editFolder", payload);
    };
    const editRequest = payload => {
      context.emit("editRequest", payload);
    }

    return {
      ...toRefs(props),
      showChildren,
      dragging,
      selectedFolder,
      confirmRemove,
      toggleShowChildren,
      removeFolder,
      dropEvent,
      addFolder,
      editFolder,
      editRequest
    }
  },
}
</script>
