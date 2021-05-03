<template>
  <app-section icon="history" label="历史记录" no-legend>
    <div class="show-on-larget-screen">
      <input
        aria-label="Search"
        type="search"
        placeholder="查询"
        v-model="filterText"
        class="rounded-t-lg"
      />
    </div>
    <div
      class="divide-y virtual-list divide-dashed divide-brdColor"
      :class="{ filled: filteredHistory.length }">
      <ul v-for="(entry, index) in filteredHistory" :key="`entry-${index}`">
        <history-rest-card
          v-if="page === 'rest'"
          :entry="entry"
          :id="index"
          :showMore="showMore"
          @toggle-star="onToggleStar(entry)"
          @delete-entry="onDeleteHistory"
          @use-entry="onUseHistory(entry)"></history-rest-card>
      </ul>
    </div>
    <p class="info" :class="{ hidden: filteredHistory.length !== 0 || history.length === 0 }">
      什么也找不到了 "{{ filterText }}"  {{filteredHistory.length !== 0}} {{history}}
    </p>
    <p v-if="history.length === 0" class="info">
      <svg-icon icon-class="schedule"></svg-icon>暂无记录
    </p>
    <div v-if="history.length !== 0" class="rounded-b-lg bg-bgDarkColor">
      <div class="row-wrapper" v-if="!isClearingHistory">
        <button
          class="icon"
          data-testid="clear_history"
          :disabled="history.length === 0"
          @click="onEnableHistoryClearing">
          <svg-icon icon-class="clear-all"></svg-icon>
          <span>清理全部</span>
        </button>
        <button
          v-tooltip="{ content: !showMore ? '展示更多' : '隐藏更多'}"
          class="icon"
          @click="toggleCollapse()">
          <svg-icon :icon-class="showMore ? 'unfold_more' : 'unfold_less'"></svg-icon>  
        </button>
      </div>
      <div class="row-wrapper" v-else>
        <p class="info"><svg-icon icon-class="help_outline"></svg-icon>你确定吗?</p>
        <div>
          <button
            data-testid="confirm_clear_history"
            class="icon"
            @click="onClearHistory"
            v-tooltip="'Yes'">
            <svg-icon icon-class="done"></svg-icon>
          </button>
          <button
            data-testid="reject_clear_history"
            class="icon"
            @click="onDisableHistoryClearing"
            v-tooltip="'No'">
            <svg-icon icon-class="close"></svg-icon>
          </button>
        </div>
      </div>
    </div>
  </app-section>
</template>
<script>
import AppSection from "@/components/app/section";
import { computed, reactive, ref, watch, watchEffect } from 'vue';
import HistoryRestCard from './rest-card';

const updateOnLocalStorage = (propertyName, property) => 
  window.locationStorage.setItem(propertyName, JSON.stringify(property));

export default {
  components: {
    HistoryRestCard,
    AppSection
  },
  props: {
    page: String,
  },
  emits: ["useHistory"],
  setup(props, context) {
    let page = ref(props.page);
    let history = reactive(JSON.parse(
      window.localStorage.getItem(page.value === 'rest' ? 'history' : 'graphqlHistory')
    ) || []);
    let filterText = ref('');
    let showFilter = ref(false);
    let isClearingHistory = ref(false);
    let showMore = ref(false);
    let filteredHistory = computed(() => {
      history = JSON.parse(
        window.localStorage.getItem(page == "rest" ? "history" : "graphqlHistory")
      ) || [];
      return history.filter(entry => {
        const filterText = filterText.value.toLowerCase();
        return Object.keys(entry).some(key => {
          let value = entry[key];
          value = typeof value !== 'string' ? value.toString() : value;
          return value.toLowerCase().inclueds(filterText);
        })
      })
    }) 
    const onClearHistory = () => {
      history = [];
      filterText.value = '';
      disabledHistroyClearing();
      updateOnLocalStorage(page.value === 'rest' ? 'history' : 'graphqlHistory', history);
      // to do toast
    };

    const onUseHistory = entry => {
      context.emit('useHistory', entry);
    };

    const onDeleteHistory = entry => {
      if (history.length === 0) {
        filterText.value = '';
      }
      
      history.splice(history.indexOf(entry), 1);
      updateOnLocalStorage(page.value === 'rest' ? 'history' : 'graphqlHistory', history);
      // to do toast
    };

    const onAddEntry = entry => {
      history.push(entry);
      updateOnLocalStorage(page.value === 'rest' ? 'history' : 'graphqlHistory', history);
    };

    const onEnableHistoryClearing = () => {
      if (!history || !history.length) return;
      isClearingHistory.value = true;
    }

    const onDisableHistoryClearing = () => {
      isClearingHistory.value = false;
    }

    const onToggleCollapse = () => {
      showMore.value = !showMore.value;
    }

    const onToggleStar = entry => {
      entry.star = !entry.star;
      updateOnLocalStorage(page.value === 'rest' ? 'history' : 'graphqlHistory', history);
    }

    return {
      filteredHistory,
      page,
      showMore,
      history,
      filterText,
      isClearingHistory,
      onDeleteHistory,
      onToggleStar,
      onUseHistory,
      onEnableHistoryClearing,
      onClearHistory,
      onDisableHistoryClearing
    }
  }
  
}
</script>
<style lang="scss" scoped>
.virtual-list {
  max-height: calc(100vh - 270px);
  [readonly] {
    cursor: default;
  }
}

ul,
ol {
  flex-direction: column;
}

@media (max-width: 720px) {
  .virtual-list.filled {
    min-height: 320px;
  }
  .labels {
    display: none;
  }
}
</style>