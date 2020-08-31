import 'normalize.css'
import '~/css/main.css'

import '~/index.njk'

// import(/* webpackChunkName: "test" */ '@/test.js').then(({ default: test }) => {
// 	test()
// })

document.querySelector('body').classList.remove('js-loading')
