import { Provider } from 'react-redux'
import {makeStore} from '../store/store'
import App, { Container } from 'next/app'
import 'antd/dist/antd.css'
import React from 'react'
import Layout from '../components/Layout'
import withRedux from "next-redux-wrapper"
import Loading from '../components/Loading'
import Router from 'next/router'
import axios from 'axios'

class MyApp extends App {

  state = {
    isLoading : false
  }

  startLoading = () => {
    this.setState({
      isLoading : true
    })
  }

  endLoading = () => {
    this.setState({
      isLoading : false
    })
  }

  componentDidMount() {
    Router.events.on('routeChangeStart', this.startLoading)
    Router.events.on('routeChangeComplete', this.endLoading)
    Router.events.on('routeChangeError', this.endLoading)
  }

  componentWillUnmount() {
    Router.events.off('routeChangeStart',this.startLoading)
    Router.events.off('routeChangeComplete',this.endLoading)
    Router.events.off('routeChangeError',this.endLoading)
  }

  static async getInitialProps(ctx) {
    const { Component } = ctx
    let pageProps = {}
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx.ctx)
    }
    return { pageProps }
  }

render() {
    const { Component, pageProps, store } = this.props
    return (
      <Provider store = {store}>
      {this.state.isLoading ? <Loading/> : null}
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Provider>
    )
  }
}

export default withRedux(makeStore)(MyApp);