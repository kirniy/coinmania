import React from "react";

type GetRewardButtonProps = {
    children: React.ReactNode,
    onClick: () => void,
}

const GetRewardButton: React.FC<GetRewardButtonProps> = ({ children, onClick }) => {

    return (
        <button
            className="
                bg-[#f8cc46] rounded-full w-auto max-w-[500px] px-4 py-2 text-sm font-bold text-black
                cursor-pointer flex items-center justify-center shadow-md transition-transform duration-300
                ease-in-out transform scale-100 hover:scale-105
            "
            onClick={onClick}
        >
            {children}
        </button>
    )
}

export default GetRewardButton;

