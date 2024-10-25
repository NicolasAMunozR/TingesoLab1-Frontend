import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

// Orden de prioridad para estados y tipos de préstamos
const statusPriority = [
  "En revisión", 
  "Pendiente de documentación", 
  "En evaluación", 
  "Pre-aprobado", 
  "Aprobación final", 
  "Aprobada", 
  "Rechazada", 
  "Cancelada", 
  "Desembolso"
];

const loanTypePriority = [
  "Primera Vivienda", 
  "Segunda Vivienda", 
  "Propiedades Comerciales", 
  "Remodelación"
];

const CreditsList = () => {
  const [credits, setCredits] = useState([]);
  const [users, setUsers] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  const init = () => {
    creditService
      .getcredits(id)
      .then((response) => {
        const sortedCredits = response.data.sort((a, b) => {
          // Ordenar primero por el estado de aplicación
          const statusComparison = statusPriority.indexOf(a.applicationStatus) - statusPriority.indexOf(b.applicationStatus);
          if (statusComparison !== 0) return statusComparison;
          
          // Si tienen el mismo estado, ordenar por tipo de préstamo
          return loanTypePriority.indexOf(a.typeOfLoan) - loanTypePriority.indexOf(b.typeOfLoan);
        });

        setCredits(sortedCredits);

        // Obtener la información de los usuarios para cada crédito
        response.data.forEach((creditItem) => {
          if (!users[creditItem.userId]) {
            userService.getUserById(creditItem.userId)
              .then((userResponse) => {
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

  const handleCancel = (id) => {
    const confirmDelete = window.confirm("¿Está seguro que desea cancelar este crédito?");
    if (confirmDelete) {
      creditService.rejectTerms(id).then(() => {
        init();
      }).catch((error) => {
        console.log("Error al cancelar crédito", error);
      });
    }
  };

  const handleState = (id) => {
    const confirmState = window.confirm("¿Está seguro que desea actualizar el estado de este crédito?");
    if (confirmState) {
      creditService.updateStatus(id).then(() => {
        init();
      }).catch((error) => {
        console.log("Error al actualizar el estado del crédito", error);
      });
    }
  };

  const handleEvaluate = (id) => {
    const confirmState = window.confirm("¿Está seguro que desea evaluar este crédito?");
    if (confirmState) {
      creditService.evaluateCredit(id).then(() => {
        init();
      }).catch((error) => {
        console.log("Error al evaluar el crédito", error);
      });
    }
  };

  const handlePreApproval = (id) => {
    navigate(`/credit/addterms/${id}`);
  };

  return (
    <div>
      {statusPriority.map((status) => {
        // Filtrar créditos por estado
        const creditsByStatus = credits.filter((creditItem) => creditItem.applicationStatus === status);

        // Solo mostrar el estado si hay créditos en él
        return creditsByStatus.length > 0 && (
          <div key={status}>
            <h3>{status}</h3>
            {loanTypePriority.map((loanType) => {
              // Filtrar créditos por tipo de préstamo dentro del estado actual
              const creditsByType = creditsByStatus.filter((creditItem) => creditItem.typeOfLoan === loanType);

              // Solo mostrar el tipo de préstamo si hay créditos en él
              return creditsByType.length > 0 && (
                <div key={loanType}>
                  <h4>{loanType}</h4>
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                      <TableHead>
                        <TableRow>
                          <TableCell align="left" sx={{ fontWeight: "bold" }}>Rut</TableCell>
                          <TableCell align="left" sx={{ fontWeight: "bold" }}>Nombre</TableCell>
                          <TableCell align="left" sx={{ fontWeight: "bold" }}>Correo</TableCell>
                          <TableCell align="left" sx={{ fontWeight: "bold" }}>Estado</TableCell>
                          <TableCell align="left" sx={{ fontWeight: "bold" }}>Tipo de prestamo</TableCell>
                          <TableCell align="left" sx={{ fontWeight: "bold" }}>Plazo</TableCell>
                          <TableCell align="left" sx={{ fontWeight: "bold" }}>Cantidad</TableCell>
                          <TableCell align="left" sx={{ fontWeight: "bold" }}>Tasa de interes</TableCell>
                          <TableCell align="left" sx={{ fontWeight: "bold" }}>Operaciones</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {creditsByType.map((creditItem) => (
                          <TableRow key={creditItem.id}>
                            <TableCell align="left">{users[creditItem.userId] ? users[creditItem.userId].identifyingDocument : "Cargando..."}</TableCell>
                            <TableCell align="left">{users[creditItem.userId] ? users[creditItem.userId].name : "Cargando..."}</TableCell>
                            <TableCell align="left">{users[creditItem.userId] ? users[creditItem.userId].email : "Cargando..."}</TableCell>
                            <TableCell align="left">{creditItem.applicationStatus}</TableCell>
                            <TableCell align="left">{creditItem.typeOfLoan}</TableCell>
                            <TableCell align="left">{creditItem.loanTerm}</TableCell>
                            <TableCell align="left">{creditItem.requestedAmount}</TableCell>
                            <TableCell align="left">{creditItem.annualInterestRate}</TableCell>
                            <TableCell>
                              {/* Ocultar las operaciones si el estado es 'Cancelada' o 'Rechazada' */}
                              {(creditItem.applicationStatus !== "Cancelada" && creditItem.applicationStatus !== "Rechazada" && creditItem.applicationStatus !== "Desembolso") && (
                                <>
                                  <Button
                                    variant="contained"
                                    color="info"
                                    size="small"
                                    onClick={() => handleState(creditItem.id)}
                                    style={{ marginLeft: "0.5rem" }}
                                    startIcon={<EditIcon />}
                                  >
                                    Actualizar estado
                                  </Button>

                                  <Button
                                    variant="contained"
                                    color="error"
                                    size="small"
                                    onClick={() => handleCancel(creditItem.id)}
                                    style={{ marginLeft: "0.5rem" }}
                                    startIcon={<DeleteIcon />}
                                  >
                                    Cancelar Credito
                                  </Button>

                                  <Button
                                    variant="contained"
                                    color="info"
                                    size="small"
                                    onClick={() => handleEvaluate(creditItem.id)}
                                    style={{ marginLeft: "0.5rem" }}
                                    startIcon={<EditIcon />}
                                  >
                                    Evaluar Credito
                                  </Button>

                                  {creditItem.applicationStatus === "Pre-aprobado" && (
                                    <Button
                                      variant="contained"
                                      color="success"
                                      size="small"
                                      onClick={() => handlePreApproval(creditItem.id)}
                                      style={{ marginLeft: "0.5rem" }}
                                    >
                                      Añadir terminos al credito
                                    </Button>
                                  )}
                                </>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default CreditsList;

