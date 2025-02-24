import React from "react";

interface ButtonProps {
    text: string;
    onClick: () => void;
    type?: "button" | "submit";
    variant?: "primary" | "danger" | "success";
}

const Button: React.FC<ButtonProps> = ({ text, onClick, type = "button", variant = "primary" }) => {
    const baseStyle = "px-4 py-2 rounded-lg font-bold transition";
    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        danger: "bg-red-600 text-white hover:bg-red-700",
        success: "bg-green-600 text-white hover:bg-green-700",
    };

    return (
        <button type={type} onClick={onClick} className={`${baseStyle} ${variants[variant]}`}>
            {text}
        </button>
    );
};

export default Button;
