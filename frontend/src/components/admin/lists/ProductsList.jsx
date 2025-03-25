import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { productDelete } from "../../../slices/productsSlice";
import EditProduct from "../EditProduct";
import RegisterVotter from "../RegisterVoter";
import CreateGroup from "../CreateGroup";
import { Button } from "@mui/material";
import Winner from "../winner";
import { addToCart } from "../../../slices/cartSlice";
import Pause from "../paused";

export default function ProductsList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.products);

    const handleAddToCart = (gp) => {
      dispatch(addToCart(gp));
    };
  const rows =
    items &&
    items.map((item) => {
      return {
        id: item._id,
        name: item.CityName,
        RegisterVotter: item.RegisterVotter,
        TotalGroup: item.Groups.length,
        electionDate: new Date(item.ElectionDate*1000).toLocaleDateString("en-US"),
      };
    });

  const columns = [
    { field: "id", headerName: "ID", width: 120 },
    {
      field: "name",
      headerName: "City",
      width: 150 },
    { field: "RegisterVotter", headerName: "Reg. Voters", width: 120 },
    { field: "TotalGroup", headerName: "Total Groups", width: 120 },
    {
      field: "electionDate",
      headerName: "Date",
      width: 120,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 370,
      renderCell: (params) => {
        return (
          <Actions>
            <Delete onClick={() => handleDelete(params.row.id)}>Delete</Delete>
            <Winner prodId={params.row.id} />
            <RegisterVotter prodId={params.row.id}/>
            <CreateGroup prodId={params.row.id}/>
            <Pause prodId={params.row.id} />
          </Actions>
        );
      },
    },
  ];

  const handleDelete = (id) => {
    dispatch(productDelete(id));
  };

  return (
    <div style={{ height: 400, width: "100%", marginTop: "2rem" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableSelectionOnClick
      />
    </div>
  );
}

const ImageContainer = styled.div`
  img {
    height: 40px;
  }
`;

const Actions = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;

  button {
    border: none;
    outline: none;

    padding: 3px 5px;
    color: white;
    border-radius: 3px;
    cursor: pointer;
  }
`;

const Edit = styled.button`
  border: none;
  outline: none;

  padding: 3px 5px;
  color: white;
  border-radius: 3px;
  cursor: pointer;
  background-color: #4b70e2;
`;

const Delete = styled.button`
  background-color: rgb(255, 77, 73);
`;
const View = styled.button`
  background-color: rgb(114, 225, 40);
`;

const Register = styled.button`
  background-color: rgb(139, 140, 139);
`;
