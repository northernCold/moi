<template>
  <smart-modal v-if="show" @close="hideModal">
    <template #header>
      <div>
        <div class="row-wrapper">
          <h3 class="title">导入/导出 收藏夹</h3>
          <div>
            <v-dropdown>
              <button class="tooltip-target icon" v-tooltip.left="'更过'">
                <svg-icon icon-class="more-vert"></svg-icon>
              </button>
              <template #popper>
                <div>
                  <button class="icon" @click="readCollectionGist" v-close-popper>
                    <svg-icon icon-class="assignment_returned"></svg-icon>
                    <span>从Gist导入</span>
                  </button>
                </div>
              </template>
            </v-dropdown>
            <button class="icon" @click="hideModal">
              <svg-icon icon-class="close"></svg-icon>
            </button>
          </div>
        </div>
      </div>
    </template>
    <template #body>
      <div class="flex flex-col">
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
          <textarea v-model="collectionJson" row="8" readonly></textarea>
        </div>
      </div>
    </template>
    <template #footer>
      <div>
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
    </template>
  </smart-modal>
</template>
<script>
import { computed, ref } from 'vue'
import SmartModal from "@/components/smart/modal";
import SmartToggle from "@/components/smart/toggle";

export default {
  components: {
    SmartModal,
    SmartToggle
  },
  props: {
    show: Boolean
  },
  emits: ["hide-modal"],
  setup(props, context) {
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
    const importFromJSON = () => {
      let reader = new FileReader();
      reader.onload = ({ target }) => {
        let content = target.result;
        let collections = JSON.parse(content);
        if (collections[0]) {
          let [name, folders, requests] = Object.keys(collections[0]);
          if (name === "name" && folders === "folders" && requests === "requests") {
            // Do nothing
          }
        } else if (collections.info && collections.info.schema.includes("v2.1.0")) {
          //replace the variables, postman uses {{var}}, Hoppscotch uses <<var>>
          collections = JSON.parse(content.replaceAll(/{{([a-z]+)}}/gi, "<<$1>>"));
          collections = [parsePostmanCollection(collections)];
        } else {
          failedImport();
          return;
        }
        store.commit("postwoman/importCollections", { data: collections, flag: "rest" });
        fileImported();
      }
      reader.readAsText(inputChooseFileToImportFrom.files[0]);
    };
    const exportJSON = () => {
      let text = collectionJson;
      text = text.replace(/\n/g, "\r\n");
      let blob = new Blob([text], {
        type: "text/json",
      });
      let anchor = document.createElement("a");
      anchor.download = "hoppscotch-collection.json"
      anchor.href = window.URL.createObjectURL(blob);
      anchor.target = "_blank";
      anchor.style.display = "none";
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      // to do toast;
    };
    const fileImported = () => {
      // to do toast;
    };
    const failedImport = () => {
      // to do toast;
    };
  }
}
</script>