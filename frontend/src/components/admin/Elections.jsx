import { Outlet, useNavigate } from "react-router-dom";
import { AdminHeaders, PrimaryButton } from "./CommonStyled";

const Elections = () => {
  const navigate = useNavigate();

  return (
    <>
      <AdminHeaders>
        <h2>Elections</h2>
        <PrimaryButton
          onClick={() => navigate("/admin/elections/create-product")}
        >
          Create
        </PrimaryButton>
      </AdminHeaders>
      <Outlet />
    </>
  );
};

export default Elections;
