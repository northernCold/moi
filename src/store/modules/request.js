export default {
  namespaced: true,
  state: () => ({
    name: "Untitled request",
    method: "GET",
    uri: "",
    url: "https://httpbin.org",
    path: "/get",
    auth: "None",
    httpUser: "",
    httpPassword: "",
    passwordFieldType: "password",
    bearerToken: "",
    headers: [],
    params: [],
    bodyParams: [],
    rawParams: "",
    rawInput: false,
    requestType: "",
    contentType: "",
  }),
  mutations: {
    setState(state, { attribute, value }) {
      state[attribute] = value
    },
    addHeaders(state, value) {
      state.headers.push(value)
    },
    removeHeaders(state, index) {
      state.headers.splice(index, 1)
    },
  
    setKeyHeader(state, { index, value }) {
      state.headers[index].key = value
    },
  
    setValueHeader(state, { index, value }) {
      state.headers[index].value = value
    },
  
    setActiveHeader(state, { index, value }) {
      if (!state.headers[index].hasOwnProperty("active")) {
        Vue.set(state.headers[index], "active", value)
      } else {
        state.headers[index].active = value
      }
    },
  
    addParams(state, value) {
      state.params.push(value)
    },
  
    removeParams(state, index) {
      state.params.splice(index, 1)
    },
  
    setKeyParams(state, { index, value }) {
      state.params[index].key = value
    },
  
    setValueParams(state, { index, value }) {
      state.params[index].value = value
    },
  
    setTypeParams(state, { index, value }) {
      state.params[index].type = value
    },
  
    setActiveParams(state, { index, value }) {
      if (!state.params[index].hasOwnProperty("active")) {
        Vue.set(state.params[index], "active", value)
      } else {
        state.params[index].active = value
      }
    },
  
    addBodyParams(state, value) {
      state.bodyParams.push(value)
    },
  
    removeBodyParams(state, index) {
      state.bodyParams.splice(index, 1)
    },
  
    setKeyBodyParams(state, { index, value }) {
      state.bodyParams[index].key = value
    },
  
    setValueBodyParams(state, { index, value }) {
      state.bodyParams[index].value = value
    },
  
    setBodyParams({state},{params}){
      state.bodyParams = params
    },
  
    // While this mutation is same as the setValueBodyParams above, it is excluded
    // from vuex-persist. We will commit this mutation while adding a file
    // param as there is no way to serialize File objects and thus we cannot
    // persist file objects in localStorage
    setFilesBodyParams(state, { index, value }) {
      state.bodyParams[index].value = value
    },
  
    removeFile(state, { index, fileIndex }) {
      state.bodyParams[index].value.splice(fileIndex, 1)
    },
  
    setActiveBodyParams(state, { index, value }) {
      if (!state.bodyParams[index].hasOwnProperty("active")) {
        Vue.set(state.bodyParams[index], "active", value)
      } else {
        state.bodyParams[index].active = value
      }
    },
  }
}