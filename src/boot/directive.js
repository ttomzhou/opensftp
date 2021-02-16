// "async" is optional
export default async ({ app, router, Vue }) => {
    // something to do
    Vue.directive('other', {
        bind(el, binding, vnode) {
            const documentHandler = (e) => {
                // 这里判断点击的元素是否是本身，是本身，则返回
                if (el.contains(e.target)) return false;
                // 判断指令中是否绑定了函数
                // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
                if (binding.expression) binding.value(e);
                return true;
            };

            // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
            el.clickOther = documentHandler;
            document.addEventListener('click', documentHandler);
        },
        update() {
        },
        unbind(el, binding) { // 解除事件监听
            document.removeEventListener('click', el.clickOther);
            delete el.clickOther;
        },
    });
};
