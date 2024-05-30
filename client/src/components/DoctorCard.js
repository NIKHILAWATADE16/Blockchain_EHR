import React from 'react'
import Profile from '../assets/profile.png';
import './DoctorCard.css';
function DoctorCard(props) {
  return (
    <div className='doctor-card'>
        <div className='d-profile-header'>
            <img src={Profile}></img>
            <div className='d-name'>{props.name}</div>
        </div>
        <ul className='d-details'>
           <li>{props.email}</li>
           <li>{props.speciality}</li> 
        </ul>
        <button className='d-book-button' onClick={props.handleSubmit}>Book Appointment</button>
    </div>
  )
}

export default DoctorCard