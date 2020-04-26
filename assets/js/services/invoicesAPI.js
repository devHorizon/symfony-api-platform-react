import axios from 'axios';

function findAll() {
    return axios
        .get("https://127.0.0.1:8000/api/invoices")
        .then(response => response.data["hydra:member"]);
}

function deleteInvoices(id) {
    return axios
        .delete("https://127.0.0.1:8000/api/invoices/" + id);
}

export default {
    findAll,
    delete: deleteInvoices
};