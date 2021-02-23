<template>
    <page>
        <q-splitter v-model="splitterModel" class="full-height">

            <template v-slot:before>
                <local :key="keys.local"/>
            </template>

            <template v-slot:after>
                <remote :key="keys.remote"/>
            </template>
        </q-splitter>
    </page>
</template>

<script>
    import local  from './local'
    import remote from './remote'

    export default {
        name: 'SFTP',
        components: {
            local,
            remote,
        },
        data() {
            return {
                splitterModel: 50,
                keys: {
                    local: Date.now(),
                    remote: Date.now(),
                }
            }
        },
        watch: {
            '$store.state.sshInfo.sshTags': function (newVal) {
                if (!newVal.length) return this.$router.push({ path: '/' })
            },
            '$store.state.sshInfo.sshActive': function () {
                this.keys.remote = Date.now()
            }
        },
        beforeCreate() {
            if (!this.$store.state.sshInfo.sshTags.length) return this.$router.push({ path: '/' })
        },
    }
</script>
