<template>
    <q-bar class="q-electron-drag">
        <div class="text-weight-bold">Open SFTP</div>
        <session-tag/>

        <q-space />

        <q-btn dense flat icon="minimize" @click="minimize"/>
        <q-btn dense flat icon="crop_square" @click="maximize"/>
        <q-btn dense flat icon="close" @click="closeApp"/>
    </q-bar>
</template>

<script>
    import sessionTag from 'src/components/sessionTag'

    export default {
        name: "HeaderBar",
        components: {
            'session-tag': sessionTag
        },
        data() {
            return {};
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
    };
</script>
