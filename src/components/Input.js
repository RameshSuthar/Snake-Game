import React from "react";

const Input = ({ type, placeholder, value, onChange, label, min }) => {
    return (
        <div className="field">
            <label>{label}</label>
            <input min={min} type={type} placeholder={placeholder} value={value} onChange={onChange} />
        </div>
    );
}

export default Input;
