const requestGithub = require("./api").requestGithub;

module.exports = server => {
    server.use(async (ctx, next) => {
        if (ctx.path.startsWith('/api/github')) {
            const session = ctx.session
            const githubAuth = session && session.githubAuth
            const headers = {}
            if (githubAuth && githubAuth.access_token) {
                headers['Authorization'] = `${githubAuth.token_type} ${githubAuth.access_token}`
            }
            const result = await requestGithub(ctx.method, ctx.url.replace('/api/github/', '/'), ctx.request.body || {}, headers)
            ctx.status = result.status
            ctx.body = result.data
        } else {
            await next()
        }
    })
}
// module.exports = (server) => {
//     server.use(async (ctx, next) => {
//         if (ctx.path.startsWith('/api/github/')) {
//             const authInfo = ctx.session.githubAuth

//             const headers = {}
//             if (authInfo && authInfo.access_token) {
//                 headers['Authorization'] = `${authInfo.token_type} ${authInfo.access_token}`
//             }

//             const apiPath = `${BASE_URL}${ctx.url.replace('/api/github/', '/')}`

//             try{
//                 const result = await axios({
//                     method : 'GET',
//                     url : apiPath,
//                     headers
//                 })
//                 if (result.status === 200){
//                     ctx.body = result.data
//                 } else {
//                     ctx.status = result.status
//                     ctx.body = {
//                         success : false
//                     }
//                 ctx.set('Content-Type', 'application/json')
//                 }
//             } catch (err) {
//                 console.error(err)
//                 ctx.body = {
//                     success : false
//                 }
//                 ctx.set('Content-Type', 'application/json')
//             }
//         } else {
//             await next()
//         }
//     })
// }