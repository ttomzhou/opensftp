<template>
    <q-layout view="lHh Lpr lFf">
        <q-header elevated>
            <header-bar/>
        </q-header>

        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script>
import headerBar from 'src/components/headerBar'

export default {
    name: "MainLayout",
    components: {
        'header-bar': headerBar
    },
    data() {
        return {
        };
    }
};
</script>
