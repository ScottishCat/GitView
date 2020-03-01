import { request } from '../server-libs/api'
import { connect } from 'react-redux'
import getConfig from 'next/config'
import { Button, Icon, Tabs} from 'antd'
import Router, {withRouter} from 'next/router'
import React, {useEffect} from 'react'
import LRU from 'lru-cache'
import Repo from '../components/Repo'
import {cacheArray} from '../server-libs/repo-basic-cache'

const { publicRuntimeConfig } = getConfig()

const IconStyle = {
  marginRight : 10
}

const onChangeHandler = (activeKey) => {
  Router.push(`/?key=${activeKey}`)
}

const isServer = typeof window === 'undefined'

const cache = new LRU({
  maxAge : 10 * 60 * 1000
})

const Index = (props) => {
  // console.log(props.isLogged)
  // console.log(props.userRepos)
  // console.log(props.userStarred)
  // console.log(props.userRepos)

  // console.log(props.router.query)

  useEffect(() => {
    if (!isServer) {
      if (props.userRepos) {
        cache.set('userRepos', props.userRepos)
      }
      if (props.userStarred) {
        cache.set('userStarred', props.userStarred)
      }
    }
  }, [props.userRepos, props.userStarred])

  useEffect(() => {
    if (!isServer) {
      cacheArray(props.userRepos)
      cacheArray(props.userStaredRepos)
    }
  })


  const tabKey = props.router.query.key || '1'

  if (!props.user || !props.user.id) {
    return (
      <div className='root'>
        <p>登录后才能查看仓库哦~</p>
        <Button type='primary' href={publicRuntimeConfig.oauth_url}>点击登录</Button>
        <style jsx>{`
          .root {
            height : 400px;
            display : flex;
            flex-direction : column;
            justify-content : center;
            align-items : center;
          }
        `}
        </style>
      </div>
    )
  } else {
    return (
      <div className='root'>
        <div className='user-info'>
          <img src={props.user.avatar_url} alt='user avatar' height='200px'/>
          <span className='login'>{props.user.login}</span>
          <span className='name'>{props.user.name}</span>
          <span className='bio'>{props.user.bio}</span>
          <p className='email'>
            <Icon type='mail' style={IconStyle}/>
            <a href={`mailto:${props.user.email}`}>{props.user.email}</a>
          </p>
        </div>
        <div className='user-repos'>
          <Tabs  defaultActiveKey='1' activeKey={tabKey} animated={false} onChange={onChangeHandler}>
              <Tabs.TabPane tab='我的仓库' key='1'>
              {
                props.userRepos.map((repo,index) => (
                  <Repo key={`${repo.owner.login} ${repo.full_name}`} repo = {repo}/>
                ))
              }
              </Tabs.TabPane>
              <Tabs.TabPane tab='我关注的仓库' key='2'>
              {
                props.userStarred.map(repo => (
                  <Repo key={`${repo.owner.login} ${repo.full_name}`} repo = {repo}/>
                ))
              }
              </Tabs.TabPane>
          </Tabs>
        </div>
        <style jsx>{`
          .root {
            display : flex;
            align-items : flex-start;
            padding : 20px ;
          }  

          .user-info {
            width : 200px;
            margin-right : 40px;
            flex-shrink : 0;
            display : flex;
            flex-direction : column;
          }

          .login {
            font-weight : 800;
            font-size : 20px;
            margin-top : 20px;
          }

          .name {
            font-size: 16px;
            color : #777;
          }

          .bio {
            margin-top : 20px;
            color : #333;
          }

          .avatar {
            width : 100%;
            border-radius : 5px;
            border : 1px solid;
          }

          .user-repos {
            flex-grow : 1
          }
        `}
        </style>
      </div>
    )
  }
}

Index.getInitialProps = async (ctx) => {

  if (!isServer) {
    if (cache.get('userRepos') && cache.get('userStarred')) {
      return {
        userRepos : cache.get('userRepos'),
        userStarred : cache.get('userStarred')
      }
    }
  }

  if (ctx.isServer === true){
    if (!ctx.req.session || !ctx.req.session.userInfo) {
      return {

      }
    }
  } 
  const userRepos = await request({url : '/user/repos'}, ctx.req, ctx.res)
  const userStarred = await request({url : '/user/starred'}, ctx.req, ctx.res)

  return {
    userRepos : userRepos.data,
    userStarred : userStarred.data
  }
}

export default withRouter(connect((state) => {
  return {
    user : state.user
  }
})(Index))