import React, { cloneElement } from 'react';
const style = {
    width : '100%',
    maxWidth : 1600,
    marginLeft : 'auto',
    marginRight : 'auto',
    paddingLeft : 20,
    paddingRight : 20
}

export default ({renderer = <div/>, children}) => {
    return ( cloneElement(renderer, {
        style : Object.assign({}, renderer.props.style, style),
        children
    }))
}