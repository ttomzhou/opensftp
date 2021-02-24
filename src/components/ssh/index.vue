<template>
    <div class="ssh row overflow-hidden">
        <q-btn icon="code" class="no-border-radius" flat size="sm"/>
        <input v-model.trim="cmd"
               type="text" 
               class="ssh-input col no-margin no-border" 
               placeholder="SSH Terminal"
               @keydown.ctrl.u="cmd = ''">
        <q-space/>
        <q-btn icon="settings" class="no-border-radius" flat size="sm"/>
    </div>
</template>

<script>
    export default {
        name: 'SSH',
        components: {
        },
        data() {
            return {
                cmd: '',
            }
        },
        watch: {
        },
        beforeCreate() {
        },
    }
</script>

<style lang="sass" scope>
.body--light
    .ssh
        border-top: 1px solid rgba($dark, .1)

.body--dark
    .ssh
        background: rgba($dark, .3)
        border-top: 1px solid rgba($dark, .3)
    .ssh-input
        color: #FFFFFF

.ssh
    min-height: 30px
    .ssh-input
        outline: none
        background: none
</style>