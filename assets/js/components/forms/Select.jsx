import React from 'react';

function Select({name, value, error = "", label, onChange, children}) {
    return (
            <div className="form-group"><label htmlFor={name}>{label}</label>
                <select onChange={onChange} name={name} id={name} value={value} className={"form-control" + (error && " is-invalid")}>
                    {children}
                </select>
                <p className="invalid-feedback">Erreur</p>
            </div>
    );
}

export default Select;