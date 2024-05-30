import React from 'react'
import { Link } from 'react-router-dom';
import './Button.css';
function Button(props) {
  return (
    <Link to={props.linkto} className={props.class}>{props.name}</Link>
  )
}

export default Button