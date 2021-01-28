import Vue    from 'vue'
import utils  from 'src/utils'
import notify from 'src/utils/notify'

import page   from 'src/components/page'

Vue.prototype.tools  = utils
Vue.prototype.notify = notify

// "async" is optional
export default async ({ app, router, Vue }) => {
    // something to do
    Vue.component('page', page);
};
