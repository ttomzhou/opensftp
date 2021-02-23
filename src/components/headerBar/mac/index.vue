<template>
    <q-bar class="q-electron-drag">
        <q-btn dense flat round icon="lens" size="8.5px" color="red" @click="closeApp"/>
        <q-btn dense flat round icon="lens" size="8.5px" color="yellow" @click="minimize"/>
        <q-btn dense flat round icon="lens" size="8.5px" color="green" @click="maximize"/>
        <session-tag/>
        <q-space />
        <q-toggle v-model="dark" 
                  color="dark"
                  checked-icon="ion-md-moon"
                  unchecked-icon="ion-md-sunny"
                  icon-color="light-blue"
                  dense
                  @input="$store.commit('setting/DARK_TOGGLE')"/>
    </q-bar>
</template>

<script>
import sessionTag from 'src/components/sessionTag'
import headerMenu from 'src/components/headerMenu'

export default {
    name: 'HeaderBarMac',
    components: {
        'session-tag': sessionTag,
        'header-menu': headerMenu,
    },
    data() {
        return {
            dark: this.$store.state.setting.dark
        };
    },
    methods: {
        minimize() {
            this.$q.electron.remote.BrowserWindow.getFocusedWindow().minimize()
        },
        maximize() {
            const win = this.$q.electron.remote.BrowserWindow.getFocusedWindow()
            win.isMaximized() ? win.unmaximize() : win.maximize()
        },
        closeApp() {
            this.$q.electron.remote.BrowserWindow.getFocusedWindow().close()
        },
    }
}
</script>
