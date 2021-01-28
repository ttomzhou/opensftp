<template>
    <page>
        <q-splitter v-model="splitterModel" class="full-height">

            <template v-slot:before>
                已保存的 SFTP 连接
            </template>

            <template v-slot:after>
                <quick-link/>
            </template>

        </q-splitter>
    </page>
</template>

<script>
import quickLink from 'src/components/quickLink'

export default {
    name: "Home",
    components: {
        'quick-link': quickLink
    },
    data() {
        return {
            splitterModel: 50,
        }
    },
    methods: {
    }
};
</script>
