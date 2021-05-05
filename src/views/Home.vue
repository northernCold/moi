<template>
  <div class="page">
    <div class="content">
      <div class="page-columns innerleft">
        <app-section ref="request" label="request" no-legend>
          <ul>
            <li class="shrink">
              <label for="method">method</label>
              <span class="select-wrapper">
                <v-dropdown>
                  <input
                    id="method"
                    class="method"
                    v-model="method"
                    :readonly="!customMethod"
                    autofocus
                  />
                  <template #popper>
                    <div
                      v-for="(methodMenuItem, index) in methodMenuItems"
                      :key="`method-${index}`">
                      <button
                        class="icon"
                        @click="
                          customMethod = methodMenuItem === 'CUSTOM';
                          method = methodMenuItem
                        "
                        v-close-popper
                      >
                        {{ methodMenuItem }}
                      </button>
                    </div>
                  </template>
                </v-dropdown>
              </span>
            </li>
            <li>
              <label for="url">URL</label>
              <input
                :class="{ error: !isValidURL}"
                class="broder-dashed md:broder-l border-brdColor"
                @keyup.enter="isValidURL ? sendRequest : null"
                id="url"
                name="url"
                type="text"
                v-model="uri"
                spellcheck="false"
                @input="pathInputHandler"
                placeholder="URL"
              />
            </li>
            <li class="shrink">
              <label class="hide-on-small-screen" for="send">&nbsp;</label>
              <button
                v-if="!runningRequest"
                :disabled="!isValidURL"
                @click="sendRequest"
                id="send"
                ref="sendButton"
              >
                发送
                <svg-icon icon-class="send"></svg-icon>
              </button>
              <button v-else @click="cancelRequest" id="send" ref="sendButton">
                取消
                <svg-icon icon-class="clear"></svg-icon>
              </button>
            </li>
          </ul>
        </app-section>
      </div>
      <aside v-if="activeSidebar" class="sticky-inner inner-right lg:max-w-md">
        <section>
          <smart-tabs>
            <smart-tab id="history" label="历史记录" selected>
              <history page="rest" @useHistory="onUseHistory" ref="historyComponent"></history>
            </smart-tab>
            <smart-tab id="collections" label="收藏夹">
              <collections></collections>
            </smart-tab>
          </smart-tabs>
        </section>
      </aside>
    </div>
  </div>
</template>
<script>
import { computed, reactive, ref, watchEffect } from 'vue';
import getEnvironmentVariablesFromScript from "@/helpers/preRequest"
import { hasPathParams, addPathParamsToVariables, getQueryParams } from "@/helpers/requestParams"
import { httpValid } from "@/helpers/utils/valid"
import { parseUrlAndPath } from "@/helpers/utils/uri"
import parseTemplateString from "@/helpers/templating"
import { useStore } from 'vuex';
import AppSection from "@/components/app/section";
import History from "@/components/history";
import Collections from "@/components/collections";
import SmartTabs from "@/components/smart/tabs";
import SmartTab from "@/components/smart/tab";

const useRequest = ({
    store,
    preRequestScript,
    params,
    showPreRequestScript
  }) => {
  let method = computed({
    get() {
      return store.state.request.method;
    },
    set(value) {
      store.commit('request/setState', { value, attribute: 'method'})
    }
  });
  let url = computed({
    get() {
      return store.state.request.url
    },
    set(value) {
      store.commit("request/setState", { value, attribute: 'url'})
    }
  });
  let path = computed({
    get() {
      return store.state.request.path;
    },
    set(value) {
      store.commit('setState', { value, attribute: 'path'});
    }
  })
  const uri = computed({
    get() {
      return store.state.request.uri ? store.request.uri : url.value + path.value;
    },
    set(value) {
      store.commit('request/setState', { value, attribute: 'uri'})
      if ((preRequestScript && showPreRequestScript) || hasPathParams(params)) {
        let environmentVariables = getEnvironmentVariablesFromScript(preRequestScript);
        environmentVariables = addPathParamsToVariables(params, environmentVariables);
        value = parseTemplateString(value, environmentVariables);
      }
      let result = parseUrlAndPath(value);
      url = result.url;
      path = request.path;
    }
  })
  const methodMenuItems = [
    "GET",
    "HEAD",
    "POST",
    "PUT",
    "DELETE",
    "CONNECT",
    "OPTIONS",
    "TRACE",
    "PATCH",
    "CUSTOM",
  ];
  let customMethod = ref(false);
  const isValidURL = computed(() => showPreRequestScript || httpValid(url));


  return {
    method,
    url,
    uri,
    path,
    methodMenuItems,
    customMethod,
    isValidURL
  }
}

const useAside = () => {
  let activeSidebar = ref(true);

  const onUseHistory = entry => {
    // name = entry.name
    // method = entry.method
    // uri = entry.url + entry.path
    // url = entry.url
    // path = entry.path
    // showPreRequestScript = entry.usesPreScripts
    // preRequestScript = entry.preRequestScript
    // auth = entry.auth
    // httpUser = entry.httpUser
    // httpPassword = entry.httpPassword
    // bearerToken = entry.bearerToken
    // headers = entry.headers
    // params = entry.params
    // bodyParams = entry.bodyParams
    // rawParams = entry.rawParams
    // rawInput = entry.rawInput
    // contentType = entry.contentType
    // requestType = entry.requestType
    // testScript = entry.testScript
    // testsEnabled = entry.usesPostScripts
  }
  let historyComponent = ref(null);
  return {
    activeSidebar,
    onUseHistory,
    historyComponent
  }
}
export default {
  components: {
    AppSection,
    History,
    Collections,
    SmartTabs,
    SmartTab
  },
  setup() {
    const store = useStore();
    
    let preRequestScript = ref("// pw.env.set('variable', 'value');");
    let showPreRequestScript = ref(true);
    let params = reactive([]);
    let runningRequest = ref(false);

    let {
      method,
      url,
      uri,
      path,
      methodMenuItems,
      customMethod,
      isValidURL
    } = useRequest({ store, preRequestScript, params, showPreRequestScript });
    let { activeSidebar, onUseHistory, historyComponent } = useAside();
    return {
      runningRequest,
      method,
      url,
      uri,
      path,
      methodMenuItems,
      customMethod,
      isValidURL,
      activeSidebar,
      historyComponent,
      onUseHistory
    }
  }
}
</script>
<style lang="scss" scoped>

</style>