import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useParams } from "react-router-dom";
import axios from "axios";
import { url, setHeaders } from "../../slices/api";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { PrimaryButton } from "./CommonStyled";
import { productsEdit } from "../../slices/productsSlice";
import { addToCart } from "../../slices/cartSlice";

export default function Winner({ prodId }) {
    const params = useParams();
    const [open, setOpen] = React.useState(false);
    const dispatch = useDispatch();
    const { creategroupStatus } = useSelector((state) => state.products);
    const cart = useSelector((state) => state.cart);
    const [groupID, setgroupID] = useState("");
    const [groupname, setgroupname] = useState("");
    const [datas, setdatas] = useState({});

    const handleAddToCart = async (gp) => {
        await axios.patch(
            `${url}/elections/win/${prodId}`,
            {
                GroupID: gp,
            }
        );
    };


    React.useEffect(() => {
        async function fetchData() {
            try {
                const token = await axios.get(`${url}/elections/find/${prodId}`, setHeaders());
                setdatas(token.data)
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        // dispatch(
        //     createGroup({
        //         _id: prodId,
        //         Groupid: groupID,
        //         name: groupname,
        //     })
        // );
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Edit onClick={handleClickOpen}>winner</Edit>
            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth={true}
                maxWidth={"md"}
            >
                <DialogTitle>Announced Result</DialogTitle>
                <DialogContent>
                    {/* <StyledEditProduct> */}
                    {/* <StyledForm onSubmit={handleSubmit}>
                            <h3>Voting Result</h3>
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
                        </StyledForm> */}
                    <div className="cart-container">
                        <div className="titles">
                            <h3 className="product-title">Group ID</h3>
                            <h3 className="price">Group Name</h3>
                            <h3 className="price">Total Votes</h3>
                            <h3 className="total">Vote</h3>
                        </div>
                        <div className="cart-items">
                            {datas.Groups &&
                                datas.Groups.map((item) => (
                                    <div className="cart-item" key={item}>
                                        <div className="cart-product">
                                            <h4>{item.GroupId}</h4>
                                            <div>
                                            </div>
                                        </div>
                                        <div className="cart-product-price">{item.Name}</div>
                                        <div className="cart-product-price">{item.TotalVoteCast}</div>
                                        <div className="vote" style={{ justifySelf: "right" }}>
                                            <button className="vote"
                                                onClick={() => handleAddToCart(item.GroupId)}>
                                                Make winner
                                            </button>
                                            {/* <button className="vote">Cast a Vote</button> */}
                                            {/* <VoteCast prodId={cartItem._id} groupid={item.GroupId} /> */}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                    {/* </StyledEditProduct> */}
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



//   const update = async () => {
//     			const response = await axios.patch(
// 			  `${url}/elections/win/${user._id}`,
// 			  {
// 				walletAddress: address,
// 			  }
// 			);

//   }