import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import userService from "../services/user.service";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import SaveIcon from "@mui/icons-material/Save";

const AddDeposit = () => {
  const [depositAccount, setDepositAccount] = useState("");
  const { id } = useParams();
  const [titleuserForm, setTitleuserForm] = useState("");
  const navigate = useNavigate();

  const saveuser = (e) => {
    e.preventDefault();
    console.log("id", id);

    if (id) {
      // Crea el objeto con el cuerpo de la solicitud
      const formData = new FormData();
        formData.append("userId", id);
        formData.append("depositAccount", depositAccount);
      userService
        .deposit(formData) // Envía el id y el objeto requestBody
        .then((response) => {
          console.log("El dinero ha sido depositado.", response.data);
          navigate("/user/list");
        })
        .catch((error) => {
          console.log(
            "Ha ocurrido un error al intentar depositar dinero.",
            error
          );
        });
    }
  };

  useEffect(() => {
    if (id) {
      setTitleuserForm("Depositar dinero");
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
            id="depositAccount"
            label="DepositAccount"
            value={depositAccount}
            variant="standard"
            onChange={(e) => setDepositAccount(e.target.value)}
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

export default AddDeposit;


