import { LocalStorage } from 'quasar'

const state = {
    sshList : [],
    sshActive: [],
}

Object.keys(state).forEach(key => state[key] = LocalStorage.getItem(key) === null ? state[key] : LocalStorage.getItem(key))

export default function () {
    return state
}