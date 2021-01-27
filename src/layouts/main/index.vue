<template>
    <q-layout view="lHh Lpr lFf">
        <q-header elevated>
            <q-toolbar>
                <q-btn flat dense round
                       icon="menu"
                       aria-label="Menu"/>
                <q-toolbar-title>Quasar App</q-toolbar-title>
                <div>Quasar v{{ info.version }}</div>
            </q-toolbar>
        </q-header>

        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script>
import info from '../../../package.json'

export default {
    name: "MainLayout",
    data() {
        return {
            info,
        };
    },
};
</script>
