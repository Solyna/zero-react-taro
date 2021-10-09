import React from 'react'
import { View, Button } from '@/zero/components'
// import '../index.less'

export default class Content extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <View>
        <Button onClick={this.props.goTo}>点击index2</Button>
      </View>
    )
  }
}
