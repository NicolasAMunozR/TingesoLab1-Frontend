import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import user from "../services/user.service";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const UserList = () => {
  const [User, setUser] = useState([]);

  const navigate = useNavigate();

  const init = () => {
    user
      .getAll()
      .then((response) => {
        console.log("Mostrando listado de todos los usuarios.", response.data);
        setUser(response.data);
      })
      .catch((error) => {
        console.log(
          "Se ha producido un error al intentar mostrar listado de todos los usuarios.",
          error
        );
      });
  };

  useEffect(() => {
    init();
  }, []);

  const handleDelete = (id) => {
    console.log("Printing id", id);
    const confirmDelete = window.confirm(
      "¿Esta seguro que desea borrar este empleado?"
    );
    if (confirmDelete) {
      user
        .remove(id)
        .then((response) => {
          console.log("empleado ha sido eliminado.", response.data);
          init();
        })
        .catch((error) => {
          console.log(
            "Se ha producido un error al intentar eliminar al empleado",
            error
          );
        });
    }
  };

  const handleDeposit = (id) => {
    navigate(`/user/deposit/${id}`);
  };

  const handleWithdrawal = (id) => {
    navigate(`/user/withdraw/${id}`);
  };

  return (
    <TableContainer component={Paper}>
      <br />
      <Link
        to="/user/add"
        style={{ textDecoration: "none", marginBottom: "1rem" }}
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={<PersonAddIcon />}
        >
          Añadir Empleado
        </Button>
      </Link>
      <br /> <br />
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Rut
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Nombre
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Correo
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Saldo
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Operaciones
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {User.map((user) => (
            <TableRow
              key={user.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="left">{user.identifyingDocument}</TableCell>
              <TableCell align="left">{user.name}</TableCell>
              <TableCell align="left">{user.email}</TableCell>
              <TableCell align="left">{user.currentSavingsBalance}</TableCell>

              <TableCell>

                <Button
                  variant="contained"
                  color="info"
                  size="small"
                  onClick={() => handleDeposit(user.id)}
                  style={{ marginLeft: "0.5rem" }}
                  startIcon={<EditIcon />}
                >
                  Deposito
                </Button>

                <Button
                  variant="contained"
                  color="info"
                  size="small"
                  onClick={() => handleWithdrawal(user.id)}
                  style={{ marginLeft: "0.5rem" }}
                  startIcon={<EditIcon />}
                >
                  Retiro
                </Button>

                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => handleDelete(user.id)}
                  style={{ marginLeft: "0.5rem" }}
                  startIcon={<DeleteIcon />}
                >
                  Eliminar
                </Button>
                <Link to={`/credit/add/${user.id}`} style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            color="info"
            size="small"
            startIcon={<PersonAddIcon />}
          >
            Crédito
          </Button>
        </Link>
              
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserList;
