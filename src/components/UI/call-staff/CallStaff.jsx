import { Button } from '@mui/material';
import React, { useState } from 'react'

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import axios from "axios"

const CallStaff = (props) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('Staff is comming')
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleCallStaff = (e) => {
        e.stopPropagation()
        if(!buttonDisabled) {
            setButtonDisabled(true);
            handleOpen()
            callStaff()
            setTimeout(() => {
                setButtonDisabled(false);
            }, 60000); 
        }
    };
    const callStaff = async () => {
        try {
            const responseCategory = await axios.get(
              
              `${process.env.REACT_APP_BE_URL}/api/call-staff/${localStorage.getItem('table_id')}`
            );

            if (responseCategory.status >= 200 && responseCategory.status < 300) {
                setMessage("Staff is comming")
            } else {
                setMessage("Cannot call staff now")
            }
        } catch (err) {
            setMessage("Cannot call staff now")
        }
    };
    return (
        <>
            <Button className="btn d-flex mx-auto" variant="outlined" color="success" onClick={handleCallStaff}>
                Call staff
            </Button>
            <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </>
    )
}

export default CallStaff