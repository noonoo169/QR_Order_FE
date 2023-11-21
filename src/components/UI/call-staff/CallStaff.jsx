import { Button } from '@mui/material';
import React, {useState} from 'react'

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
const CallStaff = (props) => {
  const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };
    const handleCallStaff = (e) => {
        e.stopPropagation()
        handleOpen()
        // TODO a request call-staff api here
        console.log("called");
    };
    return (
        <>
            <Button className="btn d-flex mx-auto" variant="outlined" color="success" onClick={handleCallStaff}>
                Call staff
            </Button>
            <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    Staff is comming
                </Alert>
            </Snackbar>
        </>
    )
}

export default CallStaff