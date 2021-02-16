import { LocalStorage, Dialog } from 'quasar'

// 会话池新增会话
export function SSH_ADD(state, obj) {
    const { host, port, username, password, callback } = obj
    // 生成 SSH Key
    const sshKey = `${username}@${host}:${port}`
    // 判断会话池中是否存在信息
    const sameItem = state.sshList.get(sshKey)
    // 若会话池已存在会话，则更新会话
    if (sameItem) return setData(sameItem.name)
    // 若会话池不存在会话，则弹窗提示输入会话名称
    if (!sameItem) return Dialog.create({
        message: '这是一个新的会话，请创建会话名称',
        prompt: {
            model: host,
            type: 'text' // optional
        },
        persistent: true
    }).onOk(name => setData(name))
    
    function setData(name) {
        // 写入到会话池中，若已存在则更新信息
        state.sshList.set(sshKey, {
            name,
            host,
            port,
            username,
            password,
            addTime: sameItem ? sameItem.addTime : Date.now(),
        })
        // 写入 LocalStorage
        LocalStorage.set('sshList', [...state.sshList])
        // 若存在回调函数则执行回调
        if (callback) callback(sshKey)   
    }
}

// 会话池更新会话
export function SSH_UPDATE(state, obj) {
    const { sshKey, updateItem } = obj
    const sessionInfo = state.sshList.get(sshKey)
    Object.keys(updateItem).forEach(key => sessionInfo[key] = updateItem[key])
    state.sshList.set(sshKey, sessionInfo)
    LocalStorage.set('sshList', [...state.sshList])
}

// 会话池删除会话
export function SSH_DEL(state, sshKey) {
    state.sshList.delete(sshKey)
    LocalStorage.set('sshList', [...state.sshList])
}

// 标签池新增会话
export function SSH_TAGS_ADD(state, sshKey) {
    state.sshTags.push({ sshKey })
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