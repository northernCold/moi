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
      <button class="icon" @click="toggleShowChildren">
        <svg-icon icon-class="arrow_right" v-show="!showChildren && !isFiltered"></svg-icon>
        <svg-icon icon-class="arrow_drop_down" v-show="showChildren || isFiltered"></svg-icon>
        <svg-icon icon-class="folder"></svg-icon>
        <span>{{ collection.name }}</span>
      </button>
      <div>
        <button
          v-if="doc && !selected"
          class="icon"
          @click="selectCollection"
          v-tooltip.left="'导入'"
        >
          <svg-icon icon-class="check_box_outline_blank"></svg-icon>
        </button>
        <button
          v-if="doc && selected"
          class="icon"
          @click="unselectCollection"
          v-tooltip.left="'删除'"
        >
          <svg-icon icon-class="check_box"></svg-icon>
        </button>
        <v-dropdown>
          <button class="tooltip-target icon" v-tooltip.left="'更多'">
            <svg-icon icon-class="more_vert"></svg-icon>
          </button>
          <template slot="popover">
            <div>
              <button
                class="icon"
                @click="addFolder({ folder: collection, path: `${collectionIndex}` })"
                v-close-popover
              >
                <svg-icon icon-class="create_new_folder"></svg-icon>
                <span>新文件夹</span>
              </button>
            </div>
            <div>
              <button class="icon" @click="editCollection" v-close-popover>
                <svg-icon icon-class="create"></svg-icon>
                <span>编辑</span>
              </button>
            </div>
            <div>
              <button class="icon" @click="confirmRemove = true" v-close-popover>
                <svg-icon icon-class="delete"></svg-icon>
                <span>删除</span>
              </button>
            </div>
          </template>
        </v-dropdown>
      </div>
    </div>
    <div v-show="showChildren || isFiltered">
      <ul class="flex-col">
        <li
          v-for="(folder, index) in collection.folders"
          :key="folder.name"
          class="ml-8 border-l border-brdColor"
        >
          <CollectionsFolder
            :folder="folder"
            :folder-index="index"
            :folder-path="`${collectionIndex}/${index}`"
            :collection-index="collectionIndex"
            :doc="doc"
            :isFiltered="isFiltered"
            @add-folder="addFolder($event)"
            @edit-folder="editFolder($event)"
            @edit-request="editRequest($event)"
          />
        </li>
      </ul>
      <ul class="flex-col">
        <li
          v-for="(request, index) in collection.requests"
          :key="index"
          class="ml-8 border-l border-brdColor"
        >
          <CollectionsRequest
            :request="request"
            :collection-index="collectionIndex"
            :folder-index="-1"
            :folder-name="collection.name"
            :request-index="index"
            :doc="doc"
            @edit-request="editRequest($event)"
          />
        </li>
      </ul>
      <ul>
        <li
          v-if="collection.folders.length === 0 && collection.requests.length === 0"
          class="flex ml-8 border-l border-brdColor"
        >
          <p class="info">
            <svg-icon icon-class="not_interested"></svg-icon> 空收藏夹
          </p>
        </li>
      </ul>
    </div>
    <SmartConfirmModal
      :show="confirmRemove"
      title="你确认要移除这个收藏夹？"
      @hide-modal="confirmRemove = false"
      @resolve="removeCollection"
    />
  </div>
</template>

<script>
import { reactive, ref } from 'vue';
import { useStore } from 'vuex';
import CollectionsFolder from "./"

export default {
  props: {
    collectionIndex: Number,
    collection: Object,
    doc: Boolean,
    isFiltered: Boolean,
    selected: Boolean,
  },
  emits: ["select-collection", "unselect-collection", "add-folder", "edit-collection", "edit-folder", "edit-request"],
  setup(props, context) {
    const store = useStore();
    let showChildren = ref(false);
    let dragging = ref(false);
    let selectedFolder = reactive({});
    let confirmRemove = ref(false);

    const toggleShowChildren = () => {
      showChildren = !showChildren.value;
    };
    const removeCollection = () => {
      store.commit("postwoman/removeCollection", {
        collectionIndex: props.collectionIndex,
        flag: "rest"
      })
      // to do toast
    };
    const dropEvent = ({ dataTransfer }) => {
      dragging = !dragging.value;
      const oldCollectionIndex = dataTransfer.getData("oldCollectionIndex");
      const oldFolderIndex = dataTransfer.getData("oldFolderIndex");
      const oldFolderName = dataTransfer.getData("oldFolderName");
      const requestIndex = dataTransfer.getData("requestIndex");
      const flag = "rest";
      store.commit("postwoman/moveRequest", {
        oldCollectionIndex,
        newCollectionIndex: props.collectionIndex,
        newFolderIndex: -1,
        newFolderName: props.collection.name,
        oldFolderIndex,
        oldFolderName,
        requestIndex,
        flag,
      })
    };

    const selectCollection = () => {
      context.emit("select-collection");
    }
    const unselectCollection = () => {
      context.emit("unselect-collection");
    }
    const addFolder = data => {
      context.emit("add-folder", data);
    }
    const editCollection = () => {
      context.emit("edit-collection");
    }
    const editFolder = () => {
      context.emit("edit-folder");
    }
    const editRequest = () => {
      context.emit("edit-request");
    }

    return {
      showChildren,
      dragging,
      selectedFolder,
      confirmRemove,
      toggleShowChildren,
      removeCollection,
      dropEvent,
      selectCollection,
      unselectCollection,
      addFolder,
      editCollection,
      editFolder,
      editRequest
    }
  },
}
</script>
