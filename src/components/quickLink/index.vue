<template>
    <div class="full-height q-pa-md flex flex-center">
        <div class="container text-center">
            <svg-quickLink class="illustration"/>
            <q-input label="地址" v-model="host">
                <template v-slot:after>
                    <q-input style="width: 80px" v-model="port" label="端口" />
                </template>
            </q-input>
            <q-input label="用户" v-model="username"/>
            <q-input label="密码" v-model="password" 
                     :type="showPwd ? 'text' : 'password'" 
                     @keydown.enter="sshLogin">
                <template v-slot:append>
                    <q-btn v-show="password" 
                           :icon="showPwd ? 'visibility' : 'visibility_off'" 
                           flat round 
                           @click="showPwd = !showPwd"/>
                </template>
            </q-input>
            <q-btn color="primary" 
                   unelevated
                   :loading="loading"
                   label="连接"
                   class="q-mt-md full-width"
                   @click="sshLogin"/>
        </div>
    </div>
</template>

<script>
    import svgQuickLink from 'src/components/svg/quickLink'

    const { NodeSSH } = require('node-ssh')

    export default {
        name: "QuickLink",
        components: {
            'svg-quickLink': svgQuickLink
        },
        data() {
            return {
                loading: false,
                showPwd: false,
                host: '192.168.0.241',
                port: '22',
                username: 'root',
                password: 'srunsoft@xian',
            };
        },
        methods: {
            sshLogin() {
                const { host, port, username, password } = this
                this.loading = true
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
                    this.$store.commit('sshInfo/SSH_ADD', {
                        ssh: this.ssh,
                        host,
                        port,
                        username,
                        password,
                    })
                })
                .catch(err => {
                    this.loading = false
                    // this.notify.error(err)
                    console.log(err);
                })
            },
        },
    };
</script>

<style lang="sass" scoped>
.container
    width: 300px
    .illustration
        height: 200px
</style>