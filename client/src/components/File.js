import React from 'react'
import './File.css';
function File(props) {
  return (
    <div className='file'>
        <div className='file-name'>{props.name}</div>
        <a href={props.cid} className='file-link'>View File</a>    
    </div>
  )
}

export default File