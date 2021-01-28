import { LocalStorage, Dark } from 'quasar'

const state = {
    autoUpdate : true,
    dark       : false,
}

Object.keys(state).forEach(key => state[key] = LocalStorage.getItem(key) === null ? state[key] : LocalStorage.getItem(key))

Dark.set(state.dark)

export default function () {
    return state
}