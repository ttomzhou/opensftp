<template>
    <q-scroll-area class="full-height">
        <q-list dense>
            <q-item v-for="(item, index) in list" 
                    :key="item.id"
                    :ref="'session-' + index"
                    :class="{ 'focus-temp': renameItem.id === item.id || openMenu === index }"
                    class="list-item cursor-inherit"
                    clickable v-ripple
                    @click="selectSession(index)"
                    @dblclick="login(item, index)"
                    @keydown.enter="login(item, index)"
                    @keydown.f2="renameOpen(item, index)"
                    @keydown.delete="removeItem(item)"
                    @keydown.alt.r="showAttr(item)"
                    @keydown.up="moveFocus('up')"
                    @keydown.down="moveFocus('down')">
                <q-item-section avatar>
                    <q-avatar rounded size="md">
                        <q-spinner-gears v-if="loading === index" class="session-icon" />
                        <q-btn v-else flat
                               class="session-icon" 
                               :class="{ 'text-positive': $q.dark.isActive }" 
                               icon="dns" size="sm"/>
                    </q-avatar>
                </q-item-section>
                <q-item-section>
                    <q-item-section v-show="renameItem.id !== item.id">{{ itemName(item) }}</q-item-section>
                    <input v-model="renameItem.name"
                           v-show="renameItem.id === item.id"
                           type="text"
                           ref="rename-input"
                           class="rename-input no-outline no-border no-padding"
                           :placeholder="item.host"
                           @blur="renameClose"
                           @keydown.esc="$refs['rename-input'][index].blur()"
                           @keydown.stop.delete=""
                           @keydown.stop.up=""
                           @keydown.stop.down=""
                           @keydown.stop.alt.r=""
                           @keydown.stop.enter="$refs['rename-input'][index].blur()">
                </q-item-section>
                <q-item-section side>
                    <q-item-label style="width: 100px" caption class="site-label">
                        {{ loading === index ? '正在连接...' : item.host }}
                    </q-item-label>
                </q-item-section>
                <menu-list @click="openMenu = index"
                           @close="selectSession(index)"
                           @login="login(item, index)"
                           @rename="renameOpen(item, index)"
                           @remove="removeItem(item, index)"
                           @showAttr="showAttr(item, index)"/>
            </q-item>
        </q-list>
        <attr-panel ref="attr-panel" @update="getList"/>
    </q-scroll-area>
</template>

<script>
import menuList from './menuList'
import attrPanel from './attrPanel'

export default {
    name: 'SessionPool',
    components: {
        'menu-list': menuList,
        'attr-panel': attrPanel,
    },
    data() {
        return {
            loading: null,
            selected: null,
            openMenu: null,
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
        // 连接会话
        login(item, index) {
            const { id, host, port, username, password } = item
            this.$store.commit('sshInfo/SSH_TAGS_ADD', id)
            this.$router.push({ path: '/sftp' })
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
            this.sessionFocus()
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
        // 显示属性
        showAttr(item, index) {
            this.$refs['attr-panel'].open(item)
        },
        // 移动聚焦元素
        moveFocus(action) {
            if (action === 'up' && this.selected !== 0) this.selected -= 1
            if (action === 'down' && this.selected !== this.list.length - 1) this.selected += 1
            this.sessionFocus()
        },
        // 会话聚焦
        sessionFocus() {
            this.$refs[`session-${this.selected}`][0].$el.focus()
        },
        // 选择会话
        selectSession(index) {
            this.openMenu = null
            this.selected = index
            this.sessionFocus()
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
        .session-icon
            color: $primary
        &:focus,&.focus-temp
            background: $primary
            color: #FFFFFF
            .session-icon,.site-label
                color: #FFFFFF
</style>
