import React,{useState,useEffect} from 'react'
import '../css/doctorDashboard.css';
import profile from '../assets/profile.png'
import Button from '../components/Button';
import PatientCard from '../components/PatientCard';
import HRM from '../build/HRM.json';
import { Web3 } from 'web3';
import File from '../components/File';
function DoctorDashboard() {

  const [Account,SetAccount] = useState({
    account:null,
    contract:null,
    instance:null
  });

  const[viewDetail, SetViewDetails] = useState(false);
  const [res,SetRes] = useState([]);
  const[docRes,SetDocRes] = useState([]);
  const[SingleDetail,SetSingleDetails] = useState({
    name:null,
    gender:null,
    email:null,
    dayDate:null,
    time:null,
    address:null,
  })

  const OnViewDetailHandler = async (element) =>{
    console.log(element);
    SetViewDetails(true);
    SetSingleDetails({
      name:element[3][2],
      gender:element[3][4],
      email:element[3][5],
      dayDate:element[1],
      time:element[2],
      address: element[3][1]
    });
    SetDocRes(await Account.instance.methods.GetAllDocuments(element[3][1]).call({from:Account.account}));
  }
  
  const GetDocuments = async () =>{
    
  }

  const OnXPressed = ()=>{
    SetViewDetails(false);
    console.log(docRes);

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
            SetRes(await instance.methods.GetAllAppointments().call({from:account}))
          }
      }
  }

  useEffect(()=>{
    onConnect();
  },[])
  return (
    <div className='App'>
      <div className='container'>
        <div className='pa-left-section'>
          <div className='pd-profile-header'>
            <img src={profile} />
            <p className='address'>{Account.account}</p>
          </div>
          <div className='links'>
          <Button linkto="/PatientDashboard" class="b-active" name="My Appointments"/>
          <Button linkto="/" class="b-not-active" name="Logout"/>
          </div>
        </div>
        <div className='pa-right-section'>
          {
            res.map((element,index)=>(
              //console.log(element)

               <PatientCard key={index} name={element[3][2]} gender={element[3][4]} email={element[3][5]} dayDate={element[1]} address={element[3][1]} time={element[2]} viewDetailsClick={()=> OnViewDetailHandler(element)}/>
              
            ))
          }

          {
            viewDetail && <div className='single-detail'>
              <div onClick={OnXPressed}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
            </div>
                <div className='single-detail-profile'>
                  <img src={profile} />
                  <h1>{SingleDetail.name}</h1>
                </div>
                <div className='single-app-details'>
                  <h3>Appointmment Details</h3>
                    <ul>
                      <li>Email: <strong>{SingleDetail.email}</strong></li>
                      <li>Gender: <strong>{SingleDetail.gender}</strong></li>
                      <li>Appointment Date: <strong>{SingleDetail.dayDate}</strong></li>
                      <li>Appointment Time:<strong>{SingleDetail.time}</strong></li>
                    </ul>
                </div>
                <div className='single-files'>
                  <h3>Documents</h3>
                  {
            docRes.map((element,index)=>(
              <File key={index} name={element[0]} cid={"https://copper-personal-boar-65.mypinata.cloud/ipfs/"+element[1]+"?pinataGatewayToken=GATEWAY_TOKEN_HERE"}/>
            ))
          }
                </div>
            </div>
          }
            
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard