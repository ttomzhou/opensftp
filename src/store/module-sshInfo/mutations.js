import { LocalStorage } from 'quasar'

export function SSH_ADD(state, obj) {
    const { ssh, host, port, username, password } = obj
    const same = state.sshList.filter(item => item.host === host
        && item.port === port
        && item.username === username 
        && item.password === password)

    if (!same.length) state.sshList.push({
        name: '',
        addTime: Date.now(),
        host, port, username, password,
    })

    state.sshActive.push({ 
        name: '',
        host, port, ssh,
    })

    LocalStorage.set('sshActive', state.sshActive)
    LocalStorage.set('sshList', state.sshList)
}

export function SSH_CLOSE(state, obj) {
    const { host, port } = obj
    state.sshList.filter((item, index) => {
        if(item.host === host && item.port === port) {
            state.sshList.splice(index, 1)
            LocalStorage.set('sshList', state.sshList)
        }
    })

    state.sshActive.filter((item, index) => {
        if(item.host === host && item.port === port) {
            state.sshActive.splice(index, 1)
            LocalStorage.set('sshActive', state.sshActive)
        }
    })
}
