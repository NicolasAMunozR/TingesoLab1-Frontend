import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import userService from "../services/user.service";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import SaveIcon from "@mui/icons-material/Save";

const SimulationCredit = () => {
  const [amount, setAmount] = useState("");
  const [term, setTerm] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    // Validación de campos vacíos
    if (!amount || !term || !interestRate) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    // Validación de datos (puedes agregar más condiciones según sea necesario)
    if (isNaN(amount) || isNaN(term) || isNaN(interestRate)) {
      setError('Por favor, introduce valores numéricos válidos.');
      return;
    }

    try {
      const response = await userService.simulation({
        amount,
        term,
        interestRate,
      });

      setResult(response.data);
    } catch (err) {
      setError('Error al simular el préstamo.');
    }
  };

  useEffect(() => {
    // Aquí puedes hacer cualquier inicialización que necesites
  }, []);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      component="form"
    >
      <hr />
      <form>
        <FormControl fullWidth>
          <TextField
            id="amount"
            label="Cantidad"
            value={amount}
            variant="standard"
            onChange={(e) => setAmount(e.target.value)}
            error={!!error}
            helperText={error && error}
          />
        </FormControl>

        <FormControl fullWidth>
          <TextField
            id="term"
            label="Plazo"
            value={term}
            variant="standard"
            onChange={(e) => setTerm(e.target.value)}
            error={!!error}
            helperText={error && error}
          />
        </FormControl>

        <FormControl fullWidth>
          <TextField
            id="interestRate"
            label="Tasa de interés"
            value={interestRate}
            variant="standard"
            onChange={(e) => setInterestRate(e.target.value)}
            error={!!error}
            helperText={error && error}
          />
        </FormControl>

        <FormControl>
          <br />
          <Button
            variant="contained"
            color="info"
            onClick={(e) => handleSubmit(e)}
            style={{ marginLeft: "0.5rem" }}
            startIcon={<SaveIcon />}
          >
            Grabar
          </Button>
        </FormControl>

        {result !== null && (
          <div className="alert alert-success mt-3">
            Cantidad de cuotas: {term * 12}
            <br />
            Cuota mensual del préstamo: {result}
            <br />
            No se incluye ni seguro gravamen, ni la comisión de administración
          </div>
        )}
      </form>
      <hr />
      <Link to="/home">Volver a la lista</Link>
    </Box>
  );
};

export default SimulationCredit;
