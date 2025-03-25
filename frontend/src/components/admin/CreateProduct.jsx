import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { PrimaryButton } from "./CommonStyled";
import { productsCreate } from "../../slices/productsSlice";

const CreateProduct = () => {
  const dispatch = useDispatch();
  const { createStatus } = useSelector((state) => state.products);
  const [ElectionDate, setElectionDate] = useState("");
  const [StartTime, setStartTime] = useState("");
  const [EndTime, setEndTime] = useState("");
  const [CityName, setCityName] = useState("");

  console.log("ElectionDate", ElectionDate)
  console.log("StartTime", StartTime)
  console.log("EndTime", EndTime)

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(
      productsCreate({
        ElectionDate,
        StartTime,
        EndTime,
        CityName,
      })
    );
  };
  
  return (
    <StyledCreateProduct>
      <StyledForm onSubmit={handleSubmit}>
        <h3>Create a Election</h3>
        <label>Election Date</label>
        <input
          type="date"
          placeholder="Election Date"
          onChange={(e) => 
            setElectionDate(Math.floor((new Date(e.target.value)).getTime() / 1000))
          }
          required
        />
        <label>Start Date</label>
        <input
          type="date"
          placeholder="Start Date"
          onChange={(e) => setStartTime(Math.floor((new Date(e.target.value)).getTime() / 1000))}
          required
        />
        <label>End Date</label>
          <input
          type="date"
          placeholder="End Date"
          onChange={(e) => setEndTime(Math.floor((new Date(e.target.value)).getTime() / 1000))}
          required
        />
        <input
          type="text"
          placeholder="Election City Name"
          onChange={(e) => setCityName(e.target.value)}
          required
        />

        <PrimaryButton type="submit">
          {createStatus === "pending" ? "Submitting" : "Submit"}
        </PrimaryButton>
      </StyledForm>
    </StyledCreateProduct>
  );
};

export default CreateProduct;

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

const StyledCreateProduct = styled.div`
  display: flex;
  justify-content: space-between;
`;
