<template>
    <div class="remote">
        <q-inner-loading :showing="loading" style="z-index: 100">
            <q-spinner-gears size="50px" color="primary" />
        </q-inner-loading>
        <div class="fs-control flex">
            <input class="pwd-input" type="text" v-model.trim="pwd" 
                   @keydown.enter="la"
                   @blur="pwd = lastPwd">
            <q-space/>
            <button type="button" class="btn-enter" @click="la">
                <q-icon name="chevron_right"/>
            </button>
            <button type="button" class="btn-enter" @click="la">
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
        <div class="fs-body full-height">
            <q-scroll-area class="full-height">
                <div v-for="(item, index) in list" 
                     class="fs-item"
                     tabindex="0"
                     :ref="'file-' + index"
                     :key="index" 
                     :class="{ 
                         hidden: hideItem(item),
                         'focus-temp': openMenu === index
                     }"
                     @click="selectFile(index)"
                     @dblclick="dirEnter"
                     @keydown.enter="dirEnter"
                     @keydown.backspace="dirBack"
                     @keydown.prevent.up="moveFocus('up')"
                     @keydown.prevent.down="moveFocus('down')">
                    <div class="item icon">
                        <img :src="getFileIcon(item)" alt="">
                    </div>
                    <div class="item name">{{ item.name }}</div>
                    <div v-show="item.name !== '..'" class="item size">{{ fileSize(item) }}</div>
                    <div v-show="item.name !== '..'" class="item date">{{ item.date }}</div>
                    <div v-show="item.name !== '..'" class="item owner">{{ item.owner }}</div>
                    <div v-show="item.name !== '..'" class="item group">{{ item.group }}</div>
                    <!-- 右键菜单 -->
                    <menu-list v-if="item.name !== '..'"
                               :listItem="item" 
                               @click="openMenu = index"
                               @close="selectFile(index)"
                               @download="download(item)"/>
                </div>
            </q-scroll-area>
        </div>
    </div>
</template>

<script>
/**
 * 继承自 Linux 思想，所有都是文件
 */
import fs from 'fs'
import path from 'path'
import menuList from '../menuList'

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
            list: [],
            loading: false,
            selected: 0,
            openMenu: null,
        }
    },
    watch: {
        '$store.state.sshInfo.sshActive': function () {
            this.sshLogin()
        }
    },
    computed: {
        hideItem() {
            // 文件名以 . 开头为隐藏文件
            return item => item.name.startsWith('.') && item.name !== '..'
        },
        fileSize() {
            // 只有文件类型才有文件大小概念
            return item => item.type === 'd' ? '-' : this.tools.formatFlow(item.size, 1024, 'B', 1024, 0)
        },
        listFormat() {
            return stdout => {
                const list = []
                stdout.split('\n').forEach(item => {
                    const itemArr = item.split(' ').filter(tempItem => tempItem)
                    // 忽略 total
                    if (itemArr.length < 8) return
                    // 忽略 .
                    if (itemArr[7] === '.') return
                    // push 到 list 数组
                    list.push({
                        // 文件类型
                        type    : itemArr[0].substring(0, 1),
                        // 文件数量
                        childNum: itemArr[1],
                        // 所有者
                        owner   : itemArr[2],
                        // 所在群组
                        group   : itemArr[3],
                        // 文件大小
                        size    : itemArr[4],
                        // 创建日期
                        date    : `${itemArr[5]} ${itemArr[6]}`,
                        // 文件名称
                        name    : itemArr[7],
                        // 链接地址
                        link    : itemArr[9] || ''
                    })
                })
                return list
            }
        },
        getFileIcon() {
            return item => {
                const { type, name } = item
                const suffix = type === '-' ? name.split('.').pop() : ''
                // ..
                if (name === '..') return require('src/assets/sftp-icons/folder-other.svg')
                // 目录
                if (type === 'd')  return require('src/assets/sftp-icons/folder.svg')
                // 链接
                if (type === 'l')  return require('src/assets/sftp-icons/folder-shared.svg')
                // 管理文件
                if (type === 'p')  return 'p'
                // 设备文件
                if (type === 'b')  return 'b'
                // 字符设备文件
                if (type === 'c')  return 'c'
                // 套接字文件
                if (type === 's')  return 's'
                // 根据后缀匹配
                if (suffix === 'html') return require('src/assets/sftp-icons/html.svg')
                if (suffix === 'css')  return require('src/assets/sftp-icons/css.svg')
                if (suffix === 'js')   return require('src/assets/sftp-icons/javascript.svg')
                if (suffix === 'md')   return require('src/assets/sftp-icons/readme.svg')
                if (suffix === 'sh')   return require('src/assets/sftp-icons/console.svg')
                if (suffix === 'go')   return require('src/assets/sftp-icons/go.svg')
                if (suffix === 'php')   return require('src/assets/sftp-icons/php.svg')
                if (['png', 'jpg', 'jpeg', 'gif', 'tiff', 'ico', 'icns'].includes(suffix)) return require('src/assets/sftp-icons/image.svg')
                if (['ini', 'conf'].includes(suffix)) return require('src/assets/sftp-icons/settings.svg')
                if (['tar', 'gz', 'tgz', 'zip', 'rar', '7z'].includes(suffix)) return require('src/assets/sftp-icons/zip.svg')
                // 普通文件
                if (type === '-') return require('src/assets/sftp-icons/document.svg')
            }
        },
    },
    methods: {
        // 列出当前路径文件列表
        la() {
            this.loading = true
            this.ssh.execCommand('ls -la --time-style="+%Y-%m-%d %H:%I:%S"', { cwd: this.pwd })
                .then(res => {
                    this.loading = false
                    if (res.stderr) {
                        if (res.stderr.endsWith('No such file or directory')) res.stderr = `目录 ${this.pwd} 不存在`
                        this.pwd = this.lastPwd
                        return this.tools.confirm(res.stderr)
                    }
                    this.list = this.listFormat(res.stdout)
                    this.lastPwd = this.pwd
                    this.selected = 0
                    this.$nextTick(() => {
                        this.fileFocus()
                    })
                })
        },
        // 目录进入
        dirEnter() {
            const { name } = this.list[this.selected]
            this.pwd = (() => {
                const arr = this.pwd.split('/').filter(arrItem => arrItem)
                name === '..' ? arr.pop() : arr.push(name)
                return '/' + arr.join('/')
            })()
            this.la()
        },
        // 目录返回
        dirBack() {
            this.pwd = (() => {
                const arr = this.pwd.split('/').filter(arrItem => arrItem)
                arr.pop()
                return '/' + arr.join('/')
            })()
            this.la()
        },
        // 连接 SSH
        sshLogin() {
            // 针对开发模式
            if (!this.$store.state.sshInfo.sshTags.length) return this.$router.push({ path: '/' })
            this.loading = true
            const { sshList, sshTags, sshActive } = this.$store.state.sshInfo
            const sshInfo = sshList.get(sshTags[sshActive].sshKey)
            const { host, port, username, password } = sshInfo
            this.tools.ssh({
                params: { host, port, username, password },
                success: ssh => {
                    this.ssh     = ssh
                    this.loading = false
                    this.lastPwd = ''
                    this.la()
                },
                finish: () => this.loading = false,
            })
        },
        // 下载
        download(item) {
            if (item.type === 'd') {
                    fs.mkdirSync(path.join('/', item.name), { recursive: true })
                this.ssh.getDirectory(path.join('/', item.name), `${this.lastPwd}/${item.name}`)
                    .then(Contents => {
                        this.notify.success(`目录 ${item.name} 下载成功`)
                        console.log(Contents);
                    }, err => {
                        this.notify.error(`目录 ${item.name} 下载失败`)
                        console.log(err)
                    });
            }
            if (item.type === '-') {
                this.ssh.getFile(path.join('/', item.name), `${this.lastPwd}/${item.name}`)
                    .then(Contents => {
                        this.notify.success(`文件 ${item.name} 下载成功`)
                        console.log(Contents);
                    }, err => {
                        this.notify.error(`文件 ${item.name} 下载失败`)
                        console.log(err)
                    })
            }
        },
        // 选择文件
        selectFile(index) {
            this.openMenu = null
            this.selected = index
            this.fileFocus()
        },
        // 文件聚焦
        fileFocus() {
            this.$refs[`file-${this.selected}`][0].focus()
        },
        // 移动聚焦元素
        moveFocus(action) {
            if (action === 'up' && this.selected !== 0) this.selected -= 1
            if (action === 'down' && this.selected !== this.list.length - 1) this.selected += 1
            this.fileFocus()
        },
    },
    created() {
        this.sshLogin()
    }
}
</script>

<style lang="sass" scope>
.remote
    display: flex
    flex-direction: column
    height: 100%
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
        width: calc( 100% - 60px )
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
    outline: none
    .icon
        min-width: 25px
        margin-right: 5px
    &:hover
        background: rgba($primary, .1)
    &:focus,&.focus-temp
        background: $primary
        color: #FFFFFF
</style>