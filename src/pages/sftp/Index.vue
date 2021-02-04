<template>
    <page>
        <q-splitter v-model="splitterModel" class="full-height">

            <template v-slot:before>
            </template>

            <template v-slot:after>
                <remote/>
            </template>
        </q-splitter>
    </page>
</template>

<script>
    import remote from './remote'

    export default {
        name: 'SFTP',
        components: {
            remote,
        },
        watch: {
        },
        data() {
            return {
                splitterModel: 50,
            }
        },
    }
</script>
