const axios = require('axios');

const {
    GITHUB_CONFIG
} = require('../config');

const {
    client_id,
    client_secret,
    request_token_url
} = GITHUB_CONFIG;

module.exports = (server) => {
    server.use(async (ctx, next) => {
        if (ctx.path === '/auth') {
            const code = ctx.query.code
            if (!code) {
                ctx.body = "Authorization Code Does Not Exesist"
                return
            }

            const result = await axios({
                method: "POST",
                url: request_token_url,
                data: {
                    client_id,
                    client_secret,
                    code
                },
                headers: {
                    Accept: "application/json"
                }
            })

            if (result.status === 200 && result.data && !result.data.error){
                ctx.session.githubAuth = result.data
                const { access_token, token_type } = result.data
                const userInfo = await axios({
                    method : 'GET',
                    url : 'https://api.github.com/user',
                    headers : {
                        Authorization : `${token_type} ${access_token}`
                    }
                })
                ctx.session.userInfo = userInfo.data
                ctx.redirect(ctx.session && ctx.session.urlBeforeOauth ? ctx.session.urlBeforeOauth : '/')
                ctx.session.urlBeforeOauth = ''
            } else {
                ctx.body = "Request Token Failed"
            }
        } else {
            await next()
        }
    })
}