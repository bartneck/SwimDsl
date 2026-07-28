import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";


interface NewProgrammeModalProps {
  handleSelectFile: (newKey: string) =>  void;
  newProgrammeOpen: boolean;
  setNewProgrammeOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  flexDirection: "column",
  display: "flex",
};

export default function NewProgrammeModal({
  handleSelectFile,
  newProgrammeOpen,
  setNewProgrammeOpen,
  }:NewProgrammeModalProps)
{

  const [error, setError] = React.useState("");
  const [newProgrammeName, setNewProgrammeName] = React.useState("")

  function handleClose() {
    setError("");
    setNewProgrammeOpen(false);
  }

  function handleSubmit(){
    if (newProgrammeName.trim().length === 0) {
      setError("Please enter a programme name.");
    }
    else if (newProgrammeName in localStorage) {
      setError("Programme name already in use. Please choose another name.");
    }
    else {
      localStorage.setItem(newProgrammeName, "");
      handleSelectFile(newProgrammeName);
      handleClose();
    }
  }


  return (
    <>
      <Modal
        open={newProgrammeOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
            <Typography variant="h6" component="div">
              New Programme:
            </Typography>
            <TextField id="outlined-basic" label="Programme name" variant="outlined" error={error.length > 0} helperText={error} onChange={(e) => {
              setNewProgrammeName(e.target.value)
            }}/>
            <Button onClick={() => {
              handleSubmit()
            }}>Create</Button>
        </Box>
      </Modal>
    </>
  )
}
