<template>
  <div>
    <div class="show-on-large-screen">
      <span
        class="p-2 m-2 truncate"
        :class="entryStatus.className"
        :style="{ '--status-code': entry.status }">
        {{ `${entry.method} \xA0 • \xA0 ${entry.status}` }}
      </span>
      <li>
        <input
          aria-label="请求名称"
          type="text"
          readonly
          :value="entry.name"
          placeholder="空请求名称"
          class="bg-transparent"/>
      </li>
      <span>
        <button
          data-testid="star_button"
          class="icon"
          :class="{ stared: entry.star}"
          @click="onToggleStar"
          v-tooltip="{
            content: !entry.star ? '标记星星' : '移除星星'
          }">
          <svg-icon :icon-class="entry.star ? 'star' : 'star_border'"></svg-icon>  
        </button>
      </span>
      <v-dropdown>
        <button class="tooltip-target icon" v-tooltip="'选项'">
          <svg-icon icon-class="more_vert"></svg-icon>
        </button>
        <template #popper>
          <div>
            <button
              data-testid="restore_history_entry"
              class="icon"
              @click="onUseEntry"
              aria-label="编辑"
              v-close-popover>
              <svg-icon icon-class="restore"></svg-icon>
              <span>使用</span>
            </button>
          </div>
          <div>
            <button
              data-testid="delete_history_entry"
              class="icon"
              @click="onDeleteEntry"
              aria-label="删除"
              v-close-popover>
              <svg-icon icon-class="delete"></svg-icon>
              <span>删除</span>
            </button>
          </div>
        </template>
      </v-dropdown>
    </div>
    <div class="show-on-large-screen">
      <li>
        <input
          aria-label="URL"
          type="text"
          readonly
          :value="`${entry.url}${entry.path}`"
          placeholder="No URL"
          class="pt-0 mt-0 text-sm bg-transparent text-fgLigthColor">
      </li>
    </div>
    <transition name="fade">
      <div v-if="showMore" class="show-on-large-screen">
        <li>
          <input
            aria-label="时间"
            type="text"
            readonly
            :value="entry.time"
            v-tooltip="entry.date"
            class="pt-0 mt-0 text-sm bg-transparent text-fgLightColor" />
        </li>
        <li>
          <input
            aria-label="响应时间"
            type="text"
            readonly
            :value="`Duration: ${entry.duration}ms`"
            placeholder="未响应"
            class="pt-0 mt-0 text-sm bg-transparent text-fgLightColor">
        </li>
      </div>
    </transition>
  </div>
</template>
<script>
import findStatusGroup from "@/helpers/findStatusGroup"
import { computed, ref } from 'vue'

export default {
  props: {
    entry: Object,
    showMore: Boolean
  },
  emits: [ "toggle-star", "use-entry", "delete-entry"],
  setup(props, context) {
    let entry = props.entry;
    let showMore = props.showMore;
    let expand = ref(false);
    let entryStatus = computed(() => {
      const group = findStatusGroup(entry.status);
      return (
        group || {
          className: "",
        }
      )
    })

    const onDeleteEntry = () => {
      context.emit("delete-entry");
    };
    const onToggleStar = () => {
      context.emit("toggle-star");
    };
    const onUseEntry = () => {
      context.emit("use-entry");
    }
    return {
      entryStatus,
      entry,
      showMore,
      onDeleteEntry,
      onToggleStar,
      onUseEntry
    }
  }
}
</script>
<style lang="scss" scoped>
.stared {
  color: #f8e81c !important;
}
.fade-enter-active
.fade-leave-active {
  transition: all 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>