<template>
    <div class="fs-system">
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
                    <div v-show="item.name !== '..'" class="item date">{{ fileCreatedTime(item.date) }}</div>
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
 * 本地文件系统
 */
import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import menuList from '../menuList'

export default {
    name: 'SFTPRemote',
    components: {
        'menu-list': menuList,
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
                    if (itemArr.length < 3) return
                    // 忽略 .
                    if (itemArr[9] === '.') return
                    // 月份补 0
                    if (itemArr[5]) itemArr[5] = this.tools.add0(itemArr[5])
                    // 日期补 0
                    if (itemArr[6]) itemArr[6] = this.tools.add0(itemArr[6])
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
                        date    : `${itemArr[8]}-${itemArr[5]}-${itemArr[6]} ${itemArr[7]}`,
                        // 文件名称
                        name    : itemArr[9],
                        // 链接地址
                        link    : itemArr[11] || ''
                    })
                })
                // drwxr-xr-x  0 root  wheel   640  1  1 16:00:00 2020 ..
                if (!list.length) list.push({
                    name: '..',
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
                if (suffix === 'php')  return require('src/assets/sftp-icons/php.svg')
                if (['png', 'jpg', 'jpeg', 'gif', 'tiff', 'ico', 'icns'].includes(suffix)) return require('src/assets/sftp-icons/image.svg')
                if (['ini', 'conf'].includes(suffix)) return require('src/assets/sftp-icons/settings.svg')
                if (['tar', 'gz', 'tgz', 'zip', 'rar', '7z'].includes(suffix)) return require('src/assets/sftp-icons/zip.svg')
                // 普通文件
                if (type === '-') return require('src/assets/sftp-icons/document.svg')
            }
        },
        fileCreatedTime() {
            return time => this.tools.formatDate(new Date(time).getTime(), 'MM-dd HH:mm')
        },
    },
    methods: {
        // 列出当前路径文件列表
        la() {
            this.loading = true
            exec('ls -laT', { cwd: this.pwd }, (error, stdout, stderr) => {
                this.loading = false
                if (stderr) {
                    return this.tools.confirm(stderr)
                }
                this.list = this.listFormat(stdout)
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
        // 下载
        download(item) {
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
            // 若不显示隐藏文件，判断当前 selected 元素是否为隐藏文件
            // 若为隐藏文件，则递归移动聚焦元素
            if (!this.showHideItem && this.hideItem(this.list[this.selected])) return this.moveFocus(action)
            // 文件聚焦
            this.fileFocus()
        },
    },
    created() {
        this.la()
    }
}
</script>