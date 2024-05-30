import React from "react";
import { useState,useEffect } from "react";
import '../css/register.css';
import doctorImage from '../assets/doctor-image.png';
import ethLogo from '../assets/Ethereum-Logo.png';
import { Web3 } from 'web3';
import HRM from '../build/HRM.json';
import {useNavigate} from 'react-router-dom';
function Register()
{
    const navigate = useNavigate();
    const [Account,SetAccount] = useState({
        account:null,
        contract:null
    });

    const [PatientData, SetPatientData] = useState({
        name:"",
        dob:"",
        sex:"",
        email:"",
    });

    const[DoctorData,SetDoctorData] = useState({
        name:"",
        speciality:"",
        email:"",
    });


    const [DoctorSelected, SetDoctorSelected] = useState(true);
    const handlePatientTabClick = ()=>{
        SetDoctorSelected(false);
    }
    const handleDoctorTabClick = ()=>{
        SetDoctorSelected(true);
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

    async function onConnect() {

        const currentProvider = detectCurrentProvider();
        if(currentProvider)
        {
            await currentProvider.request({method:'eth_requestAccounts'});
            const web3 = new Web3(currentProvider);
            const userAccount = await web3.eth.getAccounts();
            const account = userAccount[0];
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = HRM.networks[networkId];
            const instance = new web3.eth.Contract(HRM.abi,deployedNetwork && deployedNetwork.address);
            console.log(instance);
            SetAccount({
                account:account,
                instance:instance,
            })
           
        }
    }

    const Redirect = async()  =>{
      console.log(Account.account);

      if(Account.account)
            {
        
                if(await CheckIfDoctor())
                {
                  navigate("/doctorDashboard");
                }
                else if(await CheckIfPatient()){
                  navigate("/patientDashboard");
                }
            }
    }
    const handleDoctorNameChange = (event)=>{
        SetDoctorData({...DoctorData,name:event.target.value});
        console.log(DoctorData.name);
    }
    const handleDoctorSpecialityChange = (event)=>{
        SetDoctorData({...DoctorData,speciality:event.target.value});
    }
    const handleDoctorEmailChange = (event)=>{
        SetDoctorData({...DoctorData,email:event.target.value});
    }

    const handlePatientNameChange = (event)=>{
        SetPatientData({...PatientData,name:event.target.value});
    }
    const handlePatientDOBChange = (event)=>{
        SetPatientData({...PatientData,dob:event.target.value});
    }
    const handlePatientSexChange = (event)=>{
        SetPatientData({...PatientData,sex:event.target.value});
    }
    const handlePatientEmailChange = (event)=>{
        SetPatientData({...PatientData,email:event.target.value});
    }

    const CheckIfDoctor = async() =>{
      if (Account.instance) {
      try {
        const result = await Account.instance.methods.CheckIfDoctor().call({from:Account.account});
        console.log(result);
        return result;
        
      } catch (error) {
        console.error('Error:', error);
      }
    }
    };

    const CheckIfPatient = async() =>{
      if (Account.instance) {
      try {
        const result = await Account.instance.methods.CheckIfPatient().call({from:Account.account});
        console.log(result);
        return result;

      } catch (error) {
        console.error('Error:', error);
      }
    }
    };

    const RegisterAsDoctor = async (name,speciality,email) => {
        console.log(DoctorData);
        if (Account.instance) {
            console.log("1");
          try {
            console.log("Register")
            const result = await Account.instance.methods.RegisterAsDoctor(name,speciality,email).send({from:Account.account});
            return result;
          } catch (error) {
            console.error('Error:', error);
          }
        }
      };
    
      const RegisterAsPatient = async (name,dob,sex,email) => {
        if (Account.instance) {
          try {
            console.log("Register")
            const result = await Account.instance.methods.RegisterAsPatient(name,dob,sex,email).send({from:Account.account});
            return result;
          } catch (error) {
            console.error('Error:', error);
          }
        }
      };

      const handleDoctorFormSubmit = async (event)=>{
        console.log("D submit");
        event.preventDefault();
        const res = RegisterAsDoctor(DoctorData.name,DoctorData.speciality,DoctorData.email);
        SetDoctorData({
            name:"",
            speciality:"",
            email:"",
        });
        
      }

      const handlePatientFormSubmit = async (event)=>{
        console.log("P submit");
        event.preventDefault();
        const res = RegisterAsPatient(PatientData.name,PatientData.dob,PatientData.sex,PatientData.email);
        SetPatientData({
            name:"",
            dob:"",
            sex:"",
            email:"",
        })
      }
    
    useEffect(()=>{
        onConnect();
    },[])
    return(
        <>
    <div className="App">
      <div className="container">
        <div className="left-section">
          <img src={doctorImage} className="doctor-img"/>
        </div>
        <div className="right-section">
          <div className="right-header">
            <img src={ethLogo} className="eth-logo"/> 
            <h1 className="title">Welcome</h1>
          </div>

          <div className="form-container">
            <div className="tabs">
              <p className= {DoctorSelected?"active doctor-tab":"doctor-tab"} onClick={handleDoctorTabClick}>Doctor</p>
              <p className={DoctorSelected?"patient-tab":"active patient-tab"} onClick={handlePatientTabClick}>Patient</p>
            </div>
            {
              DoctorSelected && <form className="doctor-form" onSubmit={handleDoctorFormSubmit}>

              <div className="input-field">
              <lable for="doctor-name">Name:</lable>
              <input type="text" name="doctor-name" id="doctor-name" value={DoctorData.name} onInput={handleDoctorNameChange} placeholder="Dr.Abhishek" required/>
              </div>              

              <div className="input-field">
              <lable for="doctor-special">Speciality:</lable>
              <input type="text" name="doctor-special" id="doctor-special" value={DoctorData.speciality} onInput={handleDoctorSpecialityChange} placeholder="Eye Specilist" required/>   
              </div>           
            
              <div className="input-field">
              <lable for="doctor-email">Email:</lable>
              <input type="email" name="doctor-email" id="doctor-email" value={DoctorData.email} onInput={handleDoctorEmailChange}placeholder="Dr.Abhishek@gmail.com" required/>     
              </div>         

              <div className="form-buttons">
                <button type="submit" className="submit-button">Register</button>
                {/* <button className="submit-button" onClick={Redirect}>Login</button> */}
              </div>
            </form>
            }
            

            {
                !DoctorSelected && <form className="patient-form" onSubmit={handlePatientFormSubmit}>

                <div className="input-field">
                <lable for="patient-name">Name:</lable>
                <input type="text" name="patient-name" id="patient-name" placeholder="Mr.Rahul Joshi" required value={PatientData.name} onInput={handlePatientNameChange}/>
                </div>              
  
                <div className="input-col-2">
                
                <div className="input-field">
                <lable for="patient-DOB">Date of Birth:</lable>
                <input type="date" name="patient-DOB" id="patient-DOB" placeholder="" required value={PatientData.dob} onInput={handlePatientDOBChange}/>   
                </div>           
                
                <div className="input-field">
                <lable for="patient-gender">Gender:</lable>
                <select id="patient-gender" name="patient-gender" value={PatientData.sex} onInput={handlePatientSexChange} required>
                  <option hidden>Select an option</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>  
                </div>           
  
                </div>
  
              
                <div className="input-field">
                <lable for="patient-email">Email:</lable>
                <input type="email" name="patient-email" id="patient-email" placeholder="rahul.joshi@gmail.com" value={PatientData.email} required onInput={handlePatientEmailChange}/>     
                </div>         
            
                <div className="form-buttons">
                <button type="submit" className="submit-button">Register</button>
              </div>
                
              </form>
            }
                <button className="submit-button" onClick={Redirect}>Login</button>

          </div>
        </div>
      </div>
    </div>
        </>
    )
}

export default Register