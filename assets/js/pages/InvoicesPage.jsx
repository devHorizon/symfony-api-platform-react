import React, {useEffect, useState} from 'react';
import Pagination from "../components/Pagination";
import invoicesAPI from "../services/invoicesAPI";
import moment from "moment";
import {Link} from 'react-router-dom';
import {toast} from "react-toastify";
import TableLoader from "../components/loaders/TableLoader";

const STATUS_CLASSES = {
    PAID: "success",
    SENT: "primary",
    CANCELLED: "danger"
}

const STATUS_LABELS = {
    PAID: "Payée",
    SENT: "Envoyée",
    CANCELLED: "Annulée"
}


const InvoicesPage = props => {
    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 50;

// Gestion du format de date
    const formatDate = (str) => moment(str).format('DD/MM/YYYY');

    // Récupération des invoices auprès de l'API
    const fetchInvoices = async () => {
        try {
            const data = await invoicesAPI.findAll();
            setInvoices(data);
            setLoading(false);
        } catch (e) {
            toast.error("Erreur lors du chargement des factures !");
        }
    };
    // Au chargement du composant, on va chercher les invoices;
    useEffect(() => {
        fetchInvoices();
    }, []);

    // Gestion de la suppression d'une invoice
    const handleDelete = async (id) => {
        const originalInvoices = [...invoices];
        setInvoices(invoices.filter(invoice => invoice.id !== id));
        try {
            await invoicesAPI.delete(id);
            toast.success("La facture a bien été supprimée");
        } catch (error) {
            toast.error("Une erreur est survenue");
            setInvoices(originalInvoices);
        }

    };
    // Gestion du changement de page
    const handlePageChange = (page) => setCurrentPage(page);

    // Gestion de la recherche
    /*function search qui va recevoir un evenement */
    const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    };


// Filtrage des customers en fonction de la recherche
    const filteredInvoices = invoices.filter(
        i =>
            i.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
            i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
            i.amount.toString().startsWith(search.toLowerCase()) ||
            STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase())
    );

    // Pagination des données
    const paginationInvoices = Pagination.getData(filteredInvoices, currentPage, itemsPerPage);

    return (
        <>
            <div className="d-flex justify-content-between align-items-center">
            <h1>Liste des factures</h1>
                <Link className="btn btn-primary" to="/invoices/new">Créer une facture</Link>
            </div>
            <div className="form-group">
                <input type="text" onChange={handleSearch} value={search} className="form-control"
                       placeholder="Rechercher ..."/>
            </div>

            <table className="table table-hover">
                <thead>
                <tr>
                    <th>Numero</th>
                    <th>Client</th>
                    <th>Date d'envoi</th>
                    <th className="text-center">Status</th>
                    <th className="text-center">Montant</th>
                    <th/>
                </tr>
                </thead>
                {!loading && (<tbody>
                {paginationInvoices.map(invoice =>
                    <tr key={invoice.id}>
                        <td>{invoice.chrono}</td>
                        <td><Link to={"/customers/" + invoice.customer.id}>
                            {invoice.customer.firstName} {invoice.customer.lastName}
                        </Link></td>
                        <td>{formatDate(invoice.sentAt)}</td>
                        <td className="text-center">
                            <span className={"badge badge-" + STATUS_CLASSES[invoice.status]}>
                            {STATUS_LABELS[invoice.status]}
                        </span>
                        </td>
                        <td className="text-center">{invoice.amount.toLocaleString()}</td>
                        < td>
                            <Link to={"/invoices/" + invoice.id} className="btn btn-sm btn-primary mr-1">Editer</Link>
                            <button onClick={() => handleDelete(invoice.id)}
                                     className="btn btn-sm btn-danger">Supprimer
                            </button>
                        </td>
                    </tr>
                )}

                </tbody>)}
            </table>
            {loading && <TableLoader />}
            {itemsPerPage < filteredInvoices.length && (
                <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} length={filteredInvoices.length}
                            onPageChanged={handlePageChange}/>
            )}

        </>
    );
};

export default InvoicesPage;
