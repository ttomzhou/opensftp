import { LocalStorage } from 'quasar'

// 会话池新增会话
export function SSH_ADD(state, obj) {
    const { host, port, username, password, callback } = obj
    // 生成 SSH Key
    const sshKey = `${username}@${host}:${port}`
    // 判断会话池中是否存在信息
    const sameItem = state.sshList.get(sshKey)
    // 写入到会话池中，若已存在则更新信息
    state.sshList.set(sshKey, {
        name   : sameItem ? sameItem.name    : obj.name || '',
        addTime: sameItem ? sameItem.addTime : Date.now(),
        host,
        port,
        username,
        password,
    })
    // 写入 LocalStorage
    LocalStorage.set('sshList', [...state.sshList])
    // 若存在回调函数则执行回调
    if (callback) callback(sshKey)
}

// 会话池删除会话
export function SSH_DEL(state, sshKey) {
    state.sshList.delete(sshKey)
    LocalStorage.set('sshList', [...state.sshList])
}

// 标签池新增会话
export function SSH_TAGS_ADD(state, sshKey) {
    state.sshTags.push(sshKey)
    CHANGE_ACTIVE(state, state.sshTags.length - 1)
}

// 标签池删除会话
export function SSH_TAGS_DEL(state, index) {
    state.sshTags.splice(index, 1)
    CHANGE_ACTIVE(state, state.sshTags.length - 1)
}

// 更换当前会话
export function CHANGE_ACTIVE(state, index) {
    state.sshActive = index
}