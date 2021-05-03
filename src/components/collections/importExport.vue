<template>
  <smart-modal v-if="show" @close="hideModal">
    <div slot="header">
      <div class="row-wrapper">
        <h3 class="title">导入/导出 收藏夹</h3>
        <div>
          <v-popover>
            <button class="tooltip-target icon" v-tooltip.left="'更过'">
              <svg-icon icon-class="more-vert"></svg-icon>
            </button>
            <template slot="popover">
              <div>
                <button class="icon" @click="readCollectionGist" v-close-popover>
                  <svg-icon icon-class="assignment_returned"></svg-icon>
                  <span>从Gist导入</span>
                </button>
              </div>
            </template>
          </v-popover>
          <button class="icon" @click="hideModal">
            <svg-icon icon-class="close"></svg-icon>
          </button>
        </div>
      </div>
    </div>
    <div slot="body" class="flex flex-col">
      <div class="flex flex-col items-start p-2">
        <button
          class="icon"
          @click="openDialogChooseFileToReplaceWith"
          v-tooltip="'置换'">
          <svg-icon icon-class="create_new_folder"></svg-icon>
          <span>从 JSON 文件替换</span>
          <input
            type="file"
            @change="replaceWithJSON"
            style="display: none"
            ref="inputChooseFileToReplaceWith"
            accept="application/json"
          />
        </button>
        <button
          class="icon"
          @click="openDialogChooseFileToImportFrom"
          v-tooltip="'保留现有的'"
        >
          <svg-icon icon-class="folder_specail"></svg-icon>
          <span>从 JSON 文件导入</span>
          <input
            type="file"
            @change="importFromJSON"
            style="display: none"
            ref="inputChooseFileToImportFrom"
            accept="application/json"
          />
        </button>
      </div>
      <div v-if="showJsonCode" class="row-wrapper">
        <text-area v-model="collectionJson" row="8" readonly></text-area>
      </div>
    </div>
    <div slot="footer">
      <div class="row-wrapper">
        <span>
          <smart-toggle :on="showJsonCode" @change="showJsonCode = $event">显示代码</smart-toggle>
        </span>
        <span>
          <button class="icon" @click="hideModal">取消</button>
          <button class="icon primary" @click="exportJSON" v-tooltip="'下载为文件'">导出</button>
        </span>
      </div>
    </div>
  </smart-modal>
</template>
<script>
import { computed, ref } from 'vue'
export default {
  props: {
    show: Boolean
  },
  emits: ["hide-modal"],
  setup() {
    let showJsonCode = ref(false);
    let collectionJson = computed(() => {
      return JSON.stringify(store.state.postwoman.collections, null, 2);
    });

    const onHideModal = () => {
      context.emit("hide-modal");
    };
    const openDialogChooseFileToReplaceWith = () => {
      inputChooseFileToReplaceWith.click();
    };
    const openDialogChooseFileToImportFrom = () => {
      inputChooseFileToImportFrom.click();
    };
    const onReplceWithJSON = () => {
      let reader = new FileReader();
      reader.onload = ({ target }) => {
        let content = target.result;
        let collections = JSON.parse(content);
        if (collections[0]) {
          let [name, folder, requests] = Object.keys(collections[0]);
          if (name === "name" && folders === "folders" && requests === "requests") {
            // Do nothing
          } else if (collections.info && collections.info.schema.includes("v2.1.0")) {
            collections = [parsePostmanCollection(collections)];
          } else {
            failedImport();
            return;
          }
        }
        store.commit("postwoman/replaceCollections", { data: collections, flag: "rest"});
        fileImported();
        syncToFBCollections();
      };
      reader.readAsText(inputChooseFileToReplaceWith.files[0]);
      inputChooseFileToReplaceWith.value = "";
    };
  }
}
</script>