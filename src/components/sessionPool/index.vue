<template>
    <q-scroll-area class="full-height">
        <q-inner-loading :showing="loading" style="z-index: 99">
            <q-spinner-gears size="50px" color="primary" />
        </q-inner-loading>
        <q-list dense>
            <q-item v-for="(item, index) in list" 
                    :key="item.id"
                    :class="{ active: selected === item.id }"
                    class="list-item cursor-inherit"
                    clickable v-ripple
                    @click="selected = item.id"
                    @dblclick="link(item)">
                <q-item-section avatar>
                    <q-avatar rounded size="md">
                        <q-btn icon="dns" size="sm" flat :color="selected === item.id ? 'white' : 'primary'"/>
                    </q-avatar>
                </q-item-section>
                <q-item-section>
                    <q-item-section v-show="renameItem.id !== item.id">{{ itemName(item) }}</q-item-section>
                    <input v-model="renameItem.name"
                           v-show="renameItem.id === item.id"
                           type="text"
                           ref="rename-input"
                           class="no-outline no-border"
                           @blur="renameClose"
                           @keydown.enter="$refs['rename-input'][0].blur()">
                </q-item-section>
                <q-item-section side>
                    <q-item-label style="width: 100px"
                                  caption
                                  class=""
                                  :class="{ 'text-white': selected === item.id }">{{ item.host }}
                    </q-item-label>
                </q-item-section>
                <menu-list :listItem="item" 
                           :listIndex="index" 
                           @click="selected = item.id" 
                           @rename="renameOpen"
                           @remove="removeItem"/>
            </q-item>
        </q-list>
    </q-scroll-area>
</template>

<script>
import menuList from './menuList'

export default {
    name: 'SessionPool',
    components: {
        'menu-list': menuList,
    },
    data() {
        return {
            loading: false,
            selected: '',
            renameItem: {},
            list: [],
        }
    },
    computed: {
        itemName() {
            return item => item.name || item.host
        }
    },
    watch: {
    },
    methods: {
        getList() {
            const list = [...this.$store.state.sshInfo.sshList]
            const arr  = []
            list.forEach(item => {
                arr.push({
                    ...{ id: item[0] },
                    ...item[1],
                })
            })
            this.list = arr
        },
        link(item) {
            this.loading = true
            setTimeout(() => {
                this.loading = false
            }, 500)
        },
        // 重命名开始
        renameOpen(item, index) {
            this.renameItem = this.tools.clone(item)
            // FIXME: nextTick 无效
            setTimeout(() => this.$refs['rename-input'][index].focus(), 100)
        },
        // 重命名结束
        renameClose() {
            this.$store.commit('sshInfo/SSH_UPDATE', {
                sshKey: this.renameItem.id,
                updateItem: {
                    name: this.renameItem.name,
                },
            })
            this.renameItem = {}
            this.getList()
        },
        // 删除项目
        removeItem(item, index) {
            this.tools.confirm({
                message: `确定要删除会话 [${item.name}] 吗？`,
                confirm: () => {
                    this.$store.commit('sshInfo/SSH_DEL', item.id)
                    this.getList()
                },
                cancel: () => {}
            })
        },
    },
    created() {
        this.getList()
    },
};
</script>

<style scoped lang="sass">
    .list-item
        border-radius: 4px
        &.active
            background: $primary
            color: #FFFFFF
</style>
