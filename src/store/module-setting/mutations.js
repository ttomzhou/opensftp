import { LocalStorage, Dark } from 'quasar'

// 切换深色模式
export function DARK_TOGGLE(state) {
    state.dark = !state.dark
    LocalStorage.set('dark', state.dark)
    Dark.toggle()
}