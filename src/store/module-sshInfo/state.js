import { LocalStorage } from 'quasar'

const state = {
    // 保存的 SSH 会话 - 会话池
    sshList: [],
    // 开启的 SSH 标签 - 标签池
    sshTags: [],
    // 活跃的 SSH 标签 - 标签索引
    sshActive: 0,
}

Object.keys(state).forEach(key => state[key] = LocalStorage.getItem(key) === null ? state[key] : LocalStorage.getItem(key))

state.sshList = new Map(state.sshList)

export default function () {
    return state
}