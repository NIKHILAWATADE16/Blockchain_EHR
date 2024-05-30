// SPDX-License-Identifier: MIT
pragma experimental ABIEncoderV2;

 pragma solidity <0.9.0;
contract HRM{
    struct Patient
    {
        uint _id;
        address _address;
        string _name;
        string _DOB;
        string _gender;
        string _email;
    }

    struct Doctor
    {
        uint _id;
        address _address;
        string _name;
        string _speciality;
        string _email;
    }

    struct Document{
        string _name;
        string _CID;
    }

    struct Appointment{
        uint256 _id;
        string _time;
        string _date;
        Patient _patient;
    }

    uint256 doctorCount = 0;
    uint256 patientCount = 0;
    Doctor[] allDoctors;
    mapping (address => Doctor) Doctors;
    mapping (address => Patient) Patients;
    mapping (address => Document[]) Documents;
    mapping (address => Appointment[]) Appointments;

    string authorName = "TEJAS";

    function getName()public view returns(string memory ) {
        return authorName;
    }
    modifier isADoctor()
    {
        require(Doctors[msg.sender]._address!=address(0),"You need to be a doctor to get all appointments");
        _;
    }

    function CheckIfDoctor() public view returns(bool){
        if(Doctors[msg.sender]._address == address(0))
        {
            return false;
        }
        else
        {
            return true;
        }
    }

    function CheckIfPatient() public view returns(bool){
        if(Patients[msg.sender]._address == address(0))
        {
            return false;
        }
        else
        {
            return true;
        }
    }

    function BookAppointment(address doctorAddress,string memory time,string memory date) public
    {
        Appointment memory newAppointment = Appointment({
            _id: (Appointments[doctorAddress].length > 0) ? Appointments[doctorAddress].length : 0 ,
            _time:time,
            _date:date,
            _patient: Patients[msg.sender]
        });
        Appointments[doctorAddress].push(newAppointment);
    }

    function GetAllAppointments() public isADoctor view returns (Appointment[] memory)
    {
        return Appointments[msg.sender];
    }
    function UploadDocument(string memory name,string memory CID) public {
        Document memory newDoc = Document({
            _name: name,
            _CID: CID
        }); 
        Documents[msg.sender].push(newDoc);
    }

    function GetAllDocuments(address patientAddress)public view returns (Document[] memory)
    {
        return Documents[patientAddress];
    }

    function RegisterAsDoctor(string memory name,string  memory speciality, string memory email) public {
         require(Doctors[msg.sender]._address == address(0), "Doctor already registered");
        Doctor memory newDoctor = Doctor({
            _id : doctorCount,
            _address : msg.sender,
            _name : name,
            _speciality: speciality,
            _email : email
        });
        Doctors[msg.sender] = newDoctor;
        allDoctors.push(newDoctor);
        doctorCount++;
    }

    function RegisterAsPatient(string memory name, string memory DOB, string memory gender, string memory email) public 
    {
        require(Patients[msg.sender]._address == address(0),"You have already registered");
        Patient memory newPatient = Patient({
            _id: patientCount,
            _address: msg.sender,
            _name: name,
            _DOB : DOB,
            _gender:gender,
            _email:email
        });
        Patients[msg.sender] = newPatient;
        patientCount++;
    }

    function GetAllDoctors() public view returns (Doctor[] memory)
    {
        return allDoctors;
    }
}

