<template>
    <div class="row full-height">
        <q-btn v-show="tagList.length"
               icon="home" flat 
               class="no-border-radius"
               @click="backHome"/>
        <q-btn v-for="(item, index) in tagList"
               :key="index"
               :color="$store.state.sshInfo.sshActive === index ? 'teal-7' : 'blue-10'"
               class="no-border-radius"
               style="margin-right: 1px"
               unelevated no-caps
               @click="changeSession(index)">
            <q-icon name="dns"/>
            <div class="label q-mx-sm" style="font-size: .85rem">{{ item.name }}</div>
            <q-space/>
            <q-btn flat round size="xs" icon="close" @click="closeSSH(index)"/>
        </q-btn>
    </div>
</template>

<script>
    export default {
        name: 'SessionTag',
        data() {
            return {
                tagList: [],
            }
        },
        watch: {
            '$store.state.sshInfo.sshTags': function () {
                const arr = []
                this.$store.state.sshInfo.sshTags.forEach(item => {
                    arr.push({
                        ...{ id: item.sshKey },
                        ...this.$store.state.sshInfo.sshList.get(item.sshKey),
                    })
                })
                this.tagList = arr
            }
        },
        methods: {
            closeSSH(index) {
                this.$store.commit('sshInfo/SSH_TAGS_DEL', index)
            },
            backHome() {
                this.$store.commit('sshInfo/CHANGE_ACTIVE', -1)
                this.$router.push({ path: '/', query: { t: Date.now() } })
            },
            changeSession(index) {
                this.$store.commit('sshInfo/CHANGE_ACTIVE', index)
                this.$router.push({ path: '/sftp', query: { t: Date.now() } })
            },
        },
        created() {
        },
    };
</script>

<style lang="sass" scoped>
</style>