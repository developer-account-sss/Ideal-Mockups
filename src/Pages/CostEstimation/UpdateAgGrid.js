import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import config from '../../config';
import EditIcon from '@mui/icons-material/Edit';

const UpdateAgGrid = ({ showButton1 = true, showButton2 = true, showButton3 = true }) => {
    const [openDialog1, setOpenDialog1] = useState(false);
    const [openDialog2, setOpenDialog2] = useState(false);
    const [openDialog3, setOpenDialog3] = useState(false);

    // States for Dialog 1
    const [uCommonDesc, setUCommonDesc] = useState('');
    const [newCommonDesc, setNewCommonDesc] = useState('');

    // States for Dialog 2
    const [uMockupNo, setUMockupNo] = useState('');
    const [newMockupNo, setNewMockupNo] = useState('');

    // States for Dialog 3
    const [uPltNO, setUPltNO] = useState('');
    const [newPltNO, setNewPltNO] = useState('');

    // Handlers for Dialog 1
    const handleClickOpenDialog1 = () => {
        setOpenDialog1(true);
    };

    const handleCloseDialog1 = () => {
        setOpenDialog1(false);
    };

    const handleSubmitDialog1 = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${config.baseURL}/update_values`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    commonDesc: uCommonDesc,
                    new_commonDesc: newCommonDesc,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }

            const result = await response.json();
            console.log('Success:', result);
            handleCloseDialog1();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Handlers for Dialog 2
    const handleClickOpenDialog2 = () => {
        setOpenDialog2(true);
    };

    const handleCloseDialog2 = () => {
        setOpenDialog2(false);
    };

    const handleSubmitDialog2 = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${config.baseURL}/update_values`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    mockupNo: uMockupNo,
                    new_mockupNo: newMockupNo,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }

            const result = await response.json();
            console.log('Success:', result);
            handleCloseDialog2();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Handlers for Dialog 3
    const handleClickOpenDialog3 = () => {
        setOpenDialog3(true);
    };

    const handleCloseDialog3 = () => {
        setOpenDialog3(false);
    };

    const handleSubmitDialog3 = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${config.baseURL}/update_values`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    pltNO: uPltNO,
                    new_pltNO: newPltNO,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }

            const result = await response.json();
            console.log('Success:', result);
            handleCloseDialog3();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            {showButton1 && (
                <Button variant="contained" color="primary" onClick={handleClickOpenDialog1}>
                    <EditIcon />
                </Button>
            )}
            {showButton2 && (
                <Button variant="contained" color="primary" onClick={handleClickOpenDialog2}>
                    <EditIcon />
                </Button>
            )}
            {showButton3 && (
                <Button variant="contained" color="primary" onClick={handleClickOpenDialog3}>
                    <EditIcon />
                </Button>
            )}

            {/* Dialog 1 */}
            <Dialog open={openDialog1} onClose={handleCloseDialog1}>
                <DialogTitle>Update Mockup Title</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Mockup Title"
                        fullWidth
                        variant="outlined"
                        value={uCommonDesc}
                        onChange={(e) => setUCommonDesc(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="New Mockup Title"
                        fullWidth
                        variant="outlined"
                        value={newCommonDesc}
                        onChange={(e) => setNewCommonDesc(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSubmitDialog1} color="primary">
                        Submit
                    </Button>
                    <Button onClick={handleCloseDialog1} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog 2 */}
            <Dialog open={openDialog2} onClose={handleCloseDialog2}>
                <DialogTitle>Update Mockup Number</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Mockup Number"
                        fullWidth
                        variant="outlined"
                        value={uMockupNo}
                        onChange={(e) => setUMockupNo(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="New Mockup Number"
                        fullWidth
                        variant="outlined"
                        value={newMockupNo}
                        onChange={(e) => setNewMockupNo(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSubmitDialog2} color="primary">
                        Submit
                    </Button>
                    <Button onClick={handleCloseDialog2} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog 3 */}
            <Dialog open={openDialog3} onClose={handleCloseDialog3}>
                <DialogTitle>Upadate Estimate Number</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Estimate Number"
                        fullWidth
                        variant="outlined"
                        value={uPltNO}
                        onChange={(e) => setUPltNO(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="New Estimate Number"
                        fullWidth
                        variant="outlined"
                        value={newPltNO}
                        onChange={(e) => setNewPltNO(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSubmitDialog3} color="primary">
                        Submit
                    </Button>
                    <Button onClick={handleCloseDialog3} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default UpdateAgGrid;
