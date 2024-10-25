import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import creditService from "../services/credit.service";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import SaveIcon from "@mui/icons-material/Save";

const AddTerms = () => {
  const [lienInsurance, setLienInsurance] = useState("");
  const [administrationFee, setAdministrationFee] = useState("");

  const { id } = useParams();
  const [titleuserForm, setTitleuserForm] = useState("");
  const navigate = useNavigate();

  const saveuser = (e) => {
    e.preventDefault();

    const formData = new FormData();
    console.log("id", id);
    formData.append("userId", id);
    formData.append("lienInsurance", lienInsurance);
    formData.append("administrationFee", administrationFee);
    console.log("FormData:", formData.get("lienInsurance"));
    console.log("FormData:", formData.get("administrationFee"));
    console.log("FormData:", formData.get("userId"));
      if (id) {
        creditService
          .updateTerms(formData)
          .then((response) => {
            console.log("Terminos han sido actualizado.", response.data);
            navigate("/credit/pre");
          })
          .catch((error) => {
            console.log(
              "Ha ocurrido un error al intentar actualizar datos de terminos.",
              error
            );
          });
      } 
  };

  useEffect(() => {
    if (id) {
      setTitleuserForm("Añadir terminos");
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
            id="lienInsurance"
            label="LienInsurance"
            value={lienInsurance}
            variant="standard"
            onChange={(e) => setLienInsurance(e.target.value)}
          />
        </FormControl>

        <FormControl fullWidth>
          <TextField
            id="administrationFee"
            label="AdministrationFee"
            value={administrationFee}
            variant="standard"
            onChange={(e) => setAdministrationFee(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <br />
          <Button
            variant="contained"
            color="info"
            onClick={(e) => saveuser(e)}
            style={{ marginLeft: "0.5rem" }}
            startIcon={<SaveIcon />}
          >
            Guardar
          </Button>
        </FormControl>
      </form>
      <hr />
      <Link to="/credit/list">Back to List</Link> 
    </Box>
  );
};

export default AddTerms;