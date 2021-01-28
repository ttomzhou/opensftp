<template>
    <q-bar class="q-electron-drag">
        <div class="text-weight-bold">Open SFTP</div>
        <session-tag/>

        <q-space />

        <q-btn dense flat icon="minimize" />
        <q-btn dense flat icon="crop_square" />
        <q-btn dense flat icon="close" />
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
    };
</script>
