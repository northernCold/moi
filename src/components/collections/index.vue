<template>
  <app-section label="收藏夹" no-legend>
    <div class="show-on-large-screen">
      <input
        aria-label="Search"
        type="search"
        placeholder="查询"
        v-model="filterText"
        class="rounded-t-lg"
      />
    </div>
    <collections-add :show="showModalAdd" @hide-modal="displayModalAdd(false)"></collections-add>
    <collections-edit
      :show="showModalEdit"
      :editing-collection="editingCollection"
      :editing-collection-index="editingCollectionIndex"
      @hide-modal="displayModalEdit(false)">
    </collections-edit>
    <collections-add-folder
      :show="showModalAddFolder"
      :folder="editingFolder"
      :folder-path="editingFolderPath"
      @add-folder="onAddFolder($event)"
      @hide-modal="displayModalAddFolder(false)">
    </collections-add-folder>
    <collections-edit-folder
      :show="showModalEditFolder"
      :collection-index="editingCollectionIndex"
      :folder="editingFolder"
      :folder-index="editingFolderIndex"
      @hide-modal="displayModalEditFolder(false)">
    </collections-edit-folder>
    <collections-edit-request
      :show="showModalEditRequest"
      :collection-index="editingCollectionIndex"
      :folder-index="editingFolderIndex"
      :folder-name="editingFolderName"
      :request="editingRequest"
      :request-index="editingRequestIndex"
      @hide-modal="displayModalEditRequest(false)">
    </collections-edit-request>
    <collections-import-export
      :show="showModalImportExport"
      @hide-modal="displayModalImportExport(false)">
    </collections-import-export>
    <div class="border-b row-wrapper-border-brdColor">
      <button class="icon" @click="displayModalAdd(true)">
        <svg-icon class="add"></svg-icon>
        <span>新建</span>
      </button>
      <button class="icon" @click="displayModalImportExport(true)">
        <span>导入/导出</span>
      </button>
    </div>
    <p v-if="collections.length === 0" class="info">
      <svg-icon icon-class="help_outline"></svg-icon>
      <span>创建新文件夹</span>
    </p>
    <div class="virtual-list">
      <ul class="flex-col">
        <li v-for="(collection, index) in filteredCollections" :key="collection.name">
          <collections-collection
            :name="collection.name"
            :collection-index="index"
            :collection="collection"
            :doc="doc"
            :isFiltered="filterText.length > 0"
            :selected="selected.some(coll => coll === collection)"
            @edit-collection="editCollection(collection, index)"
            @add-folder="addFolder($event)"
            @edit-folder="editFolder($event)"
            @edit-request="editRequest($event)"
            @select-collection="$emit('use-collection', collection)"
            @unselect-collection="$emit('remove-collection', collection)">
          </collections-collection>
        </li>
      </ul>
    </div>
    <p v-if="filterText && filteredCollections.length === 0" class="info">
      <svg-icon icon-class="not_interested"></svg-icon> 什么也找不到了 "{{ filterText }}"
    </p>
  </app-section>
</template>
<script>
import { computed, onBeforeUnmount, onMounted, reactive, toRefs } from 'vue'
import { useStore } from 'vuex';
import AppSection from "@/components/app/section";
import CollectionsAdd from "./add";
import CollectionsEdit from "./edit";
import CollectionsAddFolder from "./addFolder";
import CollectionsEditFolder from "./editFolder";
import CollectionsEditRequest from "./editRequest";
import CollectionsImportExport from "./importExport";
import CollectionsCollection from "./collections";

export default {
  components: {
    AppSection,
    CollectionsAdd,
    CollectionsEdit,
    CollectionsAddFolder,
    CollectionsEditFolder,
    CollectionsEditRequest,
    CollectionsImportExport,
    CollectionsCollection
  },
  props: {
    doc: Boolean,
    selected: { type: Array, default: () => [] },
  },
  setup(props, context) {
    let store = useStore();
    let {
      showModalAdd,
      showModalEdit,
      showModalImportExport,
      showModalAddFolder,
      showModalEditFolder,
      showModalEditRequest,
      editingCollection,
      editingCollectionIndex,
      editingFolder,
      editingFolderName,
      editingFolderIndex,
      editingFolderPath,
      editingRequest,
      editingRequestIndex,
      filterText
    } = toRefs(reactive({
      showModalAdd: false,
      showModalEdit: false,
      showModalImportExport: false,
      showModalAddFolder: false,
      showModalEditFolder: false,
      showModalEditRequest: false,
      editingCollection: undefined,
      editingCollectionIndex: undefined,
      editingFolder: undefined,
      editingFolderName: undefined,
      editingFolderIndex: undefined,
      editingFolderPath: undefined,
      editingRequest: undefined,
      editingRequestIndex: undefined,
      filterText: "",
    }));
    let collections = computed(() => store.state.postwoman.collections);
    console.log(collections);
    let filteredCollections = computed(() => {
      const collections = store.state.postwoman.collections;
      if (!filterText.value) return collections;
      const text = filterText.toLowerCase();
      const result = [];

      for (let collection of collections) {
        const filteredRequests = [];
        const filteredFolders = [];

        for (let request of collection.requests) {
          if (request.name.toLowerCase().includes(text)) {
            filteredRequests.push(request);
          }
        }
        for (let folder of collection.folders) {
          const filteredFolderRequests = [];
          for (let request of folder.requests) {
            if (request.name.toLowerCase().includes(text)) {
              filteredFolderRequests.push(request);
            }
          }
          if (filteredFolderRequests.length > 0) {
            const filteredFolder = Object.assign({}, folder);
            filteredFolder.requests = filteredFolderRequests;
            filteredFolders.push(filteredFolder);
          }
        }

        if (filteredRequests.length + filteredFolders.length > 0) {
          const filteredCollection = Object.assign({}, collection);
          filteredCollection.requests = filteredRequests;
          filteredCollection.folders = filteredFolders;
          result.push(filteredCollection);
        }
      }

      return result;
    })
    console.log(filteredCollections.value)
    const keyListener = e => {
      if (e.key === "Escape") {
        e.preventDefault();
        showModalAdd = showModalEdit = showModalImportExport = showModalEdit = showModalEditRequest = false;
      }
    }
    onMounted(() => {
      document.addEventListener("keydowm", keyListener);
    })
    onBeforeUnmount(() => {
      document.removeEventListener("keydown", keyListener);
    })

    const displayModalAdd = shouldDisplay => {
      showModalAdd = shouldDisplay;
    }
    const displayModalEdit = showDisplay => {
      showModalEdit = showDisplay;
    }
    const displayModalImportExport = shouldDisplay => {
      showModalImportExport = shouldDisplay;
    }
    const displayModalAddFolder = shouldDisplay => {
      showModalAddFolder = shouldDisplay;
    }
    const displayModalEditFolder = shouldDisplay => {
      showModalEditFolder = shouldDisplay;
    }
    const displayModalEditRequest = shouldDisplay => {
      showModalEditRequest = shouldDisplay;
    }
    const editColleciton = (collection, collectionIndex) => {
      editingCollection = collection;
      editingCollectionIndex = collectionIndex;
      displayModalEdit(true);
    }
    const onAddFolder = ({ name, path }) => {
      const flag = "rest";
      store.commit("postwoman/addFolder", {
        name,
        path,
        flag
      })
    }
    const editFolder = payload => {
      const { collectionIndex, folderIndex, folderName, request, requestIndex } = payload;
      editingCollectionIndex = collectionIndex;
      editingFolderIndex = folderIndex;
      editingFolderName = folderName;
      editingRequest = request;
      editingRequestIndex = requestIndex;
    }
    const editRequest = payload => {
      const { collectionIndex, folderIndex, folderName, request, requestIndex } = payload;
      editingCollectionIndex = collectionIndex;
      editingFolderIndex = folderIndex;
      editingFolderName = folderName;
      editingRequest = request;
      editingRequestIndex = requestIndex;
      displayModalEditRequest(true);
    }
    const resetSelectedData = () => {
      editingCollection = undefined;
      editingCollectionIndex = undefined;
      editingFolder = undefined;
      editingFolderIndex = undefined;
      editingReuqest = undefined;
      editingRequestIndex = undefined;
    }
    console.log(props);
    return {
      ...toRefs(props),
      showModalAdd,
      showModalEdit,
      showModalImportExport,
      showModalAddFolder,
      showModalEditFolder,
      showModalEditRequest,
      editingCollection,
      editingCollectionIndex,
      editingFolder,
      editingFolderName,
      editingFolderIndex,
      editingFolderPath,
      editingRequest,
      editingRequestIndex,
      filterText,
      collections,
      filteredCollections,
      displayModalAdd,
      displayModalEdit,
      displayModalImportExport,
      displayModalAddFolder,
      displayModalEditFolder,
      displayModalEditRequest,
      editColleciton,
      onAddFolder,
      editFolder,
      editRequest,
      resetSelectedData
    }
  }
}
</script>