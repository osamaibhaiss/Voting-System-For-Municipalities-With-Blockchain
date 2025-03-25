import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { PrimaryButton } from "./CommonStyled";
import { productsEdit } from "../../slices/productsSlice";

export default function EditProduct({ prodId }) {
  const [open, setOpen] = React.useState(false);
  const { items } = useSelector((state) => state.products);

  const dispatch = useDispatch();
  const { editStatus } = useSelector((state) => state.products);
  const [currentProd, setCurrentProd] = useState({});

  const [ElectionDate, setElectionDate] = useState("");
  const [StartTime, setStartTime] = useState("");
  const [EndTime, setEndTime] = useState("");
  const [CityName, setCityName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(
      productsEdit({
        product: {
          ...currentProd,
          ElectionDate: ElectionDate,
          StartTime: StartTime,
          EndTime: EndTime,
          CityName: CityName,
        },
      })
    );
  };

  const handleClickOpen = () => {
    setOpen(true);

    let selectedProd = items.filter((item) => item._id === prodId);

    selectedProd = selectedProd[0];

    setCurrentProd(selectedProd);
    setElectionDate(selectedProd.ElectionDate);
    setStartTime(selectedProd.StartTime);
    setEndTime(selectedProd.EndTime);
    setCityName(selectedProd.CityName);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Edit onClick={handleClickOpen}>Edit</Edit>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={true}
        maxWidth={"md"}
      >
        <DialogTitle>Edit Election</DialogTitle>
        <DialogContent>
          <StyledEditProduct>
            <StyledForm onSubmit={handleSubmit}>
              <h3>Create a Elections</h3>
              <input
                type="number"
                placeholder="Election Date"
                onChange={(e) => setElectionDate(e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Start Date"
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="End Date"
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Election City Name"
                onChange={(e) => setCityName(e.target.value)}
                required
              />

              <PrimaryButton type="submit">
                {editStatus === "pending" ? "Submitting" : "Submit"}
              </PrimaryButton>
            </StyledForm>
          </StyledEditProduct>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const Edit = styled.button`
  border: none;
  outline: none;

  padding: 3px 5px;
  color: white;
  border-radius: 3px;
  cursor: pointer;
  background-color: #4b70e2;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin-top: 2rem;

  select,
  input {
    padding: 7px;
    min-height: 30px;
    outline: none;
    border-radius: 5px;
    border: 1px solid rgb(182, 182, 182);
    margin: 0.3rem 0;

    &:focus {
      border: 2px solid rgb(0, 208, 255);
    }
  }

  select {
    color: rgb(95, 95, 95);
  }
`;

const StyledEditProduct = styled.div`
  display: flex;
  justify-content: space-between;
`;
