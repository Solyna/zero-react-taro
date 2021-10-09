import React, { Suspense } from 'react'
import { Provider } from 'react-redux'
import { AppConfigContext } from './configureContext'
import { View, PageLoading, ErrorBoundary } from '../components'
import { store } from '../redux'
import { default as appModel } from '../../app.model'
import { Layout as AppPage } from '../components'

export default ({ BasePageComponent }) => {
  return class extends React.Component {
    constructor(props) {
      super(props)

      this.state = {
        status: 'loading',
      }

      /**
       * 运行app中 saga
       */
      if (appModel.initialize) {
        store.dispatch(appModel.actions.initState())
      }
      appModel.runSaga()
    }

    componentDidMount() {
      const { $onLunchPayload = {} } = this.props
      const {
        env: { status: initStatus },
      } = store.getState()
      if (initStatus) {
        store.dispatch(
          appModel.actions.didMount({
            ...$onLunchPayload,
            done: () => {
              this.setState({
                status: 'success',
              })
            },
          })
        )
      } else {
        const unsubscribe = store.subscribe(() => {
          const {
            env: { status },
          } = store.getState()
          if (status) {
            unsubscribe()
            store.dispatch(
              appModel.actions.didMount({
                ...$onLunchPayload,
                done: () => {
                  this.setState({
                    status: 'success',
                  })
                },
              })
            )
          }
        })
      }
    }

    componentWillUnmount() {
      if (appModel.actions.willUnmount) {
        store.dispatch(
          appModel.actions.willUnmount({
            done: () => {
              appModel.cancelSaga()
            },
          })
        )
      } else {
        appModel.cancelSaga()
      }
    }

    renderContent() {
      const { status } = this.state
      switch (status) {
        case 'loading':
          return (
            <View
              style={{
                height: '100vh',
              }}
            >
              <PageLoading />
            </View>
          )
        case 'error':
          return (
            <View
              style={{
                height: '100vh',
              }}
            >
              <ErrorBoundary msg={'网络异常，请刷新重试'} />
            </View>
          )
        default:
          return (
            <AppPage>
              <BasePageComponent />
            </AppPage>
          )
      }
    }

    render() {
      return (
        <Provider store={store}>
          <AppConfigContext.Provider value={appModel.config}>
            <Suspense
              fallback={
                <View
                  style={{
                    height: '100vh',
                  }}
                >
                  <PageLoading />
                </View>
              }
            >
              {this.renderContent()}
            </Suspense>
          </AppConfigContext.Provider>
        </Provider>
      )
    }
  }
}
