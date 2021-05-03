<template>
  <SmartModal v-if="show" @close="onHideModal">
    <div slot="header">
      <div class="row-wrapper">
        <h3 class="title">编辑收藏夹</h3>
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
        :placeholder="editingCollection.name"
        @keyup.enter="onSaveCollection"
      />
    </div>
    <div slot="footer">
      <div class="row-wrapper">
        <span></span>
        <span>
          <button class="icon" @click="onHideModal">取消</button>
          <button class="icon primary" @click="onSaveCollection">保存</button>
        </span>
      </div>
    </div>
  </SmartModal>
</template>
<script>
import { ref, toRefs } from 'vue'
import { useStore } from 'vuex';
export default {
  props: {
    show: Boolean,
    editingCollection: Object,
    editingCollectionIndex: Number
  },
  emits: ["hide-modal"],
  setup(props, context) {
    const store = useStore();
    let name = ref("");
    
    const onSaveCollection = () => {
      if (name.value) {
        // to do toast
        return;
      }
      const collectionUpdated = {
        ...props.editingCollection,
        name
      };
      store.commit("postwoman/editCollection", {
        collection: collectionUpdated,
        collectionIdex: props.editingCollectionIndex,
        flag: 'rest',
      });
      context.emit("hide-modal");
    };

    const onHideModal = () => {
      context.emit("hide-modal");
    }

    return {
      ...toRefs(props),
      name,
      onSaveCollection,
      onHideModal
    }
  }
}
</script>