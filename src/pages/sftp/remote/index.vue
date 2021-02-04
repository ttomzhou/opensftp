<template>
    <q-scroll-area class="full-height">
        <q-inner-loading :showing="loading" style="z-index: 100">
            <q-spinner-gears size="50px" color="primary" />
        </q-inner-loading>
        <div class="fs-control flex">
            <input class="pwd-input" type="text" v-model="pwd" 
                   @keydown.enter="la"
                   @blur="pwd = lastPwd">
            <q-space/>
            <button type="button" class="btn-enter" @click="la">
                <q-icon name="chevron_right"/>
            </button>
            <button type="button" class="btn-enter">
                <q-icon name="refresh"/>
            </button>
        </div>
        <div class="fs-head">
            <div class="item select-all"></div>
            <div class="item name">文件名称</div>
            <div class="item size">文件大小</div>
            <div class="item date">修改日期</div>
            <div class="item owner">所有者</div>
            <div class="item group">群组</div>
        </div>
        <div class="fs-body">
            <div v-for="(item, index) in laList" 
                    class="fs-item"
                    :key="index" 
                    :class="{ 
                        active: index === selectedIndex,
                        hidden: hideItem(item)
                    }"
                    @click="select(item, index)">
                <div class="item icon">
                    <img :src="item.icon" alt="">
                </div>
                <div class="item name">{{ item.name }}</div>
                <div class="item size" v-show="item.name !== '..'">{{ fileSize(item) }}</div>
                <div class="item date" v-show="item.name !== '..'">{{ item.date }}</div>
                <div class="item owner" v-show="item.name !== '..'">{{ item.owner }}</div>
                <div class="item group" v-show="item.name !== '..'">{{ item.group }}</div>
                <menu-list :listItem="item" :listIndex="index" @click="listIndex => selectedIndex = listIndex"/>
            </div>
        </div>
    </q-scroll-area>
</template>

<script>
    import menuList from '../menuList'

    const { NodeSSH } = require('node-ssh')

    export default {
        name: 'SFTPRemote',
        components: {
            'menu-list': menuList,
        },
        watch: {
        },
        data() {
            return {
                ssh: '',
                // 是否显示隐藏项目
                showHideItem: false,
                // 全选
                selectAll: false,
                // pwd
                pwd: '/',
                // 最后一次有效 pwd
                lastPwd: '',
                laList: [],
                loading: false,
                selectedIndex: 0,
                clickNum: 0,
            }
        },
        watch: {
            '$store.state.sshInfo.sshTags': function () {
                this.sshLogin()
            }
        },
        computed: {
            hideItem() {
                return item => item.name === '.' || (item.name.startsWith('.') && !this.showHideItem && item.name !== '..')
            },
            fileSize() {
                return item => item.type === 'd' ? '-' : this.tools.formatFlow(item.size)
            },
        },
        methods: {
            la() {
                // 若当前目录未发生变化，则不发送指令
                if (this.pwd === this.lastPwd) return
                this.loading = true
                this.ssh.execCommand('ls -la --time-style="+%Y-%m-%d %H:%I:%S"', { cwd: this.pwd })
                    .then(res => {
                        if (res.stderr) {
                            this.loading = false
                            this.pwd = this.lastPwd
                            return this.tools.confirm(res.stderr)
                        }
                        const list = res.stdout.split('\n').filter(item => !item.startsWith('total'))
                        list.forEach((item, index) => {
                            const itemArr = item.split(' ').filter(tempItem => tempItem)
                            const itemObj = {
                                type    : itemArr[0].substring(0, 1),
                                attr    : '',
                                childNum: itemArr[1],
                                owner   : itemArr[2],
                                group   : itemArr[3],
                                size    : itemArr[4],
                                date    : `${itemArr[5]} ${itemArr[6]}`,
                                name    : itemArr[7],
                                link    : itemArr[9] || ''
                            }
                            itemObj.icon = this.getFileIcon(itemObj.type, itemObj.name)
                            list[index] = itemObj
                        })                        
                        this.laList = list
                        this.lastPwd = this.pwd
                        this.selectedIndex = 0
                        this.loading = false
                    })
            },
            getFileIcon(type, name) {
                const suffix = type === '-' ? name.split('.').pop() : ''
                // 目录
                if (type === 'd') return require('src/assets/sftp-icons/folder-other.svg')
                // 链接
                if (type === 'l') return require('src/assets/sftp-icons/folder-shared.svg')
                // 管理文件
                if (type === 'p') return 'p'
                // 设备文件
                if (type === 'b') return 'b'
                // 字符设备文件
                if (type === 'c') return 'c'
                // 套接字文件
                if (type === 's') return 's'
                // 普通文件
                if (suffix === 'js') return require('src/assets/sftp-icons/javascript.svg')
                // 普通文件
                if (type === '-') return require('src/assets/sftp-icons/document.svg')
            },
            select(item, index) {
                this.selectedIndex = index
                this.clickNum += 1
                if (this.clickNum >= 2) {
                    this.clickNum = 0
                    return this.doubleClick(item, index)
                }
                setTimeout(() => this.clickNum = 0, 200)
            },
            doubleClick(item, index) {
                const { name } = item
                this.pwd = (() => {
                    const arr = this.pwd.split('/').filter(arrItem => arrItem)
                    name === '..' ? arr.pop() : arr.push(name)
                    return '/' + arr.join('/')
                })()
                this.la()
            },
            moveSelected(action) {
                if (action === 'up') this.selectedIndex = this.selectedIndex === 0
                    ? 0
                    : this.selectedIndex - 1
                if (action === 'down') this.selectedIndex = this.selectedIndex === this.laList.length - 1
                    ? this.laList.length - 1
                    : this.selectedIndex + 1
                // This item is .
                if (this.laList[this.selectedIndex].name === '.') return this.selectedIndex = 1
                // This item is hidden
                if (this.hideItem(this.laList[this.selectedIndex])) return this.moveSelected(action)
            },
            dirEnter() {
                this.doubleClick(this.laList[this.selectedIndex], this.selectedIndex)
            },
            dirBack() {
                this.pwd = (() => {
                    const arr = this.pwd.split('/').filter(arrItem => arrItem)
                    arr.pop()
                    return '/' + arr.join('/')
                })()
                this.la()
            },
            sshLogin() {
                if (!this.$store.state.sshInfo.sshTags.length) return this.$router.push({ path: '/' })
                this.loading = true
                const { sshList, sshTags, sshActive } = this.$store.state.sshInfo
                const sshInfo = sshList.get(sshTags[sshActive].sshKey)
                const { host, port, username, password } = sshInfo
                this.ssh = new NodeSSH()
                this.ssh.connect({
                    host,
                    username,
                    port,
                    password,
                    tryKeyboard: true,
                    onKeyboardInteractive: (name, instructions, instructionsLang, prompts, finish) => {
                        if (prompts.length > 0 && prompts[0].prompt.toLowerCase().includes('password')) finish([password])
                    },
                })
                .then(() => {
                    this.loading = false
                    this.la()
                })
                .catch(err => {
                    this.loading = false
                    console.log(err);
                })
            },
        },
        created() {
            this.sshLogin()
        }
    }
</script>

<style lang="sass" scope>
    .fs-item,
    .fs-head
        display: flex
        height: 25px
        line-height: 25px
        .item
            margin-right: 5px
            white-space: nowrap
            overflow: hidden
            text-overflow: ellipsis
        .name
            width: 200px
        .size
            width: 100px
        .date
            width: 150px
        .owner
            width: 100px
        .group
            width: 100px

    .fs-control
        position: sticky
        top: 0
        z-index: 99
        background: #FFFFFF
        box-sizing: border-box
        .pwd-input,
        .btn-enter
            height: 25px
            padding: 0
            border: 0
            outline: none
            background: none
        .pwd-input
            padding: 0 5px
        .btn-enter
            width: 30px
            text-align: center
            cursor: pointer
            &:hover
                background: rgba($dark, .1)
    .fs-head
        position: sticky
        top: 25px
        z-index: 99
        background: #FFFFFF
        border-top: 1px solid rgba($dark, .1)
        border-bottom: 1px solid rgba($dark, .1)
        .select-all
            width: 25px
            margin-right: 5px

    .fs-item
        .icon
            min-width: 25px
            margin-right: 5px
        &:hover
            background: rgba($primary, .1)
        &.active
            background: $primary
            color: #FFFFFF
</style>