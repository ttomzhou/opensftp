<template>
    <q-layout view="lHh Lpr lFf">
        <q-header elevated :class="{ 'bg-dark': $q.dark.isActive }">
            <header-bar-mac v-if="$q.platform.is.mac"/>
            <header-bar-win v-if="$q.platform.is.win"/>
        </q-header>

        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script>
import headerBarMac from 'src/components/headerBar/mac'
import headerBarWin from 'src/components/headerBar/win'

export default {
    name: "MainLayout",
    components: {
        'header-bar-mac': headerBarMac,
        'header-bar-win': headerBarWin,
    },
    data() {
        return {
        };
    }
};
</script>
