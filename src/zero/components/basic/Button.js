import React from 'react'
export default (props) => {
  const { children, ...restProps } = props
  return <wx-button {...restProps}>{children}</wx-button>
}
