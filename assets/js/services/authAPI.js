import axios from "axios";
import jwtdecode from "jwt-decode";

/**
 * Déconnexion (suppression du token du localStorage et sur Axios)
 */
function logout() {
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers["Authorization"];
}

/**
 * Reduête HTTP d'authentication et storage du token dans le storage et sur Axios
 * @param credentials
 * @returns {Promise<boolean>}
 */
function authenticate(credentials) {
    return axios
        .post("https://localhost:8000/api/login_check", credentials)
        .then(response => response.data.token)
        .then(token => {
            // Je stock le token dans mon localStorage
            window.localStorage.setItem("authToken", token);
            // On prévient Axios qu'on a maintenant un header par défaut sur toutes nos futures requetes HHT
            setAxiosToken(token);

            return true;
        })
}

/**
 * Positionne le token JWT sur Axios
 * @param token
 */

function setAxiosToken(token) {
    axios.defaults.headers["Authorization"] = "Bearer " + token;
}

/**
 * Mise en place lors du chargement de l'application
 */
function setup() {
    // 1. Voir si on a un token?
    const token = window.localStorage.getItem("authToken");
    // 2. Si le token est encore valide
    if (token) {
        const {exp: expiration} = jwtdecode(token);
        if(expiration * 1000 > new Date().getTime()){
            setAxiosToken(token);
        }
     }
    // Donner le token à axios
}

/**
 * Permet de savoir si on est authentifié ou pas
 * @returns {boolean}
 */
function isAuthenticated() {
    // 1. Voir si on a un token?
    const token = window.localStorage.getItem("authToken");
    // 2. Si le token est encore valide
    if (token) {
        const {exp: expiration} = jwtdecode(token);
        if(expiration * 1000 > new Date().getTime()){
            return true;
        }
        return false;
    }
    return false;
}


export default {
    authenticate,
    logout,
    setup,
    isAuthenticated
};