import React from "react";

const Input = ({ type, placeholder, value, onChange, label }) => {
    return (
        <div className="field">
            <label>{label}</label>
            <input type={type} placeholder={placeholder} value={value} onChange={onChange} />
        </div>
    );
}

export default Input;