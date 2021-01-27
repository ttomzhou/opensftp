import { LocalStorage, Dark } from 'quasar'

const setting = {
    autoUpdate : true,
    dark       : false,
}

Object.keys(setting).forEach(key => setting[key] = LocalStorage.getItem(key) === null ? setting[key] : LocalStorage.getItem(key))

Dark.set(setting.dark)

export default function () {
    return setting
}