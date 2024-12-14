import React, { useState, useEffect } from 'react';
import { Container, Button} from 'react-bootstrap';
import TextField from '@mui/material/TextField';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import axios from 'axios';
// import * as XLSX from 'xlsx';
import * as XLSX from "xlsx-js-style";
import config from '../../config';

const ValveTrim = () => {
  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [quickFilterText, setQuickFilterText] = useState('');


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    const token = localStorage.getItem('token');
    axios.get(`${config.baseURL}/api/yourData`,{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => setRowData(response.data))
      .catch(error => console.error(error));
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  const exportToExcel = () => {
    // Check if gridApi is defined before using it
    if (gridApi) {
      const selectedNodes = gridApi.getSelectedNodes();
  
      // Check if columnDefs is defined before using it
      if (columnDefs) {
        // Proceed with exporting
        const ws = XLSX.utils.json_to_sheet(
          selectedNodes
            .filter(node => node.data) // Filter out rows with no data
            .map(node => {
              return columnDefs.slice(1).reduce((acc, colDef) => { // Exclude the first column
                const headerName = colDef.headerName || colDef.field;
                if (node.data.hasOwnProperty(colDef.field)) {
                  acc[headerName] = node.data[colDef.field];
                }
                return acc;
              }, {});
            })
        );
  
        // Set header color and width (using a separate helper function)
        setHeaderFormatting(ws, {
          headerColor: 'ffcc00', // Light gray (example)
          headerWidth: 20, // Adjust as needed
        });
  
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'SelectedRows');
        XLSX.writeFile(wb, 'Client_brief.xlsx');
      } else {
        console.error('columnDefs is undefined');
      }
    } else {
      console.error('gridApi is undefined');
    }
  };
  
  
  

  function setHeaderFormatting(worksheet, options) {
    const { headerColor, headerWidth } = options;
  
    console.log('headerColor:', headerColor);
    console.log('headerWidth:', headerWidth);
  
    // Get the first row as the header row (assuming headers are in the first row)
    const headerRow = worksheet['!ref'].split('!')[0]; // Extract row number (e.g., 'A1:Z1')
    const headerRange = XLSX.utils.decode_range(headerRow);
  
    console.log('headerRange:', headerRange);
  
    // Set header cell formatting with individual overrides for column B
    for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ c: col, r: headerRange.s.r }); // Create cell address (e.g., 'A1')
      worksheet[cellAddress] = worksheet[cellAddress] || {}; // Ensure cell object exists
      const isColumnB = col === headerRange.s.c + 1; // Check if current column is B (index 1)
      const isColumnL = col === headerRange.s.c + 11; 
      const isColumnM = col === headerRange.s.c + 12; 
      const isColumnN = col === headerRange.s.c + 13; 
      const isColumnO = col === headerRange.s.c + 14; 
      const isColumnP = col === headerRange.s.c + 15; 
      const isColumnQ = col === headerRange.s.c + 16; 
      const isColumnR = col === headerRange.s.c + 17; 
      const isColumnS = col === headerRange.s.c + 18; 
      const isColumnT = col === headerRange.s.c + 19; 
      const isColumnV = col === headerRange.s.c + 21; 
      const isColumnX = col === headerRange.s.c + 23; 
      
      worksheet[cellAddress].s = { // Set cell style
        fill: { 
          // fgColor: { rgb: isColumnB ? 'FF0000' : isColumnD ? 'DB7093' : isColumnF ? 'FFA07A' : headerColor }, 
          fgColor: { rgb: isColumnL || isColumnM || isColumnN || isColumnO || isColumnP || isColumnQ ? '92d050' 
            : isColumnR || isColumnT || isColumnV || isColumnX ? 'ff99ff' : isColumnS ? 'f8cbad' : headerColor }, 
        },
        alignment: {
          horizontal: 'center'
        },
        border:{
          left:
          {style: 'thin',
          color: {
            rgb: 
              '000000'
          }},
          right:
          {style: 'thin',
          color: {
            rgb: 
              '000000'
          }},
          top:
          {style: 'thin',
          color: {
            rgb: 
              '000000'
          }},
          bottom:
          {style: 'thin',
          color: {
            rgb: 
              '000000'
          }},
        }  
      };
      console.log('Cell style for', cellAddress, ':', worksheet[cellAddress].s); // Log the generated style
    }
  
    // Set header column widths
    
    worksheet['!cols'] = worksheet['!cols'] || [];
    for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
      worksheet['!cols'][col] = { // Set column width
        wch: 25 // Set width in characters (adjust as needed) || replace "headerWidth" with number
      };
    }

    const headerRowHeight = 30; // Adjust as needed
    worksheet['!rows'] = worksheet['!rows'] || [];
    worksheet['!rows'][headerRange.s.r] = { // Set height for header row
      hpt: headerRowHeight // Set height in twips (1 twip = 1/20th of a point)
    };
  }
  
  
  

  const onQuickFilterTextChange = (e) => {
    setQuickFilterText(e.target.value);
    if (gridApi) {
      gridApi.setQuickFilter(e.target.value);
    }
  };
  

  // { headerName: 'PLT NO', field: 'pltNO', rowGroup: true, hide: false },


  const columnDefs = [
    { checkboxSelection: true, headerCheckboxSelection: false},

    { headerName: 'ESTIMATE NO', field: 'pltNO', rowGroup: true, hide: false},
    { headerName: 'PART NO', field: 'partNo', sortable: true, sort: "asc", sortIndex: 0 },
    // { headerName: 'MOCKUP TITLE', field: 'commonDesc', rowGroup: true, hide: false},
    { headerName: 'DESCRIPTION', field: 'description' },

    { headerName: 'COLOR', field: 'color' },
    // { headerName: 'FINISH', field: 'finish' },
    // { headerName: 'PRINT/CR', field: 'printCr' },
  
    { headerName: 'LENGTH', field: 'length' },
    { headerName: 'WIDTH', field: 'width' },
    { headerName: 'HEIGHT', field: 'height' },
  

    { headerName: 'BLOCK WT', field: 'BlockWt' },
  
    { headerName: 'PLASTIC/EPS/METAL', field: 'eps' },
    { headerName: 'ABRASIVE/PASTE', field: 'abrasiveRes' },
    { headerName: 'PAINT', field: 'Paint' },
    { headerName: 'PRINT / CR', field: 'printPerCr' },
    { headerName: 'ELECTRONICSS', field: 'Electronics' },
    { headerName: 'TOTAL MATERIAL', field: 'TotalMaterial' },

    { headerName: 'CAD/CAM/CNC (Hrs)', field: 'CAD_time' },
   
    { headerName: 'FABRICATION & FINISH (Hrs)', field: 'FabInHrs' },
   
    { headerName: 'PAINTING (Hrs)', field: 'Painting_Hrs' },
 
    { headerName: 'SUB TOTAL', field: 'subTotal' },
 
    { headerName: 'PACKAGING & FORWARDING', field: 'packaging' },
    { headerName: 'BASE PRICE', field: 'basePrice' },

    { headerName: 'QTY', field: 'qty' },

    { headerName: 'TOTAL', field: 'total' },

  ];

  return (
    <Container >
      <div className='d-flex pt-5'>
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

      <div className="ag-theme-alpine pb-2" style={{ height: '600px', width: '100%' }}>
        <AgGridReact 
         columnDefs={columnDefs} rowData={rowData} onGridReady={onGridReady}  
         rowSelection="multiple"
         groupSelectsChildren={true}
         suppressRowClickSelection={true}
         suppressAggFuncInHeader={true}
         />
      </div>
        <Button className='float-end' onClick={exportToExcel}>Export Selected Rows to Excel</Button>
    </Container>
  );
};

export default ValveTrim;