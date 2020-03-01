import {useState, useCallback, useEffect} from 'react';
import {withRouter} from 'next/router';
import axios from 'axios';
import {connect} from 'react-redux'
import { Button, Layout, Icon, Input, Avatar, Dropdown, Menu } from 'antd'
import Container from '../components/Container';
import getConfig from 'next/config';
import {USER_INFO} from '../store/types';
import {logout} from '../store/actions';
import Router from 'next/router';

const { Header, Content, Footer} = Layout
const { publicRuntimeConfig } = getConfig();

const MyLayout = (props) => {

  const query = props.router.query && props.router.query.query;

  const [search, setSearch] = useState(query)

  const handleSearchChange = useCallback(event => {
    setSearch(event.target.value)
  }, [])

  const handleSearchSubmit = useCallback(() => {
    props.router.push(`/search?query=${search}`)
  }, [search])

  const handleLogin = useCallback((e) => {
    e.preventDefault();
    axios.get(`/api/user/prepare-oauth?url=${props.router.asPath}`)
      .then(res => {
        if (res.status === 200) {
          location.href = publicRuntimeConfig.oauth_url
        } else {
          console.log('auth failed',res)
        }
      }).catch(err =>{
        console.log('auth failed', err)
      })
  })

  const handleLogout = useCallback(() => {
    props.logout()
  }, [props.logout])

  useEffect(() => {
    axios.get('/api/user/info').then(res => {
      props.getUser(res.data)
    })
  },[])

  const userDropDown = (
    <Menu>
      <Menu.Item>
        <span onClick={handleLogout}>退出登录</span>
      </Menu.Item>
    </Menu>
  )

  const githubIconStyle = {
    color : "white",
    fontSize : 40,
    display : "block",
    paddingTop : 10,
    marginRight : 20
  }

  const footerStyle = {
    textAlign : "center"
  }

  const handleHomeClick = () => {
    Router.push('/')
  }

  return (
    <Layout>
      <Header>
        <Container renderer={<div className="head-container"/>}>
            <div className="header-left">
              <div className="logo">
                  <Icon type="github" style={githubIconStyle} onClick={handleHomeClick}/>
              </div>
              <div>
                <Input.Search 
                  placeholder="搜索仓库" 
                  value={search} 
                  onChange={handleSearchChange}
                  onSearch={handleSearchSubmit}/>
              </div>
            </div>
            <div className="header-right">
              <div className="user">
              {
                props.user && props.user.id ? (
                  <Dropdown overlay={userDropDown}>
                    <a href="#" onClick={() => false}>
                      <Avatar size={40} src={props.user.avatar_url}/>
                    </a>
                  </Dropdown>
                ) : (
                  <a href = '#' onClick={handleLogin}>
                    <Avatar size={40} icon="user"/>
                  </a>
                )
              }
              </div>
            </div>
        </Container>
      </Header>
      <Content>
        <Container>
          {props.children}
        </Container>
      </Content>
      <Footer style ={footerStyle}>
        Developed by SocttishCat
      </Footer>
      <style jsx>{`
        .head-container {
          display : flex;
          justify-content : space-between
        }

        .header-left {
          display : flex;
          justify-content : flex-start
        }
      `}
      </style>
      <style jsx global>{`
        #__next {
          height : 100%;
        }

        .ant-layout {
          min-height : 100%;
        }

        .ant-layout-header {
          padding-left : 0;
          padding-right : 0;
        }

        .ant-layout-content {
          background-color : #fcfcfc
        }
      `}
      </style>
    </Layout>
  )}

  function mapStateToProps(state) {
    const { user } = state
    return {
      user
    }
  }
  
  function mapDispatchToProps(dispatch) {
    return {
      getUser(data) {
        dispatch({ type: USER_INFO, data})
      },
      logout : () => dispatch(logout())
    }
  }


  export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MyLayout))