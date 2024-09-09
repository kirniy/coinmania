import React from "react";
import { Check } from "lucide-react";

type GetRewardButtonProps = {
    children: React.ReactNode,
    onClick?: () => void,
    isReceived?: boolean,
}

const GetRewardButton: React.FC<GetRewardButtonProps> = ({ children, onClick, isReceived = false }) => {

    return (
        <>
            {isReceived && 
                <div
                    className="
                        bg-[#00b600] rounded-full w-auto max-w-[500px] px-4 py-1 text-xs font-bold text-black
                        flex gap-1 items-center justify-center shadow-md hover:cursor-default                     
                    "
                >
                    <Check width={15} height={15} />
                    {children}
                </div>
            }

            {!isReceived &&
                <button
                    className="
                        bg-[#f8cc46] rounded-full w-auto max-w-[500px] px-4 py-1 text-xs font-bold text-black
                        cursor-pointer flex items-center justify-center shadow-md transition-transform duration-300
                        ease-in-out transform scale-100 hover:scale-105
                    "
                    onClick={onClick}
                >
                    {children}
                </button>
            }
        </>
    )
}

export default GetRewardButton;

