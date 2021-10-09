import React from 'react'
import { View } from '../../basic'
// import './index.css'

export default (props) => {
  const { children, ...restProps } = props
  return (
    <View className="screen-center page-loading-wrap">
      <View className="page-loading-icon page-loading-circle">
        <View className="page-loading-icon loading-animation"></View>
      </View>
      <View style={{ textAligh: 'center' }}>{children} loading....</View>
    </View>
  )
}
