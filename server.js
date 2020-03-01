const Koa = require('koa');
const next = require('next');
const Router = require('koa-router');
const session = require('koa-session');
const SESSION_CONFIG = require('./config').SESSION_CONFIG;
const auth = require('./server-libs/auth');
const githubApi = require('./server-libs/github');
const KoaBody = require('koa-body')
const atob = require('atob')

global.atob = atob

const dev = process.env.NODE_ENV !== 'production';
const app = next({
    dev
});
const handle = app.getRequestHandler()

app.prepare().then(() => {
    const server = new Koa();
    const router = new Router();

    server.keys = ['GitView App'];

    server.use(KoaBody())

    server.use(session(SESSION_CONFIG, server));

    auth(server);
    githubApi(server);

    router.get('/api/user/info', async ctx => {
        const user = ctx.session.userInfo
        if (!user) {
            ctx.body = {}
        } else {
            ctx.body = user
        }
        ctx.set('Content-Type','application/json')
        // console.log(ctx.session.userInfo)
    })

    router.post('/api/user/logout', async ctx => {
        ctx.session = null;
        ctx.body = `logout success`
    })

    router.get('/api/user/prepare-oauth', async ctx => {
        const {url} = ctx.query
        ctx.session.urlBeforeOauth = url
        ctx.body = 'ready'
    })

    server.use(router.routes());

    server.use(async (ctx, next) => {
        ctx.req.session = ctx.session
        await handle(ctx.req, ctx.res)
        ctx.respond = false;
    })

    server.listen(3000, () => {
        console.log("Server running on localhost:3000");
    })
})