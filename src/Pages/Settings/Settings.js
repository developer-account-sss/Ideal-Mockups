import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container } from 'react-bootstrap';
import DownloadDB from './DownloadDB';
import config from '../../config';

const EntryForm = () => {
    const [formData, setFormData] = useState({
        factor_eps: '',
         factor_abrasive: '',
         factor_paint: '',
         factor_printcr: '',
         factor_electronics: '',
         factor_cnccost: '',
         factor_fabfinishcost: '',
         factor_printing: ''
     });
     const [data, setData] = useState(null);
 
     useEffect(() => {
         const fetchData = async () => {
             try {
                 const token = localStorage.getItem('token');
                 const response = await axios.get(`${config.baseURL}/price_factor`,{
                    headers: {
                        'Authorization': `Bearer ${token}`
                      }
                 });
                 setData(response.data);
                 setFormData(prevData => ({
                     ...prevData,
                     ...response.data
                 }));
             } catch (error) {
                 console.error('Error fetching data:', error);
             }
         };
 
         fetchData();
     }, []);
 
     const handleInputChange = (event) => {
         const { name, value } = event.target;
         setFormData({ ...formData, [name]: value });
     };
 
     const handleSubmit = async () => {
         try {
             const token = localStorage.getItem('token');
             await axios.post(`${config.baseURL}/save_entry`,{
                headers: {
                    'Authorization': `Bearer ${token}`
                  }
             }, formData);
             alert('Entry saved successfully');
             setData(formData);
         } catch (error) {
             console.error('Error saving entry:', error);
             alert('Error saving entry');
         }
     };
 
    

    return (
        <Container className='pt-5'>
        <div>
            <div className='d-flex pb-5 justify-content-between'>
                <div style={{maxWidth:"10cm"}}>
                    <h4>Material Prices Settings</h4>
                    <div className='d-flex gap-3 flex-column'>
                        <div className='d-flex justify-content-between'>
                            <div>
                                Material
                            </div>
                            <div style={{paddingLeft:"5cm"}}>
                                Price Factor
                            </div>
                        </div>
                        <div className='d-flex justify-content-between'>
                            <div>
                                As per weight
                            </div>
                            <div>
                            <input
                                type="number"
                                name="factor_eps"
                                value={formData.factor_eps}
                                onChange={handleInputChange}
                                placeholder={data && data.factor_eps}
                            />
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{maxWidth:"10cm"}}>
                    <h4>CMF</h4>
                        <div className='d-flex gap-3 flex-column'>
                            <div className='d-flex justify-content-between'>
                                <div>
                                    Material
                                </div>
                                <div style={{paddingLeft:"5cm"}}>
                                    Price Factor
                                </div>
                            </div>
                            <div className='d-flex justify-content-between'>
                                <div>
                                    Abrasives
                                </div>
                                <div>
                                <input
                                    type="number"
                                    name="factor_abrasive"
                                    value={formData.factor_abrasive}
                                    onChange={handleInputChange}
                                    placeholder={data && data.factor_abrasive}
                                />
                                </div>
                            </div>
                            <div className='d-flex justify-content-between'>
                                <div>
                                    Paint
                                </div>
                                <div>
                                    <input
                                        type="number"
                                        name="factor_paint"
                                        value={formData.factor_paint}
                                        onChange={handleInputChange}
                                        placeholder={data && data.factor_paint}
                                    />
                                </div>
                            </div>
                            <div className='d-flex justify-content-between'>
                                <div>
                                    Print/Chrome
                                </div>
                                <div>
                                    <input
                                        type="number"
                                        name="factor_printcr"
                                        value={formData.factor_printcr}
                                        onChange={handleInputChange}
                                        placeholder={data && data.factor_printcr}
                                    />
                                </div>
                            </div>
                            <div className='d-flex justify-content-between'>
                                <div>
                                    Electro/Mech
                                </div>
                                <div>
                                    <input
                                        type="number"
                                        name="factor_electronics"
                                        value={formData.factor_electronics}
                                        onChange={handleInputChange}
                                        placeholder={data && data.factor_electronics}
                                    />
                                </div>
                            </div>
                        </div>
                </div>
            </div>

            <div className='d-flex justify-content-between'>
                <div style={{maxWidth:"10cm"}}>
                    <h4>Hourly Rate Settings</h4>   
                        <div className='d-flex gap-3 flex-column'>
                            <div className='d-flex justify-content-between'>
                                <div>
                                    Activity
                                </div>
                                <div style={{paddingLeft:"5cm"}}>
                                    Price Factor
                                </div>
                            </div>
                            <div className='d-flex justify-content-between'>
                                <div>
                                    CAD/CAM/CNC
                                </div>
                                <div>
                                    <input
                                        type="number"
                                        name="factor_cnccost"
                                        value={formData.factor_cnccost}
                                        onChange={handleInputChange}
                                        placeholder={data && data.factor_cnccost}
                                    />
                                </div>
                            </div>
                            <div className='d-flex justify-content-between'>
                                <div>
                                    FAB/FINISH
                                </div>
                                <div>
                                    <input
                                        type="number"
                                        name="factor_fabfinishcost"
                                        value={formData.factor_fabfinishcost}
                                        onChange={handleInputChange}
                                        placeholder={data && data.factor_fabfinishcost}
                                    />
                                </div>
                            </div>
                            <div className='d-flex justify-content-between'>
                                <div>
                                    Painting
                                </div>
                                <div>
                                    <input
                                        type="number"
                                        name="factor_printing"
                                        value={formData.factor_printing}
                                        onChange={handleInputChange}
                                        placeholder={data && data.factor_printing}
                                    />
                                </div>
                            </div>
                        </div>
                </div>
                <div style={{maxWidth:"10cm"}}>
                    <div>
                        <h4>Currently set values </h4>
                        <li>EPS: {data && data.factor_eps}</li>
                        <li>Abrasive: {data && data.factor_abrasive}</li>
                        <li>Paint: {data && data.factor_paint}</li>
                        <li>Printcr: {data && data.factor_printcr}</li>
                        <li>Electronics: {data && data.factor_electronics}</li>
                        <li>CNC Cost: {data && data.factor_cnccost}</li>
                        <li>Fab Finish Cost: {data && data.factor_fabfinishcost}</li>
                        <li>Printing: {data && data.factor_printing}</li>
                    </div>
                </div>
            </div>
        </div>
        <div className='d-flex justify-content-between p-5'>
            <button onClick={handleSubmit}>Save Price Factor</button>
            <DownloadDB />
        </div>
        
        </Container>
    );
};

export default EntryForm;
