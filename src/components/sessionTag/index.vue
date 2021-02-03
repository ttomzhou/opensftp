<template>
    <div class="row full-height">
        <q-bar v-for="(sshKey, index) in $store.state.sshInfo.sshTags"
               :key="index"
               class="tag cursor-pointer"
               :class="{ active: $store.state.sshInfo.sshActive === index }"
               @click="$store.commit('sshInfo/CHANGE_ACTIVE', index)">
            <q-icon name="dns"/>
            <div class="label">{{ activeSSH().host }}</div>
            <q-space/>
            <q-btn flat round size="xs" icon="close" @click="closeSSH(index)"/>
        </q-bar>
    </div>
</template>

<script>
    export default {
        name: 'SessionTag',
        data() {
            return {
            };
        },
        computed: {
            activeSSH() {
                return () => this.$store.state.sshInfo.sshList.get(this.$store.state.sshInfo.sshTags[this.$store.state.sshInfo.sshActive])
            },
        },
        watch: {
        },
        methods: {
            closeSSH(index) {
                this.$store.commit('sshInfo/SSH_TAGS_DEL', index)
            }
        },
        created() {
        },
    };
</script>

<style lang="sass" scoped>
.tag
    background: rgba($dark, .3)
    .label
        font-size: .85rem
    &.active
        background: rgba($positive, .5)
    &:hover
        backdrop-filter: brightness(.7)
</style>