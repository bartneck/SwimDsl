import React from "react";
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
// import {TextField} from "@mui/material";
// import {modifyProgram} from "../logic/programmeModification.ts";


export default function ModificationDialog() {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => { setOpen(true); };
  const handleClose = () => { setOpen(false); };

  // const handleSubmit = () => {
  //   const modifiedProgramme = modifyProgram(swimdslProgramme);
  //   setSwimdslProgramme(modifiedProgramme);
  // }

  return (
    <>
      {/* The trigger button is kept inside the component */}
      <Button color="inherit" onClick={handleOpen}>
        Modify Programme
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Modification Details</DialogTitle>
        <DialogContent>
          {/*<form onSubmit={handleSubmit} id="modification-form">*/}
          {/*  <TextField*/}
          {/*    autoFocus*/}
          {/*    required*/}
          {/*    margin="dense"*/}
          {/*    id="name"*/}
          {/*    name="email"*/}
          {/*    label="Email Address"*/}
          {/*    type="email"*/}
          {/*    fullWidth*/}
          {/*    variant="standard"*/}
          {/*  />*/}
          {/*</form>*/}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" form="modification-form">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
