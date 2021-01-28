<template>
    <q-page :style-fn="myTweak">
        <slot/>
    </q-page>
</template>

<script>
export default {
    name: 'Page',
    computed: {
        myTweak () {
            return offset => ({ height: offset ? `calc(100vh - ${offset}px)` : '100vh' })
        }
    }
};
</script>
