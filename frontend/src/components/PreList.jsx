import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import creditService from "../services/credit.service";
import userService from "../services/user.service"; 
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const PreList = () => {
  const [credits, setCredits] = useState([]);
  const [users, setUsers] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  // Función para obtener créditos por usuario
  const init = () => {
    creditService
      .getcredits(id)
      .then((response) => {
        console.log("Mostrando listado de créditos del usuario.", response.data);
        setCredits(response.data);

        // Obtener la información de los usuarios para cada crédito
        response.data.forEach((creditItem) => {
          if (!users[creditItem.userId]) {
            userService.getUserById(creditItem.userId)
              .then((userResponse) => {
                console.log("Mostrando datos del usuario.", userResponse.data);
                setUsers((prevUsers) => ({
                  ...prevUsers,
                  [creditItem.userId]: userResponse.data,
                }));
              })
              .catch((error) => {
                console.log("Error al obtener datos del usuario", error);
              });
          }
        });
      })
      .catch((error) => {
        console.log("Error al mostrar créditos.", error);
      });
  };

  useEffect(() => {
    init();
  }, [id]);

  // Filtrar créditos que tienen valores no nulos en lienInsurance, administrationFee y que estén Pre-aprobados
  const filteredCredits = credits.filter(
    (creditItem) =>
      creditItem.lienInsurance != null &&
      creditItem.administrationFee != null &&
      creditItem.applicationStatus === "Pre-aprobado"
  );

  const handleCancel = (id) => {
    const confirmDelete = window.confirm("¿Está seguro que desea cancelar este crédito?");
    if (confirmDelete) {
      creditService
        .rejectTerms(id)
        .then((response) => {
          console.log("Crédito cancelado", response.data);
          init();
        })
        .catch((error) => {
          console.log("Error al cancelar crédito", error);
        });
    }
  };

  const handleState = (id) => {
    const confirmState = window.confirm("¿Está seguro que desea actualizar el estado de este crédito?");
    if (confirmState) {
      creditService
        .updateStatus(id)
        .then((response) => {
          console.log("Estado del crédito actualizado", response.data);
          init();
        })
        .catch((error) => {
          console.log("Error al actualizar el estado del crédito", error);
        });
    }
  };

  const handleEvaluate = (id) => {
    const confirmState = window.confirm("¿Está seguro que desea evaluar este crédito?");
    if (confirmState) {
      creditService
        .evaluateCredit(id)
        .then((response) => {
          console.log("Crédito evaluado", response.data);
          init();
        })
        .catch((error) => {
          console.log("Error al evaluar el crédito", error);
        });
    }
  };

  const handlePreApproval = (id) => {
    navigate(`/credit/addterms/${id}`);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>Rut</TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>Nombre</TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>Correo</TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>Estado</TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>Seguro gravamen</TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>Comisión de administración</TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>Primera cuota</TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>Cuotas mensuales</TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>Cantidad de cuotas</TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>Operaciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredCredits.map((creditItem) => (
            <TableRow key={creditItem.id}>
              <TableCell align="left">
                {users[creditItem.userId] ? users[creditItem.userId].identifyingDocument : "Cargando..."}
              </TableCell>
              <TableCell align="left">
                {users[creditItem.userId] ? users[creditItem.userId].name : "Cargando..."}
              </TableCell>
              <TableCell align="left">
                {users[creditItem.userId] ? users[creditItem.userId].email : "Cargando..."}
              </TableCell>
              <TableCell align="left">
                {creditItem.applicationStatus}
              </TableCell>
              <TableCell align="left">
                {creditItem.lienInsurance}
              </TableCell>
              <TableCell align="left">
                {creditItem.administrationFee}
              </TableCell>
              <TableCell align="left">
                {creditItem.firstInstallment}
              </TableCell>
              <TableCell align="left">
                {creditItem.remainingMonthlyInstallments}
              </TableCell>
              <TableCell align="left">
                {creditItem.loanTerm * 12}
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="info"
                  size="small"
                  onClick={() => handleState(creditItem.id)}
                  style={{ marginLeft: "0.5rem" }}
                  startIcon={<EditIcon />}
                >
                  Aceptar Terminos
                </Button>

                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => handleCancel(creditItem.id)}
                  style={{ marginLeft: "0.5rem" }}
                  startIcon={<DeleteIcon />}
                >
                  Cancelar Crédito
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PreList;
