import React from 'react';
import Profile from '../assets/profile.png';
import './PatientCard.css';
function PatientCard(props) {
  return (
    <div className='patient-card'>
        <div className='p-profile-header'>
            <img src={Profile}></img>
            <div className='p-name'>{props.name}</div>
        </div>
        <ul className='p-details'>
           <li>{props.gender}</li>
           <li>{props.email}</li>
           <li>{props.dayDate}</li> 
           <li>{props.time}</li> 
        </ul>
        <button onClick={props.viewDetailsClick} className='p-book-button'>View Details</button>
    </div>
  )
}

export default PatientCard