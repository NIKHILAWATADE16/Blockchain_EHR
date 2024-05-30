import React, { useState, useEffect } from 'react'
import '../css/patientDashboard.css';
import Button from '../components/Button';
import profile from '../assets/profile.png'
import File from '../components/File';
import { Form } from 'react-router-dom';
import { create } from 'ipfs-http-client';
import axios from 'axios';
import FormData from 'form-data';
import HRM from '../build/HRM.json';
import { Web3 } from 'web3';



function PatientDashboard() {
  const [res,SetRes] = useState([]);

  const [Account,SetAccount] = useState({
    account:null,
    contract:null
  });
  const[viewForm,SetViewForm] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName,setSelectedFileName] = useState(null);
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
  async function onConnect()
  {
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
              SetRes(await instance.methods.GetAllDocuments(account).call({from:account}))
            }
        }
  }

const openForm=()=>{
  SetViewForm(true);
}

const closeForm = ()=>{
  SetViewForm(false);
};
const handleFileChange = (event) => {
  setSelectedFile(event.target.files[0]);
};

const handleFormSubmission = async (event) =>{
  event.preventDefault();
  if(!selectedFile || !setSelectedFileName)
  {
    console.log("Empty");
    return;
  }
  const JWT = "JWT_KEY_HERE";
  try {
    const response = await pinFileToIPFS(selectedFile, JWT);
    console.log(response.IpfsHash)
    UploadDocument(fileName,response.IpfsHash);
    SetViewForm(false);
    // Handle success
  } catch (error) {
    console.error("Error pinning file to IPFS:", error);
    // Handle error
  }
  //console.log('Document name:', documentName);
}

const pinFileToIPFS = async(file,JWT)=>{
  const formData = new FormData();
  formData.append('file', file);
  try {
    const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
      maxBodyLength: "Infinity",
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        'Authorization': `Bearer ${JWT}`
      }
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

const UploadDocument = async(fileName,cid)=>{
  if(Account.instance)
  {
    try{
      const result = await Account.instance.methods.UploadDocument(fileName,cid).send({from:Account.account});
      return result;
    }catch (error)
    {
      console.error('Error:',error);
    }
  }
}


const HandleFileNameChanged = (event)=>{
            console.log(res);
            setSelectedFileName(event.target.value);
}

useEffect(()=>{
  onConnect();
},[])
  return (
    <>
    <div className='App'>
      <div className='container'>
        <div className='pd-left-section'>
          <div className='pd-profile-header'>
            <img src={profile} />
            <p className='address'>{Account.account}</p>
          </div>
          <div className='links'>
          <Button linkto="/PatientDashboard" class="b-active" name="Documents"/>
          <Button linkto="/pAppointments" class="b-not-active" name="Book Appointment"/>
          <Button linkto="/" class="b-not-active" name="Logout"/>
          </div>
        </div>
        <div className='pd-right-section'>

          {
            res.map((element,index)=>(
              <File key={index} name={element[0]} cid={"https://copper-personal-boar-65.mypinata.cloud/ipfs/"+element[1]+"?pinataGatewayToken=GATEWAY_TOKEN_HERE"}/>
            ))
          }
            <div className='add-file-button' onClick={openForm}>Add Files</div>
        </div>
      </div>
    </div>

    
      {
        viewForm &&
      
      <form className='a-book-form' onSubmit={handleFormSubmission}>
      <div onClick={closeForm}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
      </div>
      <div className='a-input-field'>
        <lable for="doc-name">Document Name:</lable>
        <input type='text' name='doc-name' id='doc-name' onInput={HandleFileNameChanged} required="true"/>
      </div>
      <div className='button-wrap'>
        <input type='file' name='doc' id='doc' onChange={handleFileChange}/>
      </div>
      <button type='submit' className='app-b-a'>Upload</button>
      </form>
    }
    </>
  )
}

export default PatientDashboard