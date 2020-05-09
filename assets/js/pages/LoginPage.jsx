import React, {useState, useContext} from 'react';
import AuthAPI from "../services/authAPI";
import AuthContext from "../contexts/AuthContext";
import Field from '../components/forms/Field';
import {toast} from "react-toastify";



const LoginPage = ({history}) => {

    const {setIsAuthenticated} = useContext(AuthContext);

    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    });
    const [error, setError] = useState("");
// Gestion des chanmps
    const handleChange = ({currentTarget}) => {
        const {value, name} = currentTarget;
        /* const value = currentTarget.value;
        const name = currentTarget.name;*/

        setCredentials({...credentials, [name]: value});
    };
// Gestions des submit
    const handleSubmit = async event => {
        event.preventDefault();

        try {
            await AuthAPI.authenticate(credentials);
            setError("");
            setIsAuthenticated(true);
            toast.success("Vous êtes désormais connecté !");
            history.replace("/customers");
        } catch (error) {
            setError("Aucun compte ne possède cette adresse ou alors les informations ne correspondent pas");
        toast.error("Une erreur est survenue");
        }
    };


    return (
        <>
            <h1>Connextion à l'application</h1>
            <form onSubmit={handleSubmit}>
                <Field label="Adresse email" name="username" value={credentials.username} onChange={handleChange} placeholder="Adresse email de connexion" error={error} />
                <Field label="Mot de passe" name="password" value={credentials.password} onChange={handleChange} placeholder="Mot de passe" error={error} />
                <div className="form-group">
                    <button type="submit" className="btn btn-success">Je me connecte</button>
                </div>
            </form>
        </>
    );
};

export default LoginPage;