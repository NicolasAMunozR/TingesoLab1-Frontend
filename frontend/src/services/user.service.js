import httpClient from "../http-common";

const getUserById = id => {
    return httpClient.get(`/users/${id}`);
}

const getAll = () => {
    return httpClient.get("/users/all");
}

const create = (formData) => {
    return httpClient.post("/users/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Esto es manejado automáticamente
      },
    });
  };

const update = (id, file, email) => {
    return httpClient.put(`/users/update/${id}`, {params: {file, email}});
}

const remove = id => {
    return httpClient.delete(`/users/delete/${id}`);
}

const simulation = data => {
    return httpClient.post("/users/simulation", data);
}

const deposit = (formData) => {
    return httpClient.put("/users/deposit", formData,{
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

const withdraw = (formData) => {
    return httpClient.put("/users/withdrawal", formData,{
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

const get = id => {
    return httpClient.get(`/users/name/${id}`);
}
export default { get, getAll, create, update, remove, simulation, deposit, withdraw, getUserById };