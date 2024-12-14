import React, { useState } from "react";
import Image from 'react-bootstrap/Image';
import { Container} from 'react-bootstrap';
import { Delete, Edit } from "@mui/icons-material";
import { Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import "../Invoices/Invoice.css"


function Invoice() {

  const [items, setItems] = useState([]);
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [unitPrice, setUnitPrice] = useState(0);
  const [editIndex, setEditIndex] = useState(null);

  const calculateAmount = () => {
    return quantity * unitPrice;
  };

  const addItem = () => {
    const newItem = {
      description,
      quantity,
      unitPrice,
      amount: calculateAmount(),
    };

    if (editIndex !== null) {
      // Edit the existing item if editIndex is set
      items[editIndex] = newItem;
      setEditIndex(null);
    } else {
      setItems([...items, newItem]);
    }

    setDescription("");
    setQuantity(0);
    setUnitPrice(0);
  };

  const editItem = (index) => {
    const itemToEdit = items[index];
    setDescription(itemToEdit.description);
    setQuantity(itemToEdit.quantity);
    setUnitPrice(itemToEdit.unitPrice);
    setEditIndex(index);
  };

  const deleteItem = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.amount, 0);
  };


  return (
    <Container>
    <div style={{display:"flex", justifyContent:"space-between", gap:"1rem"}}>
      <div >
        <div className="pt-5">
          <div style={{display:"flex", gap:"1rem", flexDirection:"row"}}>
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              margin="small"
              size="small"
            />
            <TextField
              label="Quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
              margin="small"
              size="small"
              InputProps={{
                inputProps: { min: 0 }
              }}
            />
            <TextField
              label="Unit Price"
              type="number"
              value={unitPrice}
              onChange={(e) => setUnitPrice(parseFloat(e.target.value))}
              margin="small"
              size="small"
              InputProps={{
                inputProps: { min: 0 }
              }}
            />
            
            <Button variant="contained" color="primary" onClick={addItem}>
              {editIndex !== null ? "Update Item" : "Add Item"}
            </Button>
          </div>
          {/* <div>
              value={calculateTotal()}
          </div> */}
        </div>
      </div>
    </div>



    <Container className="d-flex justify-content-center pt-5">
      
        <div style={{width:"100vh"}}>
          <Image className="p-2" src={require('../../Assets/Invoice-header.jpeg')} fluid/>
          <div>
            <h5 style={{backgroundColor:"skyblue"}}>TAX INVOICE</h5>
          </div>
          <div className="horizontal-hr">
            <p className="ps-5 pe-5 pb-2 p-txt">Regd. Office:C/o Prashant Hanskar, Plot No. 93A Chhatrapati Nagar, Wardha Road, Nagpur-15. 
            Work Office:"Ideal Mockups Pvt. Ltd", Advait Complex, Plot No-3, Meshram Layout, Swawlambi Nagar, Nagpur – 22  </p>
          </div>
          <div>
            <div className="horizontal-hr" style={{display:"flex", justifyContent:"space-between"}}>
              <div style={{height:"2cm"}}>
                <p className="text-start fw-bold p-txt">Delivery Address:</p>
                <hr/>
                <div>
                  <p className="p-txt" style={{textAlign:"left"}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                </div>
                    
              </div>
              <div className="vertical-hr">
              <div style={{display:"flex", justifyContent:"space-between", gap:"1rem"}}>
                <div>
                  <p className="text-start fw-bold p-txt">Invoice No:</p>
                  <p className="p-txt">bind</p>
                </div>
                <div>
                  <p className="text-start fw-bold p-txt">Date:</p>
                  <p className="p-txt">bind</p>
                </div>
              </div>
              <hr/>
              <div style={{display:"flex", justifyContent:"space-between", gap:"1rem", height:"2cm"}}>
                <div>
                  <div>
                    <p className="text-start fw-bold p-txt">Mode of Dispatch: </p>
                  </div>
                </div>
                <div>
                  <p className="text-start p-txt">bind</p>
                </div>    
              </div>
              <div style={{display:"flex", justifyContent:"space-between", gap:"1rem"}}>
                <div>
                  <p className="text-start fw-bold p-txt">L.R./R.R. No.:</p>
                </div>
                <div>
                  <p className="text-start p-txt">bind</p>
                </div>
              </div>
              </div>
            </div>
          </div>
          {/* *_*  *_*  *_* */}
          <div>
            <div style={{display:"flex", justifyContent:"space-between"}}>
              <div style={{height:"3cm", maxWidth:"60%"}}>
                <p className="text-start fw-bold p-txt">Billing Address:</p>
                <hr/>
                <div>
                  <p className="p-txt">bind</p>
                </div>
                    
              </div>
              <div>
              <div style={{display:"flex", justifyContent:"space-between", gap:"1rem"}}>
                <div>
                  <p className="text-start fw-bold p-txt">P.O. No.:</p>
                </div>
                <div>
                  <p className="text-start p-txt">bind</p>
                </div>
              </div>
              <div style={{display:"flex", justifyContent:"space-between", gap:"1rem"}}>
                <div>
                  <p className="text-start fw-bold p-txt">Date:</p>
                </div>
                <div>
                  <p className="text-start p-txt">bind</p>
                </div>
              </div>
              <hr/>
              <div>
                <p className="text-start fw-bold p-txt">Remarks:</p>
                <div style={{height:"2cm"}}>
                  <p className="text-start p-txt">bind</p>
                </div>
              </div>
              </div>
            </div>
          </div>

          <TableContainer component={Paper}>
          <Table>
            <TableHead className="table-head">
              <TableRow>
                <TableCell className="p-0">Description</TableCell>
                <TableCell className="p-0">Quantity</TableCell>
                <TableCell className="p-0">Unit Price</TableCell>
                <TableCell className="p-0">Amount</TableCell>
                <TableCell className="p-0">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="p-0">{item.description}</TableCell>
                  <TableCell className="p-0">{item.quantity}</TableCell>
                  <TableCell className="p-0">{item.unitPrice}</TableCell>
                  <TableCell className="p-0">{item.amount}</TableCell>
                  <TableCell className="p-0 action-cell">
                    <button className="action-btn" onClick={() => editItem(index)}>
                      {<Edit />}
                    </button>
                    <button className="action-btn" onClick={() => deleteItem(index)}>
                      {<Delete />}
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div>
          <div className="pt-4" style={{display:"flex", justifyContent:"space-between"}}>
            <p className="text-start fw-bold">Total</p>
            <p className="text-start pe-5">{calculateTotal()}</p>
          </div>
        </div>
      </div> 
      </Container>


    </Container>
  );
}

export default Invoice;



