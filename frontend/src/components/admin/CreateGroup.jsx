import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import { url, setHeaders } from "../../slices/api";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { PrimaryButton } from "./CommonStyled";
import { createGroup } from "../../slices/productsSlice";

export default function CreateGroup({ prodId }) {
    const [open, setOpen] = React.useState(false);
    const dispatch = useDispatch();
    const { creategroupStatus } = useSelector((state) => state.products);
    const [groupID, setgroupID] = useState("");
    const [groupname, setgroupname] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(
            createGroup({
                _id: prodId,
                Groupid: groupID,
                name: groupname,
            })
        );
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Edit onClick={handleClickOpen}>Create Group</Edit>
            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth={true}
                maxWidth={"md"}
            >
                <DialogTitle>Create Group</DialogTitle>
                <DialogContent>
                    <StyledEditProduct>
                        <StyledForm onSubmit={handleSubmit}>
                            <h3>Create Group</h3>
                            <input
                                type="number"
                                placeholder="Group ID"
                                onChange={(e) => setgroupID(e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Group Name"
                                onChange={(e) => setgroupname(e.target.value)}
                                required
                            />
                            <PrimaryButton type="submit">
                                {creategroupStatus === "pending" ? "Submitting" : "Submit"}
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
