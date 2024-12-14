// App.js
import React, { useState, useEffect } from 'react';
import { Container} from 'react-bootstrap';
import Button from '@mui/material/Button';
import { AgGridReact } from 'ag-grid-react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import axios from 'axios';
import '../CostEstimation/costEstimation.css'

const CostEstimation = () => {
  const [userData, setUserData] = useState({ 
    date: '',
    pltNO: '',
    wipNo: '',
    partNo: '',
    commonDesc: '',
    description: '',
    client: '',
    category: '',
    absAcrylic: '',
    color: '',
    finish: '',
    printCr: '',
    light: '',
    length: '',
    width: '',
    height: '',
    blockHeight: '',
    vol: '',
    area: '',
    stockOptimize: '',
    millingOptimize: '',
    detailingLevel: '',
    printAreaOptimize: '',
    toolDiaA: '',
    qty: '',
    partsAddedTotal: '',
    package: '',
    freight: '',

    //Take Direct input
    printPerCr: '',
    Electronics: ''

    
  });


  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //Settings Page State
  const [fac_eps, setFactor_eps] = useState('');
  const [fac_abrasive, setFactor_abrasive] = useState('');
  const [fac_paint, setFactor_paint] = useState('');
  const [fac_printcr, setFactor_printcr] = useState('');
  const [fac_electronics, setFactor_electronics] = useState('');
  const [fac_cnccost, setFactor_cnccost] = useState('');
  const [fac_fabfinishcost, setFactor_fabfinishcost] = useState('');
  const [fac_printing, setFactor_printing] = useState('');
  //Settings Page State

  const [clients, setClients] = useState([]);
  const [newClientName, setNewClientName] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const [predictedValue, setPredictedValue] = useState(null);
  const [predictedDia, setPredictedDia] = useState(null);
  const [csvData, setCSVData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [quickFilterText, setQuickFilterText] = useState('');
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [existingData, setExistingData] = useState(null);

  // const [selectedTotalPriceAddition, setselectedTotalPriceAddition] = useState([]);
  const [totalPriceAddition, setTotalPriceAddition] = useState('');

  useEffect(() => {
    // Fetch data from the server when the component mounts
    fetchData();
    fetchClients();

    //Settings Page
    async function fetchCostAndTime() {
      try {
          const response = await axios.get('http://localhost:5000/price_factor');
          const {
             factor_eps,  
             factor_abrasive,
             factor_paint,
             factor_printcr,
             factor_electronics,
             factor_cnccost,
             factor_fabfinishcost,
             factor_printing
            } = response.data;
          console.log('Cost:', factor_eps);
        
          setFactor_eps(factor_eps);
          setFactor_abrasive(factor_abrasive);
          setFactor_paint(factor_paint);
          setFactor_printcr(factor_printcr);
          setFactor_electronics(factor_electronics);
          setFactor_cnccost(factor_cnccost);
          setFactor_fabfinishcost(factor_fabfinishcost);
          setFactor_printing(factor_printing);
         
      } catch (error) {
          console.error('Error fetching cost and time:', error);
      }
    }
    fetchCostAndTime();
  }, []);

  const fetchData = () => {
    axios.get(`${config.baseURL}/api/yourData')
      .then(response => setCSVData(response.data))
      .catch(error => console.error(error));
  };

  const fetchClients = async () => {
    try {
        const response = await axios.get('http://localhost:5000/get_clients');
        setClients(response.data.clients);
    } catch (error) {
        console.error('Error fetching clients:', error);
    }
  };

  const handleAddClient = async () => {
    try {
        await axios.post('http://localhost:5000/add_client', { name: newClientName });
        fetchClients();
        setShowPopup(false);
        setNewClientName('');
    } catch (error) {
        console.error('Error adding client:', error);
    }
    handleClose();
  };

  const handleDelete = (id) => {
    
    axios.delete(`${config.baseURL}/api/yourData', { data: { id } })
      .then(response => {
        console.log(response.data);
        fetchData();
      })
      .catch(error => console.error(error));
  };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setUserData((prevData) => ({ ...prevData, [name]: value }));
  // };

  //Code to take calculated value directly from the user
  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    // Check if the input is for "partWt" or "BlockWt"
    if ((name === 'printPerCr' || name === 'Electronics') && value !== '') {
      // User provided "partWt" or "BlockWt" value, update the state directly
      setUserData((prevData) => ({ ...prevData, [name]: parseFloat(value) }));
    } else {
      // Otherwise, update the state as usual
      setUserData((prevData) => ({ ...prevData, [name]: value }));
    }
  };


  const handlePredictChange = (event) => {
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: parseFloat(value) });
  };

  useEffect(() => {
    // Make the prediction whenever input values change
    const predict = async () => {
      try {

        // Extract only length, width, and height properties from userData
        const { length, width, height } = userData;
        const requestData = { length, width, height };

        // Send a POST request to the Flask API
        const response = await fetch(`${config.baseURL}/predict', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });

        // Check if the request was successful
        if (!response.ok) {
          throw new Error(`Request failed with status: ${response.status}`);
        }

        // Parse the JSON response
        const data = await response.json();

        // Update the state with the predicted value
        setPredictedValue(data.predicted_value);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    // Call the predict function
    predict();
  }, [userData.length, userData.width, userData.height]); // Run the effect whenever inputValues change

  useEffect(() => {
    // Make the prediction whenever input values change
    const predictToolDia = async () => {
      try {

        // Extract only length, width, and height properties from userData
        const { length, width } = userData;
        const requestToolDia = { length, width };

        // Send a POST request to the Flask API
        const response = await fetch(`${config.baseURL}/predictToolDia', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestToolDia),
        });

        // Check if the request was successful
        if (!response.ok) {
          throw new Error(`Request failed with status: ${response.status}`);
        }

        // Parse the JSON response
        const data = await response.json();

        // Update the state with the predicted value
        setPredictedDia(data.predicted_value);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    // Call the predict function
    predictToolDia();
  }, [userData.length, userData.width]); // Run the effect whenever inputValues change



  const handleUpdate = (id) => {

    const existingData = csvData.find(row => row.id === id);

    if (!existingData) {
      console.error('Row not found for update');
      return;
    }

    setUserData({
      date: existingData.date,
      pltNO: existingData.pltNO,
      wipNo: existingData.wipNo,
      partNo: existingData.partNo,
      commonDesc: existingData.commonDesc,
      description: existingData.description,
      client: existingData.client,
      category: existingData.category,
      absAcrylic: existingData.absAcrylic,
      color: existingData.color,
      finish: existingData.finish,
      printCr: existingData.printCr,
      light: existingData.light,
      length: existingData.length,
      width: existingData.width,
      height: existingData.height,
      blockHeight: existingData.blockHeight,
      vol: existingData.vol,
      area: existingData.area,
      stockOptimize: existingData.stockOptimize,
      millingOptimize: existingData.millingOptimize,
      detailingLevel : existingData.detailingLevel,
      printAreaOptimize: existingData.printAreaOptimize,
      toolDiaA: existingData.toolDiaA,
      qty: existingData.qty,
      partsAddedTotal: existingData.partsAddedTotal,
      package: existingData.package,
      freight: existingData.freight,

      printPerCr: existingData.printPerCr

    });

    setSelectedRowId(id);
    setExistingData(existingData);
  };


  const handleCalculate = () => {
    // Perform your calculations here

    // Calculation for Block Wt Start 
    const calcBlockWt = () => {

      let H13 = parseFloat(userData.absAcrylic);
      let M13 = parseFloat(userData.length)
      let N13 = parseFloat(userData.width)
      let P13 = parseFloat(userData.blockHeight)
      let S13 = parseFloat(userData.stockOptimize)

      let BlockWt;

      if (H13 === 1 || H13 === 2) {
        BlockWt = ((M13 + 50) * (N13 + 50) * P13 * 1.14 / 1000000) * (S13 / 100);
      } else if (H13 === 3) {
        BlockWt = ((M13 + 50) * (N13 + 50) * P13 * 0.03 / 1000000) * (S13 / 100);
      } else if (H13 === 4) {
        BlockWt = ((M13 + 50) * (N13 + 50) * P13 * 0.0000028) * (S13 / 100);
      } else {
          // Handle other cases if needed
          BlockWt = "FALSE"
      }
      // setBlockWt(BlockWt.toFixed(2));
      return BlockWt;
    }
    // Calculation for Block Wt End 

    // Calculation for Part Wt Start
    const calcPartWt = () => {
      const partWtinKg = parseFloat(userData.absAcrylic);

      let partWt;
      if(partWtinKg === 1 || 2){
        partWt = parseFloat(userData.vol) * 10 * parseFloat(1.14) / 1000
      }
      if(partWtinKg === 3){
        partWt = parseFloat(userData.vol) * 10 * parseFloat(0.03) / 1000
      }
      if(partWtinKg === 4){
        partWt = parseFloat(userData.vol) * 10 * parseFloat(1.14) / 1000
      }
      // setpartWt(partWt.toFixed(2));
      return partWt;
    }
    // Calculation for Part Wt End

    // Calculation for Plastic/EPS/Metel Start
    const calcEPS =() => {
      const x = BlockWt * Number(fac_eps)
      let eps = x
      // seteps(eps.toFixed(2));
      return eps;
    }
    // Calculation for Plastic/EPS/Metel End

    // Calculation for Abrasive/Paste Start
    const calAbrasive = () => {
     let h5 = parseFloat(userData.absAcrylic);
     let j5 = parseFloat(userData.finish);
     let r5 = parseFloat(userData.area);
     let abrasiveRes;

     if ((h5 === 1 || h5 === 0) && j5 === 1) {
       abrasiveRes = (r5 / 100) * 0.05 * Number(fac_abrasive);
      } else if ((h5 === 1 || h5 === 0) && j5 === 2) {
         abrasiveRes = ((r5 / 100) * 0.05 * Number(fac_abrasive)) * 0.75;
      } else if ((h5 === 1 || h5 === 0) && j5 === 3) {
         abrasiveRes = ((r5 / 100) * 0.05 * Number(fac_abrasive)) * 0.5;
      } else if (h5 === 2 && j5 === 2) {
         abrasiveRes = (r5 / 100) * 0.05 * Number(fac_abrasive);
      } else if (h5 === 2 && j5 === 3) {
         abrasiveRes = (r5 / 100) * 0.003 * Number(fac_abrasive);
      } else if (h5 === 3 && j5 === 1) {
         abrasiveRes = ((r5 / 100) * 0.1 * Number(fac_abrasive)) * 1.75;
      } else if (h5 === 3 && j5 === 2) {
         abrasiveRes = ((r5 / 100) * 0.1 * Number(fac_abrasive)) * 1.25;
      } else if (h5 === 3 && j5 === 3) {
         abrasiveRes = (r5 / 100) * 0.1 * Number(fac_abrasive);
      } 
      // setabrasiveRes(abrasiveRes.toFixed(2));
      return abrasiveRes;
    }
    // Calculation for Abrasive/Paste End

    // Calculation for Paint Cost Start
    const calPaintCost = () => {
     let h55 = parseFloat(userData.absAcrylic);
     let j55 = parseFloat(userData.finish);
     let r55 = parseFloat(userData.area);
     let Paint;

     if ((h55 === 1 || h55 === 0 || h55 === 3) && j55 === 1) {
       Paint = (r55 / 100) * 0.1 * Number(fac_paint);
      } else if ((h55 === 1 || h55 === 0 || h55 === 3) && j55 === 2) {
         Paint = ((r55 / 100) * 0.1 * Number(fac_paint)) * 0.4;
      } else if (h55 === 2 && j55 === 2) {
         Paint = (r55 / 100) * 0.03 * Number(fac_paint);
      }
      // setPaint(Paint);
      return Paint;
    }
    // Calculation for Paint Cost End

    // Calculation for Print/Cr Start
    const calPrintCr = () => {
      //if user input value then pass that value else calculate
      if (userData.printPerCr !== '') {
        return parseFloat(userData.printPerCr);
      }

      let k2 = parseFloat(userData.printCr);
      let r2 = parseFloat(userData.area)
      let v2 = parseFloat(userData.printAreaOptimize)
      let printPerCr;

      if (k2 === 1 || k2 === 2) {
        printPerCr = (r2 / 100) * 0.1 * Number(fac_printcr) * (v2/100);
      }
      // setprintPerCr(printPerCr);
      return printPerCr;
      
    }

    // Calculation for Electronics Cost Start
    const calElectronics = () => {
      //if user input value then pass that value else calculate
      if (userData.Electronics !== '') {
        return parseFloat(userData.Electronics);
      }


      let l5 = parseFloat(userData.light)
      let Electronics;

      if (l5 === 1) {
         Electronics = 2.5 * Number(fac_electronics);
      } else if (l5 === 2) {
         Electronics = 1 * Number(fac_electronics);
      } 
      else {
          // Handle other cases or return a default value
          Electronics = "False";
      }
      // setElectronics(Electronics);
      return Electronics;
    }
    // Calculation for Electronics Cost End

    // Calculation for Total material Start
    const calTotalMaterial = () => {
      // Declare variables with int, char, and float values
       const var1 = partWt
       const var2 = eps
       const var3 = abrasiveRes
       const var4 = Paint
       const var5 = printPerCr
       const var6 = Electronics

      //  console.log(partWt)
      //  console.log(eps)
      //  console.log(abrasiveRes)
      //  console.log(Paint)
      //  console.log(printPerCr)
      //  console.log(Electronics)

      let TotalMaterial =0
        // Check and calculate sum for variables with int or float values
        const checkAndAddToSum = (value) => {
            if (value !== undefined && typeof value === 'number' && !isNaN(value)) {
              // console.log("Sorted Values")
              // console.log(value)
              TotalMaterial += value;
            }
        }; 
    
        checkAndAddToSum(var1);
        checkAndAddToSum(var2);
        checkAndAddToSum(var3);
        checkAndAddToSum(var4);
        checkAndAddToSum(var5);
        checkAndAddToSum(var6);

        // setTotalMaterial(TotalMaterial.toFixed(2));
        return TotalMaterial;
      
    };
    // Calculation for Total material End

    // Calculation for Substraction Start
    const calSubstraction = () => {
      let M5 =  parseFloat(userData.length)
      let AI5 =  parseFloat(userData.toolDiaA)
      let N5 =  parseFloat(userData.width)
      let P5 =  parseFloat(userData.height)
      let Q5 =  parseFloat(userData.vol)

      let Substraction = ((M5 + AI5) * (N5 + AI5) * P5 / 1000) - (Q5*10);
      // setSubstraction(Substraction);
      return Substraction;
    }
    // Calculation for Substraction End

    // Calculation for Removal Start
    const calremoval = () => {
      const AE5 = Substraction
      let m55 = parseFloat(userData.length)
      let n55 = parseFloat(userData.width)
      let o55 = parseFloat(userData.height) 
      let t55 = parseFloat(userData.millingOptimize)

      let Removal = (AE5 / (m55 * n55 * o55 / 1000) * 100) * (t55 / 100);
      // setRemoval(Removal.toFixed(2));
      return Removal;
    }
    // Calculation for Removal End

    // Calculation for Block Side Area Start
    const calBlockSizeArea = () => {
      let val1 = parseFloat(userData.length)
      let val2 = parseFloat(userData.width)
      
      let BlockSizeArea = val1 * val2;
      // setBlockSizeArea(BlockSizeArea);
      return BlockSizeArea;
    }
    // Calculation for Block Side Area End

    // Calculation for Total Dia (E) Start
    const calTotalDiaE = () => {
      const AG5 = BlockSizeArea
      let toolDiaE = Math.sqrt(AG5)/50;
      // settoolDiaE(toolDiaE.toFixed(2));
      return toolDiaE;
    }
    // Calculation for Total Dia (E) End

    // Calculation for Length of Cut Start
    const calLengthOfCut = () => {

      let H13832 = parseFloat(userData.absAcrylic)
      let AG13832 = BlockSizeArea
      let AI13832 = parseFloat(userData.toolDiaA)
      let P13832 = parseFloat(userData.blockHeight)
      let AF13832 = Removal

      let lengthOfCut;

      if (H13832 === 1 || H13832 === 2) {
        lengthOfCut = (AG13832 / AI13832 * 0.5) * P13832 * (AF13832 / 100);
      } else if (H13832 === 3) {
        lengthOfCut = (AG13832 / AI13832 * 0.5) * P13832 * 0.5 * (AF13832 / 100);
      } else if (H13832 === 4) {
        lengthOfCut = (AG13832 / AI13832 * 0.5) * (P13832 / 0.3) * (AF13832 / 100);
      } else {
          // Handle other cases if needed
          lengthOfCut = "FALSE"
      }

      // setlengthOfCut(lengthOfCut.toFixed(2));
      return lengthOfCut;
    }
    // Calculation for Length of Cut End

    // Calculation for Numerical time Start
    const calNumerical = () => {
      let AJ6 = lengthOfCut
      let AI6 = parseFloat(userData.toolDiaA)
      let T6 = parseFloat(userData.millingOptimize)
      let U6 = parseFloat(userData.detailingLevel)

      let NumericalValue = (AJ6 / (AI6 * 150) / 60 * (T6 / 100)) * U6;
      // setNumericalValue(NumericalValue.toFixed(2));
      return NumericalValue;
    }
    // Calculation for Numerical time End

    // Calculation for CAD/CAM/CNC in Hours Start
    const calCad = () => {
      let AL6 = NumericalValue
      
      if (isNaN(AL6) || AL6 < 0) {
        return "Invalid input";
      }
      let totalMinutes = AL6 * 60;
      let hours = Math.floor(totalMinutes / 60);
      let minutes = Math.round(totalMinutes % 60);
  
      let formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
      let formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  
      let CAD_time =  `${formattedHours}:${formattedMinutes}`;
      // setCAD_time(CAD_time);
      return CAD_time;
    }
    // Calculation for CAD/CAM/CNC in Hours End
 
    // Calculation for CNC cost in Hours Start
    const calCNCcost = () => {
      let H5 = parseFloat(userData.absAcrylic);
      let AK5 = NumericalValue;

      let CNC_Cost;

      if (H5 === 1 || H5 === 0) {
        CNC_Cost = AK5 * 688 * 1;
      } else if (H5 === 2) {
        CNC_Cost = AK5 * 688 * 2;
      } else if (H5 === 3) {
        CNC_Cost = AK5 * 688 * 1;
      }
      // setCNC_Cost(CNC_Cost.toFixed(2));
      return CNC_Cost; 
    }
    // Calculation for CNC cost in Hours End

    // Calculation for Fabrication & Finish (Hrs) Start
    let temp;
    const calFabCostinHRS = () => {
      let H12 =   parseFloat(userData.absAcrylic);
      let J12 =  parseFloat(userData.finish);
      let AK12 =  NumericalValue
      let L12 =  parseFloat(userData.light);

      let result;

      if ((H12 === 1 || H12 === 2) && J12 === 1) {
          result = (AK12 * 3 / 24) + (L12 * 4 / 24);
      } else if ((H12 === 1 || H12 === 2) && J12 === 2) {
          result = (AK12 * 3 / 24) * 0.75 + (L12 * 4 / 24);
      } else if ((H12 === 1 || H12 === 2) && J12 === 3) {
          result = (AK12 * 3 / 24) * 0.25 + (L12 * 4 / 24);
      } else if (H12 === 3 && J12 === 2) {
          result = AK12 * 3 / 24;
      } else if (H12 === 3 && J12 === 3) {
          result = AK12 * 0.25 / 24;
      } else if (H12 === 4 && J12 === 1) {
          result = AK12 * 3 / 24;
      } else if (H12 === 4 && J12 === 2) {
          result = (AK12 * 3 / 24) * 0.75;
      } else if (H12 === 4 && J12 === 3) {
          result = (AK12 * 3 / 24) * 0.5;
      } else {
          // Handle other cases if needed
          result = "FALSE"
      }

      temp = result
      let res1 = result

      let totalMinutes = Math.floor(res1 * 24 * 60);
      let hours = Math.floor(totalMinutes / 60);
      let minutes = totalMinutes % 60;
      let formattedTime = (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes;

      let FabInHrs = formattedTime  
      // setFabInHrs(FabInHrs);    
      return FabInHrs;

    }
    // Calculation for Fabrication & Finish (Hrs) End

    // Calculation for FAB/FIN Cost (Rs) Start
    const calfabCostinRS = () => {
      let AN6 =  temp //FabInHrs
      let FAB_CostinRS = AN6 * 24 * Number(fac_fabfinishcost) * 1;
      // setFAB_CostinRS(FAB_CostinRS.toFixed(2));
      return FAB_CostinRS;
    }
    // Calculation for FAB/FIN Cost (Rs) End

    // Calculation for Printing (Hrs) Start
    let temp2;
    const calPaintingHrs = () => {
      let K14 = parseFloat(userData.printCr);
      let J14 = parseFloat(userData.finish);
      let AK14 = NumericalValue

      let result;

      if (K14 === 1 || K14 === 2) {
        if (J14 === 1) {
            result = (AK14 + 4) / 2 / 24;
        } else if (J14 === 2) {
            result = ((AK14 * 0.5 + 4) / 2 / 24);
        } else if (J14 === 3) {
            result = ((AK14 * 0 + 4) / 2 / 24);
        }
    } else {
        if (J14 === 1) {
            result = (AK14 + 4 * K14) / 2 / 24;
        } else if (J14 === 2) {
            result = ((AK14 * 0.5 + 4 * K14) / 2 / 24);
        } else if (J14 === 3) {
            result = ((AK14 * 0 + 4 * K14) / 2 / 24);
        }
    }


      temp2 = result
      let res2 = result

      if (isNaN(res2) || res2 < 0) {
        return "Invalid input";
      }
      let totalMinutes = res2 * 60;
      let hours = Math.floor(totalMinutes / 60);
      let minutes = Math.round(totalMinutes % 60);
  
      let formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
      let formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  
      let Painting_Hrs =  `${formattedHours}:${formattedMinutes}`;
      // setPainting_Hrs(Painting_Hrs);
      return Painting_Hrs;
    }
    // Calculation for Printing (Hrs) End

    // Calculation for Printing + Print End
    const calPrintingAndPrint = () => {
      let AP6 = temp2//Painting_Hrs
      
      let printing_and_print =  AP6 * 24 * 0.5 * Number(fac_printing);
      // setprinting_and_print(printing_and_print);
      return printing_and_print;
    }
    // Calculation for Printing + Print End

    // Calculation for Sub Total Start
    const calSubTotal = () => {
      let AD6 = TotalMaterial
      let AM6 = CNC_Cost
      let AO6 = FAB_CostinRS
      let AQ6 = printing_and_print

      let subTotal = AD6 + AM6 + AO6 + AQ6;
      // setTotal(subTotal.toFixed(2));
      return subTotal;
    }
    // Calculation for Sub Total End

    // Calculation for Total Price Start
    const caltotalPrice = () => {
      let Y = subTotal
      let AB = parseInt(userData.qty);
      let totalPrice = Y * AB
      return totalPrice
    }
    // Calculation for Total Price End

    // Calculation for Packaging Start
    const calpackaging = () => {
      let AC13 = totalPrice
      let AD13 = parseFloat(userData.partsAddedTotal);
      let AE13 = parseFloat(userData.package);
      let AF13 = parseFloat(userData.freight);
      let AB13 = parseFloat(userData.qty);
      let packaging = (AC13 / AD13 * (AE13 + AF13)) / AB13;
      return packaging
    }
    //Calculation for Packaging End

    //Calculation for Base Price Start
    const calBasePrice = () => {
      let basePrice = subTotal + packaging
      return basePrice
    }
    //Calculation for Base Price End

    //Calculation for Total Start
    const caltotal = () => {
      let AB1 = parseFloat(userData.qty);
      let AA = basePrice
      let total = AB1 * AA
      return total
    } 
    //Calculation for Total End


    const BlockWt = calcBlockWt();
    const partWt = calcPartWt();
    const eps = calcEPS();
    const abrasiveRes = calAbrasive();
    const Paint = calPaintCost();
    const printPerCr = calPrintCr();
    const Electronics = calElectronics();
    const TotalMaterial = calTotalMaterial();
    const Substraction = calSubstraction();
    const Removal = calremoval();
    const BlockSizeArea = calBlockSizeArea();
    const toolDiaE = calTotalDiaE();
    const lengthOfCut = calLengthOfCut();
    const NumericalValue = calNumerical();
    const CAD_time = calCad();
    const CNC_Cost = calCNCcost();
    const FabInHrs = calFabCostinHRS();
    const FAB_CostinRS = calfabCostinRS();
    const Painting_Hrs = calPaintingHrs();
    const printing_and_print = calPrintingAndPrint();
    const subTotal = calSubTotal();
    const totalPrice = caltotalPrice();
    const packaging = calpackaging();
    const basePrice = calBasePrice();
    const total = caltotal();

    // const isDataDuplicate = csvData.some((data) => {
    //   return Object.keys(userData).every((key) => userData[key] === data[key]);
    // });
    
    // Prepare the data to send to the server
    const postData = {

      date: userData.date,
      pltNO: userData.pltNO,
      wipNo: userData.wipNo,
      partNo: userData.partNo,
      commonDesc: userData.commonDesc,
      description: userData.description,
      client: userData.client,
      category: userData.category,
      absAcrylic: userData.absAcrylic,
      color: userData.color,
      finish: userData.finish,
      printCr: userData.printCr,
      light: userData.light,
      length: userData.length,
      width: userData.width,
      height: userData.height,
      blockHeight: userData.blockHeight,
      vol: userData.vol,
      area: userData.area,
      stockOptimize: userData.stockOptimize,
      millingOptimize: userData.millingOptimize,
      detailingLevel : userData.detailingLevel,
      printAreaOptimize: userData.printAreaOptimize,
      toolDiaA: userData.toolDiaA,
      qty: userData.qty,
      partsAddedTotal: userData.partsAddedTotal,
      package: userData.package,
      freight: userData.freight,


      BlockWt: parseFloat(BlockWt.toFixed(2)),
      partWt: parseFloat(partWt?.toFixed(2)),
      eps: parseFloat(eps.toFixed(2)),
      abrasiveRes: parseFloat(abrasiveRes?.toFixed(2)),
      Paint: parseFloat(Paint),
      printPerCr: parseFloat(printPerCr),
      Electronics: parseFloat(Electronics),
      TotalMaterial:parseFloat(TotalMaterial.toFixed(2)),
      Substraction: parseFloat(Substraction.toFixed(2)),
      Removal: parseFloat(Removal.toFixed(2)),
      BlockSizeArea: parseFloat(BlockSizeArea.toFixed(2)),
      toolDiaE: parseFloat(toolDiaE.toFixed(2)),
      lengthOfCut: parseFloat(lengthOfCut.toFixed(2)),
      NumericalValue: parseFloat(NumericalValue?.toFixed(2)),
      CAD_time: CAD_time,
      CNC_Cost: parseFloat(CNC_Cost?.toFixed(2)),
      FabInHrs: FabInHrs,
      FAB_CostinRS: parseFloat(FAB_CostinRS.toFixed(2)),
      Painting_Hrs: Painting_Hrs,
      printing_and_print: parseFloat(printing_and_print.toFixed(2)),
      subTotal: parseFloat(subTotal.toFixed(2)),
      totalPrice: parseFloat(totalPrice.toFixed(2)),
      packaging: parseFloat(packaging.toFixed(2)),
      basePrice: parseFloat(basePrice.toFixed(2)),
      total: parseFloat(total.toFixed(2))

    };

    const updatedData = {
      id: selectedRowId,
      date: userData.date,
      pltNO: userData.pltNO,
      wipNo: userData.wipNo,
      partNo: userData.partNo,
      commonDesc: userData.commonDesc,
      description: userData.description,
      client: userData.client,
      category: userData.category,
      absAcrylic: userData.absAcrylic,
      color: userData.color,
      finish: userData.finish,
      printCr: userData.printCr,
      light: userData.light,
      length: userData.length,
      width: userData.width,
      height: userData.height,
      blockHeight: userData.blockHeight,
      vol: userData.vol,
      area: userData.area,
      stockOptimize: userData.stockOptimize,
      millingOptimize: userData.millingOptimize,
      detailingLevel : userData.detailingLevel,
      printAreaOptimize: userData.printAreaOptimize,
      toolDiaA: userData.toolDiaA,
      qty: userData.qty,
      partsAddedTotal: userData.partsAddedTotal,
      package: userData.package,
      freight: userData.freight,


      BlockWt: parseFloat(BlockWt.toFixed(2)),
      partWt: parseFloat(partWt?.toFixed(2)),
      eps: parseFloat(eps.toFixed(2)),
      abrasiveRes: parseFloat(abrasiveRes?.toFixed(2)),
      Paint: parseFloat(Paint),
      printPerCr: parseFloat(printPerCr),
      Electronics: parseFloat(Electronics),
      TotalMaterial:parseFloat(TotalMaterial.toFixed(2)),
      Substraction: parseFloat(Substraction.toFixed(2)),
      Removal: parseFloat(Removal.toFixed(2)),
      BlockSizeArea: parseFloat(BlockSizeArea.toFixed(2)),
      toolDiaE: parseFloat(toolDiaE.toFixed(2)),
      lengthOfCut: parseFloat(lengthOfCut.toFixed(2)),
      NumericalValue: parseFloat(NumericalValue?.toFixed(2)),
      CAD_time: CAD_time,
      CNC_Cost: parseFloat(CNC_Cost?.toFixed(2)),
      FabInHrs: FabInHrs,
      FAB_CostinRS: parseFloat(FAB_CostinRS.toFixed(2)),
      Painting_Hrs: Painting_Hrs,
      printing_and_print: parseFloat(printing_and_print.toFixed(2)),
      subTotal: parseFloat(subTotal.toFixed(2)),
      totalPrice: parseFloat(totalPrice.toFixed(2)),
      packaging: parseFloat(packaging.toFixed(2)),
      basePrice: parseFloat(basePrice.toFixed(2)),
      total: parseFloat(total.toFixed(2))

    };


    const mergedData = { ...existingData, ...updatedData };

    if (selectedRowId){
      axios.patch(`${config.baseURL}/api/yourData', mergedData)
      .then(response => {
        console.log(response.data);
        fetchData();
        // setUserData({ 
        //   absAcrylic: '',
        //   length: '',
        //   width: '',
        //   blockHeight: '', 
        //   vol: '', 
        //   stockOptimize:''});
        setUserData(prevUserData => {
          const oldUserData = { ...prevUserData };
          for (let entry in oldUserData) {
            oldUserData[entry] = '';
          }
          return oldUserData;
        });


        // Reset the selectedRowId state
        setSelectedRowId(null);
      })
      .catch(error => console.error(error));

    } else {

      axios.post(`${config.baseURL}/api/yourData', postData)
      .then(response => {
        setCSVData(prevData => [...prevData, response.data]);
        fetchData();
        setUserData(prevUserData => {
          const newUserData = { ...prevUserData };
          for (let entry in newUserData) {
            newUserData[entry] = '';
          }
          return newUserData;
        });
      })
      .catch(error => console.error(error));
    }

  };

  const onGridReady = (params) => {
    setGridApi(params.api);
  }

  const onSelectionChanged = () => {
    const selectedNodes = gridApi.getSelectedNodes();
  
    // Check if any selected item has undefined or non-numeric totalPrice
    const hasInvalidTotalPrice = selectedNodes.some(node => (
      !node.data || typeof node.data.totalPrice === 'undefined' || isNaN(parseFloat(node.data.totalPrice))
    ));
  
    if (hasInvalidTotalPrice) {
      // Show an alert message or handle the invalid totalPrice values as needed
      alert('One or more selected items have invalid or undefined Total Price.');
      setTotalPriceAddition(0); // Reset the total if there's an issue
    } else {
      // Proceed with the calculation and set the totalSelectedLength
      const selectedTotalPrices = selectedNodes.map(node => parseFloat(node.data.totalPrice));
      const total = selectedTotalPrices.reduce((acc, totalPrice) => acc + totalPrice, 0);
      setTotalPriceAddition(total);
    }
  };


  // const isButtonDisabled = Object.keys(userData).some(key => key !== 'wipNo'  && key !== 'partNo' && userData[key] === '');
  const isButtonDisabled = Object.keys(userData).some(key => key !== 'wipNo'  && key !== 'partNo' && userData[key] === '');

  const columnDefs = [
    { headerName: 'DATE', field: 'date', rowGroup: true, hide: false },
    { headerName: 'PLT NO', field: 'pltNO'},
    { headerName: 'WIP No', field: 'wipNo'},
    { headerName: 'PART NO', field: 'partNo', rowGroup: true, hide: false },
    { headerName: 'CLIENT', field: 'client', rowGroup: true, hide: false },
    { headerName: 'COMMON DESCRIPTION', field: 'commonDesc', rowGroup: true, hide: false},
    { headerName: 'DESCRIPTION', field: 'description' },
    { headerName: 'CATEGORY', field: 'category' },
    { headerName: 'ABS/ACRYLIC', field: 'absAcrylic' },
    { headerName: 'COLOR', field: 'color' },
    { headerName: 'FINISH', field: 'finish' },
    { headerName: 'PRINT/CR', field: 'printCr' },
    { headerName: 'LIGHT', field: 'light' },
    { headerName: 'LENGTH', field: 'length' },
    { headerName: 'WIDTH', field: 'width' },
    { headerName: 'HEIGHT', field: 'height' },
    { headerName: 'BLOCK HEIGHT', field: 'blockHeight' },
    { headerName: 'VOLUME', field: 'vol' },
    { headerName: 'AREA', field: 'area' },
    { headerName: 'STOCK OPTIMIZE', field: 'stockOptimize' },
    { headerName: 'MILLING OPTIMIZE', field: 'millingOptimize' },
    { headerName: 'DETAILING LEVEL', field: 'detailingLevel' },
    { headerName: 'PRINT AREA OPTIMIZE', field: 'printAreaOptimize' },
    { headerName: 'TOOL DIA (A)', field: 'toolDiaA' },
    { headerName: 'QTY', field: 'qty' },
    { headerName: 'PARTS ADDED TOTAL', field: 'partsAddedTotal' },
    { headerName: 'PACKAGE', field: 'package' },
    { headerName: 'FREIGHT', field: 'freight' },

    { headerName: 'BLOCK WT', field: 'BlockWt' },
    { headerName: 'PART WT', field: 'partWt' },
    { headerName: 'PLASTIC/EPS/METAL', field: 'eps' },
    { headerName: 'ABRASIVE/PASTE', field: 'abrasiveRes' },
    { headerName: 'PAINT', field: 'Paint' },
    { headerName: 'PRINT / CR', field: 'printPerCr' },
    { headerName: 'Electronics', field: 'Electronics' },
    { headerName: 'TOTAL MATERIAL', field: 'TotalMaterial' },
    { headerName: 'SUBSTRACTION', field: 'Substraction' },
    { headerName: 'REMOVAL', field: 'Removal' },
    { headerName: 'BLOCK SIZE AREA', field: 'BlockSizeArea' },
    { headerName: 'TOOL DIA (E)', field: 'toolDiaE' },
    { headerName: 'LENGTH OF CUT', field: 'lengthOfCut' },
    { headerName: 'NUMERICAL TIME', field: 'NumericalValue' },
    { headerName: 'CAD/CAM/CNC (Hrs)', field: 'CAD_time' },
    { headerName: 'CNC Cost (Rs.)', field: 'CNC_Cost' },
    { headerName: 'FABRICATION & FINISH (Hrs)', field: 'FabInHrs' },
    { headerName: 'FAB/FIN Cost (Rs.)', field: 'FAB_CostinRS' },
    { headerName: 'PAINTING (Hrs)', field: 'Painting_Hrs' },
    { headerName: 'PAINTING + PRINT COST', field: 'printing_and_print' },
    { headerName: 'SUB TOTAL', field: 'subTotal' },
    { headerName: 'TOTAL PRICE', field: 'totalPrice', checkboxSelection: true },
    { headerName: 'PACKAGING & FORWARDING', field: 'packaging' },
    { headerName: 'BASE PRICE', field: 'basePrice' },
    { headerName: 'TOTAL', field: 'total' },

    {
      headerName: 'Update',
      cellRenderer: (params) => (
        <Button 
         variant="contained" 
         onClick={() => {
          if (params.data && params.data.id !== undefined) {
            handleUpdate(params.data.id);
          } else {
            alert("Can not update Entire Group");
          }
         }
         }>
          Update
        </Button>
      ),
    },

    {
      headerName: 'Delete',
      cellRenderer: (params) => (
        <Button 
         variant="contained" 
         onClick={() => {
          if (params.data && params.data.id !== undefined) {
            handleDelete(params.data.id);
          } else {
            alert("Can not delete Entire Group");
          }
         }
         }>
          Delete
        </Button>
      ),
    },
  ];

  const onQuickFilterTextChange = (e) => {
    setQuickFilterText(e.target.value);
    if (gridApi) {
      gridApi.setQuickFilter(e.target.value);
    }
  };

  // const shouldShowDiv = userData.length !== '' && userData.width !== '' && userData.height !== '' && userData.vol !== '' && userData.area !== '';


  return (
    <div>
      <Container>
        <div className='p-3 d-flex gap-3'>
          <TextField
                label="DATE"
                type="Date"
                name="date"
                value={userData.date}
                onChange={handleInputChange}
                variant="outlined"
                margin="small"
                size="small"
                InputLabelProps={{
                  shrink: true,
                }}
          />

          <FormControl sx={{ minWidth: 210 }} size="small">
            <InputLabel id="finish-label">CLIENT</InputLabel>
            <Select
              labelId="client-label"
              id="client"
              name="client"
              value={userData.client}
              onChange={handleInputChange}
              label="CLIENT"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              
              {clients.map((client, index) => (
                <MenuItem key={client.id || index} value={client.id || client}>
                  {client.name || client}
                </MenuItem>
              ))}
            
              {/* Add more MenuItem items as needed */}
            </Select>
          </FormControl>

          <Button variant="contained" onClick={handleOpen} style={{height:"40px"}}>
            New
          </Button>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add Client</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Client Name"
              type="text"
              value={newClientName}
              onChange={(e) => setNewClientName(e.target.value)}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAddClient}>Save</Button>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </Dialog>

          <TextField
              label="PLT NO"
              type="number"
              name="pltNO"
              value={userData.pltNO}
              onChange={handleInputChange}
              variant="outlined"
              margin="small"
              size="small"
              InputProps={{
                inputProps: { min: 0 }
              }}
          />

          <TextField
              label="WIP NO"
              type="number"
              name="wipNo"
              value={userData.wipNo}
              onChange={handleInputChange}
              variant="outlined"
              margin="small"
              size="small"
              InputProps={{
                inputProps: { min: 0 }
              }}
          />

          <TextField
            label="Search"
            variant="outlined"
            margin="small"
            size="small"
            type="text"
            value={quickFilterText}
            onChange={onQuickFilterTextChange}
          />

        </div>

        <div className="d-flex " >
          <div style={{width:"50%"}}>
            <div className='p-3 d-flex gap-3' style={{backgroundColor:"#ADD8E6"}}>

              <TextField
                label="CATEGORY"
                type="text"
                name="category"
                value={userData.category}
                onChange={handleInputChange}
                variant="outlined"
                margin="small"
                size="small"
              />

              <TextField
                label="COMMON DESCRIPTION"
                type="text"
                name="commonDesc"
                value={userData.commonDesc}
                onChange={handleInputChange}
                variant="outlined"
                margin="small"
                size="small"
              />
              <Button variant="contained" onClick={handleCalculate} >
                Calculate
              </Button>

            </div>

            <div className='p-3 d-flex gap-3' >
              <TextField
                label="PART NO"
                type="text"
                name="partNo"
                value={userData.partNo}
                onChange={handleInputChange}
                variant="outlined"
                margin="small"
                size="small"
              />

              <TextField
              label="DESCRIPTION"
              type="text"
              name="description"
              value={userData.description}
              onChange={handleInputChange}
              variant="outlined"
              margin="small"
              size="small"
            />

            <TextField
              label="Qty"
              type="number"
              name="qty"
              value={userData.qty}
              onChange={handleInputChange}
              variant="outlined"
              margin="small"
              size="small"
              InputProps={{
                inputProps: { min: 0 }
              }}
            />

            </div>

            <div className='d-flex justify-content-between gap-3' style={{overflow:"scroll"}}> 
              <div>
                <div className='d-flex justify-content-between'>
                  <div className='pt-3 d-flex align-items-center'>
                    <p className='m-0' style={{transform:"rotate(90deg)"}}>Part Specifications</p>
                  </div>

                  <div className='d-flex flex-column gap-3 pt-3 pb-3'>
                    
                  <FormControl sx={{ minWidth: 210 }} size="small">
                      <InputLabel id="absAcrylic-label">ABS / ACRYLIC</InputLabel>
                      <Select
                        labelId="absAcrylic-label"
                        id="absAcrylic"
                        name="absAcrylic"
                        value={userData.absAcrylic}
                        onChange={handleInputChange}
                        label="ABS / ACRYLIC"
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value="1">ABS</MenuItem>
                        <MenuItem value="2">ACRYLIC</MenuItem>
                        <MenuItem value="3">EPS</MenuItem>
                        <MenuItem value="4">ALUMINIUM</MenuItem>
                        {/* Add more MenuItem items as needed */}
                      </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: 210 }} size="small">
                      <InputLabel id="finish-label">FINISH</InputLabel>
                      <Select
                        labelId="finish-label"
                        id="finish"
                        name="finish"
                        value={userData.finish}
                        onChange={handleInputChange}
                        label="FINISH"
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value="1">Gloss</MenuItem>
                        <MenuItem value="2">Matt</MenuItem>
                        <MenuItem value="3">Natural</MenuItem>
                      
                        {/* Add more MenuItem items as needed */}
                      </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: 210 }} size="small">
                      <InputLabel id="printCr-label">PRINT/CR</InputLabel>
                      <Select
                        labelId="printCr-label"
                        id="printCr"
                        name="printCr"
                        value={userData.printCr}
                        onChange={handleInputChange}
                        label="PRINT/CR"
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value="1">Print</MenuItem>
                        <MenuItem value="2">Chrome</MenuItem>
                        <MenuItem value="0">NA</MenuItem>
                      
                        {/* Add more MenuItem items as needed */}
                      </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: 210 }} size="small">
                      <InputLabel id="light-label">LIGHT</InputLabel>
                      <Select
                        labelId="light-label"
                        id="light"
                        name="light"
                        value={userData.light}
                        onChange={handleInputChange}
                        label="LIGHT"
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value="1">Backlight</MenuItem>
                        <MenuItem value="2">AddASM</MenuItem>
                        <MenuItem value="0">NA</MenuItem>
                      
                        {/* Add more MenuItem items as needed */}
                      </Select>
                    </FormControl>
                  </div>

                </div>
              </div>

              <div className='pt-3'>
                <TextField
                  label="COLOR"
                  type="text"
                  name="color"
                  value={userData.color}
                  onChange={handleInputChange}
                  variant="outlined"
                  margin="small"
                  size="small"
                />

                <div className='d-flex justify-content-between gap-3 pt-3 pe-5'>
                  <div className='d-flex flex-column gap-3' style={{minWidth:"4cm"}}>
                    <TextField
                      label="LENGTH"
                      type="number"
                      name="length"
                      value={userData.length}
                      // onChange={handleInputChange}
                      onChange={(event) => {
                        handleInputChange(event)
                        handlePredictChange(event)
                      }}
                      variant="outlined"
                      margin="small"
                      size="small"
                      InputProps={{
                        inputProps: { min: 0 }
                      }}
                    />

                    <TextField
                      label="WIDTH"
                      type="number"
                      name="width"
                      value={userData.width}
                      // onChange={handleInputChange}
                      onChange={(event) => {
                        handleInputChange(event)
                        handlePredictChange(event)
                      }}
                      variant="outlined"
                      margin="small"
                      size="small"
                      InputProps={{
                        inputProps: { min: 0 }
                      }}
                    />

                    <TextField
                      label="HEIGHT"
                      type="number"
                      name="height"
                      value={userData.height}
                      // onChange={handleInputChange}
                      onChange={(event) => {
                        handleInputChange(event)
                        handlePredictChange(event)
                      }}
                      variant="outlined"
                      margin="small"
                      size="small"
                      InputProps={{
                        inputProps: { min: 0 }
                      }}
                    />
                  </div>

                  <div>
                    <div className='d-flex flex-column gap-3' style={{minWidth:"4cm"}}>
                      <TextField
                        label="VOLUME"
                        type="number"
                        name="vol"
                        value={userData.vol}
                        onChange={handleInputChange}
                        variant="outlined"
                        margin="small"
                        size="small"
                        InputProps={{
                          inputProps: { min: 0 }
                        }}
                      />

                      <TextField
                        label="AREA"
                        type="number"
                        name="area"
                        value={userData.area}
                        onChange={handleInputChange}
                        variant="outlined"
                        margin="small"
                        size="small"
                        InputProps={{
                          inputProps: { min: 0 }
                        }}
                      />

                    <TextField
                      label="Electronics"
                      type="number"
                      name="Electronics"
                      value={userData.Electronics}
                      onChange={handleInputChange}
                      variant="outlined"
                      margin="small"
                      size="small"
                      InputProps={{
                        inputProps: { min: 0 }
                      }}
                    />

                       
                    </div>
                    
                  </div>

                </div>

              </div>

            </div>

            <div style={{backgroundColor:"#ADD8E6"}}>
              <div className='d-flex pt-3 pb-3'>
                  <div className='pt-3 d-flex align-items-center'>
                    <p className='m-0' style={{transform:"rotate(90deg)", maxWidth:"3.2cm"}}>Optimization</p>
                  </div>

                <div className='d-flex gap-5'>
                  <div className='d-flex flex-column gap-3'>
                    <TextField
                        label="BLOCK HEIGHT"
                        type="number"
                        name="blockHeight"
                        value={userData.blockHeight}
                        onChange={handleInputChange}
                        variant="outlined"
                        margin="small"
                        size="small"
                        InputProps={{
                          inputProps: { min: 0 }
                        }}
                      />
                      <TextField
                        label="STOCK OPTIMIZE"
                        type="number"
                        name="stockOptimize"
                        value={userData.stockOptimize}
                        onChange={handleInputChange}
                        variant="outlined"
                        margin="small"
                        size="small"
                        InputProps={{
                          inputProps: { min: 0 }
                        }}
                      />

                      <TextField
                        label="MILLING OPTIMIZE"
                        type="number"
                        name="millingOptimize"
                        value={userData.millingOptimize}
                        onChange={handleInputChange}
                        variant="outlined"
                        margin="small"
                        size="small"
                        InputProps={{
                          inputProps: { min: 0 }
                        }}
                      />
                      <TextField
                        label="PRINT AREA OPTIMIZE"
                        type="number"
                        name="printAreaOptimize"
                        value={userData.printAreaOptimize}
                        onChange={handleInputChange}
                        variant="outlined"
                        margin="small"
                        size="small"
                        InputProps={{
                          inputProps: { min: 0 }
                        }}
                      />
                  </div>

                  <div className='d-flex flex-column gap-3'>
                      <TextField
                          label="TOOL DIA (A)"
                          type="number"
                          name="toolDiaA"
                          value={userData.toolDiaA}
                          onChange={handleInputChange}
                          variant="outlined"
                          margin="small"
                          size="small"
                          InputProps={{
                            inputProps: { min: 0 }
                          }}
                        />

                        <TextField
                          label="DETAILING LEVEL"
                          type="number"
                          name="detailingLevel"
                          value={userData.detailingLevel}
                          onChange={handleInputChange}
                          variant="outlined"
                          margin="small"
                          size="small"
                          InputProps={{
                            inputProps: { min: 0 }
                          }}
                        />

                      <TextField
                        label="PRINT / CHROME"
                        type="number"
                        name="printPerCr"
                        value={userData.printPerCr}
                        onChange={handleInputChange}
                        variant="outlined"
                        margin="small"
                        size="small"
                        InputProps={{
                          inputProps: { min: 0 }
                        }}
                      />
                      <div>
                        {predictedValue !== null && predictedValue !== undefined ? (
                        <div className='d-flex gap-3'>
                          <p>Stock Optimize: {predictedValue[0]}</p>
                          <p>Milling Optimize: {predictedValue[1]}</p>
                          {/* <p>Please verify prediction</p> */}
                        </div>
                        ) : (
                        <p>N/A</p>
                      )}
                      </div>

                      <div className='d-flex gap-3 justify-content-between'>
                        <div>
                        {predictedDia !== null && predictedDia !== undefined ? (
                          <div>
                            <p>Tool Dia (A): {predictedDia}</p>
                          </div>
                        ) : (
                          <p>N/A</p>
                        )}
                        </div>

                        <div>
                        {totalPriceAddition !== null && totalPriceAddition !== undefined ? (
                          <div>
                            <p>Parts Added Total: {Math.round(totalPriceAddition)}</p>
                          </div>
                        ) : (
                          <p>N/A</p>
                        )}
                        </div>
                      </div>
                  </div>
                </div>

              </div>
            </div>

            <div className='d-flex p-3 gap-3'>
              <TextField
                label="Parts Added TOTAL"
                type="number"
                name="partsAddedTotal"
                value={userData.partsAddedTotal}
                onChange={handleInputChange}
                variant="outlined"
                margin="small"
                size="small"
                InputProps={{
                  inputProps: { min: 0 }
                }}
              />

              <TextField
                label="PACKAGE"
                type="number"
                name="package"
                value={userData.package}
                onChange={handleInputChange}
                variant="outlined"
                margin="small"
                size="small"
                InputProps={{
                  inputProps: { min: 0 }
                }}
              />

              <TextField
                label="FREIGHT"
                type="number"
                name="freight"
                value={userData.freight}
                onChange={handleInputChange}
                variant="outlined"
                margin="small"
                size="small"
                InputProps={{
                  inputProps: { min: 0 }
                }}
              />
            </div>

          </div>

          <div style={{width:"50%"}}>
            <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
                  <AgGridReact columnDefs={columnDefs} rowData={csvData} onGridReady={onGridReady} onSelectionChanged={onSelectionChanged} rowSelection="multiple" suppressRowClickSelection= "true"/>
            </div>
          </div>
          
        </div>

      </Container>
 
    </div>
  );
};

export default CostEstimation;