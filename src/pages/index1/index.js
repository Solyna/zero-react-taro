import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { BasePage } from '@/src/zero/core'
import model from './index.model'

import Content from './containers/Content'

@BasePage(model)
class Home extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { $model, $globalActions, $globalSelectors } = this.props
    return (
      <Content
        $model={$model}
        $globalActions={$globalActions}
        $globalSelectors={$globalSelectors}
      />
    )
  }
}

export default function createApp() {
  const container = document.createElement('div')
  container.id = 'app'
  document.body.appendChild(container)

  ReactDOM.render(<Home />, container)
}
;('undefined' != typeof wx && wx.getSystemInfoSync) || createApp()
