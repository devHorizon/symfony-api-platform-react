import React, {useState} from 'react';
import Field from "../components/forms/Field";
import {Link} from "react-router-dom";
import userAPI from "../services/usersAPI";
import {toast} from "react-toastify";


function RegisterPage({history}) {
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });

    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });
    // Gestion des changements des inputs dans le formulaire
    const handleChange = ({currentTarget}) => {
        const {name, value} = currentTarget;
        setUser({...user, [name]: value});
    };
// Gestion de la soumission
    const handleSubmit = async (event) => {
        event.preventDefault();
        const apiErrors = {};
        if (user.password !== user.passwordConfirm) {
            apiErrors.passwordConfirm = "Votre confirmation de mot de passe n'est pas conforme avec le mot de passe original";
            setErrors(apiErrors);
            return;
        };
        try {
           await userAPI.register(user);
            toast.success("Vous êtes désormais inscrit, vous pouvez vous connecter !")
            setErrors({});
            history.replace('/login')

        } catch (error) {
            // console.log(error.response);
            const {violations} = error.response.data;

            if (violations) {
                violations.forEach(violation => {
                    apiErrors[violation.propertyPath] = violation.message;
                });
                setErrors(apiErrors);
            }
toast.error("Des erreurs dans votre formulaire !")
        }
        // console.log(user);
    };

    return (
        <>
            <h1>Inscription</h1>
            <form onSubmit={handleSubmit}>
                <Field name="firstName" label="Prénom" placeholder="Votre joli prénom" error={errors.firstName}
                       value={user.firstName} onChange={handleChange}/>
                <Field name="lastName" label="Nom de famille" placeholder="Nom de famille" error={errors.lastName}
                       value={user.lastName} onChange={handleChange}/>
                <Field name="email" label="Email" placeholder="Adresse de l'email" error={errors.email}
                       value={user.email} onChange={handleChange}/>
                <Field name="password" type="password" label="Mot de passe" placeholder="Votre Mot de passe"
                       error={errors.password} value={user.password} onChange={handleChange}/>
                <Field name="passwordConfirm" type="password" label="Confirmation de mot de passe"
                       placeholder="Confirmez votre Mot de passe" error={errors.passwordConfirm} value={user.passwordConfirm}
                       onChange={handleChange}/>
                <div className="form-group">
                    <button type="submit" className="btn btn-success">Confirmation</button>
                    <Link to="/login" className="btn btn-link">J'ai déjà un compte</Link>
                </div>
            </form>
        </>
    );
}

export default RegisterPage;