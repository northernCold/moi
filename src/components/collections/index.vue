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
      :show="showModalFolder"
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