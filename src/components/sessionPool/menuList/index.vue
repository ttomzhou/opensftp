<template>
    <q-menu touch-position
            context-menu 
            @before-show="$emit('click', listItem)">
        <q-list dense style="min-width: 100px">
            <q-item clickable v-close-popup @click="$emit('login', listItem)">
                <q-item-section>连接</q-item-section>
            </q-item>
            <q-separator/>
            <q-item clickable v-close-popup @click="$emit('remove', listItem, listIndex)">
                <q-item-section>删除</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="$emit('rename', listItem, listIndex)">
                <q-item-section>重命名</q-item-section>
            </q-item>
            <q-separator/>
            <q-item clickable v-close-popup>
                <q-item-section>属性</q-item-section>
            </q-item>
        </q-list>
    </q-menu>
</template>

<script>
    export default {
        name: 'SessionItemMenuList',
        props: {
            listItem: {
                type: Object,
                default: {},
            },
            listIndex: {
                type: Number,
                default: 0,
            },
        },
        data() {
            return {
            }
        },
        watch: {
        },
        computed: {
        },
        methods: {
            rename() {
            }
        },
        created() {
        }
    }
</script>
