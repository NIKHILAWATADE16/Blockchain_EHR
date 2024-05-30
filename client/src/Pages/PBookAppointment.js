import React from 'react'
import '../css/PBookAppointment.css';
import profile from '../assets/profile.png'
import File from '../components/File';
import Button from '../components/Button';
import DoctorCard from '../components/DoctorCard';
import { useEffect,useState } from 'react';
import HRM from '../build/HRM.json';
import { Web3 } from 'web3';

function PBookAppointment() {


  const [Account,SetAccount] = useState({
    account:null,
    contract:null
  });

  const[viewForm,SetViewForm] = useState(false)
  const [AppDetails,SetAppDetails] = useState({
    date:"",
    time:"",
    AmPm:""
  })

  const handleDateChange=(event)=>{
    SetAppDetails({...AppDetails,date:event.target.value})
  }

  const handleTimeChange = (event)=>{
    SetAppDetails({...AppDetails,time:event.target.value})
  }

  const handleAmChange = (event)=>{
    SetAppDetails({...AppDetails,AmPm:event.target.value})
  }
  const [doctorAddress,SetDoctorAddress] = useState()
  const [res,SetRes] = useState([]);

  const openForm=(element)=>{
    SetViewForm(true);
    SetDoctorAddress(element);
    console.log(element);
  }

  const closeForm = ()=>{
    SetViewForm(false);
    SetDoctorAddress(null);
  }


  const detectCurrentProvider = () =>{
    let provider;
    if(window.ethereum)
    {
      provider = window.ethereum;
    }else if(window.web3)
    {
      provider = window.web3.currentProvider;
    }else{
      console.log("non eth");
    }
    return provider;
  };

  const HandleAppointmentFormSubmit =async (event)=>{
    event.preventDefault();
    const time = AppDetails.time;
    const ampm = AppDetails.AmPm;
    const finalTime = time.concat(" ").concat(ampm);
    await BookAppointment(doctorAddress,AppDetails.date,finalTime);
    SetAppDetails({
      date:"",
      time:"",
      ampm:""
    })
  }
  
  async function onConnect() {

      const currentProvider = detectCurrentProvider();
      if(currentProvider)
      {
          await currentProvider.request({method:'eth_requestAccounts'});
          const web3 = new Web3(currentProvider);
          const userAccount = await web3.eth.getAccounts();
          const account = userAccount[0];
          console.log(account);
          const networkId = await web3.eth.net.getId();
          const deployedNetwork = HRM.networks[networkId];
          const instance = new web3.eth.Contract(HRM.abi,deployedNetwork && deployedNetwork.address);
          console.log(instance);
          SetAccount({
              account:account,
              instance:instance,
          })
          if(account)
          {
            SetRes(await instance.methods.GetAllDoctors().call({from:account}))
          }
      }
  }

  const GetAllDoctors = async()=>{
    if (Account.instance) {
      console.log("1");
      try {
        const result = await Account.instance.methods.GetAllDoctors().call({from:Account.account});
        //SetRes(result);
        // console.log(res);
        return result;
      } catch (error) {
        console.error('Error:', error);
      }
    }
  }

  const BookAppointment = async(address,time,date)=>{
    if(Account.instance)
    {
      try {
        const result = await Account.instance.methods.BookAppointment(address,time,date).send({from:Account.account});
        //SetRes(result);
        // console.log(res);
        return result;
      } catch (error) {
        console.error('Error:', error);
      }
    }
  }

  useEffect(()=>{
     onConnect();
  },[])
  return (
    <>
    <div className='App'>
      <div className='container'>
        <div className='pa-left-section'>
          <div className='pd-profile-header'>
            <img src={profile} />
            <p className='address'>{Account.account}</p>
          </div>
          <div className='links'>
          <Button linkto="/PatientDashboard" class="b-not-active" name="Documents"/>
          <Button linkto="/pAppointments" class="b-active" name="Book Appointment"/>
          <Button linkto="/" class="b-not-active" name="Logout"/>
          </div>
        </div>
        <div className='pa-right-section'>
          
          {
              res.map((element,index)=>(
                <DoctorCard key={index} name={element[2]} email={element[4]} speciality={element[3]} address={element[1]} handleSubmit={()=>openForm(element[1])}/>
              ))
          }
          
        </div>
      </div>
    </div>

{

viewForm &&

<form className='a-book-form' onSubmit={HandleAppointmentFormSubmit}>
  <div onClick={closeForm}>
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
            </div>
<div className='book-app-doc-name'>Book Appointment with :</div>
<div className="a-input-field">
<lable for="app-date">Date:</lable>
<input type="date" name="app-date" id="app-date" value={AppDetails.date} onInput={handleDateChange} />   
</div>  

<div className='a-input-flex'>

  <div className="a-input-field">
  <lable for="app-date">Time</lable>
  <input type="number" name="app-date" id="app-date" value={AppDetails.time} onInput={handleTimeChange} />   
  </div>

  <div className="a-input-field">
    <lable for="app-time">Period:</lable>
    <select id="app-time" name="app-time" value={AppDetails.AmPm} onInput={handleAmChange}>
      <option >Select an option</option>
      <option value="am" >AM</option>
      <option value="pm">PM</option>
    </select>  
    </div>  

</div>

<button type='submit' className='app-b-a'>Book Appointment</button>

</form>
}
</>
  )
}

export default PBookAppointment