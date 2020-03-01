const RedisSessionStore = require('./server-libs/session-store');
const Redis = require('ioredis');

module.exports.GITHUB_CONFIG = {
        client_id : '363932bbde094eb31827',
        client_secret : '1a63cf27aeb5143a6044e28a208d139f20e00425',
        request_token_url : 'https://github.com/login/oauth/access_token' 
}

module.exports.SESSION_CONFIG = {
    key : 'userID',
    store : new RedisSessionStore(new Redis())
}

module.exports.GITHUB_OAUTH_CONFIG = {
    url : "https://github.com/login/oauth/authorize",
    scope : 'user'
}