import { LocalStorage } from 'quasar'

export function SSH_LOGIN(state, obj) {
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
