import { Notify } from 'quasar'

export default {
    success(message) {
        Notify.create({
            message: '成功',
            progress: true,
            caption: message,
            position: 'top-right',
            color: 'positive',
            icon: 'ion-md-checkmark',
            classes: 'q-notify',
            actions: [
                {
                    label: '关闭',
                    color: 'white',
                    handler: () => {
                        /* ... */
                    },
                },
            ],
        });
    },
    warning(message) {
        Notify.create({
            message: '警告',
            progress: true,
            caption: message,
            position: 'top-right',
            color: 'warning',
            icon: 'ion-md-warning',
            classes: 'q-notify',
            actions: [
                {
                    label: '关闭',
                    color: 'white',
                    handler: () => {
                        /* ... */
                    },
                },
            ],
        });
    },
    error(message) {
        Notify.create({
            message: '失败',
            progress: true,
            caption: message,
            position: 'top-right',
            color: 'negative',
            icon: 'ion-md-close',
            classes: 'q-notify',
            actions: [
                {
                    label: '关闭',
                    color: 'white',
                    handler: () => {
                        /* ... */
                    },
                },
            ],
        });
    },
    info(message) {
        Notify.create({
            message: '提示',
            progress: true,
            caption: message,
            position: 'top-right',
            color: 'danger',
            icon: 'announcement',
            classes: 'q-notify',
            actions: [
                {
                    label: '关闭',
                    color: 'white',
                    handler: () => {
                        /* ... */
                    },
                },
            ],
        });
    },
}
