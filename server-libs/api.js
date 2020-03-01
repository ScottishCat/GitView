const axios = require('axios')

const GITHUB_BASE_URL = 'https://api.github.com'

async function requestGithub(method, url, data, headers) {
    return await axios({
        method,
        url : `${GITHUB_BASE_URL}${url}`,
        data,
        headers
    })
}

async function request ({method = 'GET', url, data = {}}, req, res){
    const isServer = typeof window === 'undefined'
    if (!url) {
        throw Error('url must exesist')
    }
    if (isServer) {
        const session = req.session
        const githubAuth = session && session.githubAuth ? session.githubAuth : {}
        const headers = {}
        if (githubAuth.access_token) {
            headers['Authorization'] = `${githubAuth.token_type} ${githubAuth.access_token}`
        }
        return await requestGithub(method, url, data, headers)
    } else {
        return await axios({
            method,
            url : `/api/github${url}`,
            data
        })
    }
}

module.exports = {
    request,
    requestGithub
}