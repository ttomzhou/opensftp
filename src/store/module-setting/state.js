import { LocalStorage, Dark } from 'quasar'
import { remote } from 'electron'

const state = {
    autoUpdate : true,
    dark       : 'auto',
}

Object.keys(state).forEach(key => state[key] = LocalStorage.getItem(key) === null ? state[key] : LocalStorage.getItem(key))

Dark.set(state.dark)
remote.getCurrentWindow().setVibrancy(state.dark ? 'dark' : 'light')
state.dark = Dark.isActive

export default function () {
    return state
}