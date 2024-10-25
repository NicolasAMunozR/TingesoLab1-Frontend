import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import userService from "../services/user.service";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import SaveIcon from "@mui/icons-material/Save";

const AddWithdra = () => {
  const [withdrawalAccount, setWithdrawalAccount] = useState("");
  const { id } = useParams();
  const [titleuserForm, setTitleuserForm] = useState("");
  const navigate = useNavigate();

  const saveuser = (e) => {
    e.preventDefault();

    const formData = new FormData();
    console.log("id", id);

    if (id) {
        formData.append("userId", id);
        formData.append("withdrawalAccount", withdrawalAccount);
        userService
            .withdraw(formData)
            .then((response) => {
            console.log("El dinero ha sido retirado.", response.data);
            navigate("/user/list");
            })
            .catch((error) => {
            console.log(
            "Ha ocurrido un error al intentar retirar dinero.",
            error
          );
        });
    } 
  };

  useEffect(() => {
    if (id) {
      setTitleuserForm("Retirar dinero");
    }
  }, [id]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      component="form"
    >
      <h3> {titleuserForm} </h3>
      <hr />
      <form> 
        <FormControl fullWidth>
          <TextField
            id="withdrawalAccount"
            label="WithdrawalAccount"
            value={withdrawalAccount}
            variant="standard"
            onChange={(e) => setWithdrawalAccount(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <br />
          <Button
            variant="contained"
            color="info"
            type="submit" // Cambiado a type="submit"
            onClick={(e) => saveuser(e)}
            style={{ marginLeft: "0.5rem" }}
            startIcon={<SaveIcon />}
          >
            Guardar
          </Button>
        </FormControl>
      </form>
      <hr />
      <Link to="/user/list">Back to List</Link> 
    </Box>
  );
};

export default AddWithdra;
