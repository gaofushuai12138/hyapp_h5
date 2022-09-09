import DsBridge from "dsbridge"
import { keyBy } from "lodash"

const callFn = (name, param) => {
  return DsBridge.call(name, param || {})
}

const callFnAsync = (name, param, callback) => {
  callback(DsBridge.call(name, param || {}, callback))
}

const registerFn = (tag, callback) => {
  DsBridge.register(tag, callback)
}

const localConfig = {
    set(key, value) {
      return callFn("saveLocalConfig", {key, value})
    },
    get(key) {
      return callFn("readLocalConfig", {key})
    },
    clear() {
      return callFn("clearLocalConfig", {key})
    },

    setAsync(key, value, cb) {
      return callFnAsync("saveLocalConfig", {key, value}, cb)
    },
    getAsync(key) {
      return callFnAsync("readLocalConfig", {key}, cb)
    },
    clearAsync() {
      return callFnAsync("clearLocalConfig", {key}, cb)
    }
}

const userInfo = {
  set(value) {
    return callFn("saveUserInfo", {value})
  },
  get() {
    if (window.$hyt_is_pc_browser === 'true') {
      return JSON.stringify({
        "token": "1EE14A5999D345D4A8511B93B7025299",
        "org_list": [
          {
            "org_id": "9",
            "org_name": "长兴天下牧业111111",
            "org_ico": null
          },
          {
            "org_id": "10",
            "org_name": "柯坪天下牧业111111",
            "org_ico": null
          }
        ]
      })
    } else {
      return callFn("readUserInfo", {})
    }
  },
  clear() {
    return callFn("clearUserInfo", {})
  },

  setAsync(key, value, cb) {
    return callFnAsync("saveUserInfo", {value}, cb)
  },
  getAsync(key) {
    return callFnAsync("readUserInfo", {}, cb)
  },
  clearAsync() {
    return callFnAsync("clearUserInfo", {}, cb)
  }
}

const showPage = {
  set(value) {
    return callFn("saveShowPage", {value})
  },
  get() {
    return callFn("readShowPage", {})
  },
  clear() {
    return callFn("clearShowPage", {})
  },

  setAsync(key, value, cb) {
    return callFnAsync("saveShowPage", {value}, cb)
  },
  getAsync(key) {
    return callFnAsync("readShowPage", {}, cb)
  },
  clearAsync() {
    return callFnAsync("clearShowPage", {}, cb)
  }
}

const logout = () => {
  return callFn("logout", {})
}

export {
  localConfig,
  userInfo,
  showPage,
  logout,
}
