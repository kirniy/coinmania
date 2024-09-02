import { PrizeProps, RuleProps } from "@/types/rules";
import React, { use, useState } from "react";
import { InnerModal } from "../modal/InnerModal";
import { PrizeModal } from "../modal/PrizeModal";

export function Rule({ text, icon }: RuleProps) {
  return (
    <div className="flex items-center space-x-4 bg-white bg-opacity-10 p-4 rounded-xl hover:bg-opacity-20 transition-all duration-300">
      <div className="text-yellow-400 bg-yellow-400 bg-opacity-20 p-2 rounded-full">
        {icon()}
      </div>
      <div className="text-sm flex-grow">{text}</div>
    </div>
  );
}

export function Prize(props: PrizeProps) {
  const [openRule, setOpenRule] = useState(false);

  function handleOpenPrize() {
    setOpenRule(true);
  }
  function handleClosePrize() {
    setOpenRule(false);
  }

  return (
    <>
      <button
        onClick={handleOpenPrize}
        className="bg-white bg-opacity-10 rounded-xl p-3 flex flex-col items-center hover:bg-opacity-20 transition-all duration-300 cursor-pointer"
      >
        <div className="relative w-full h-20 mb-2">
          <img
            src={props.pic ? props.pic : "/images/thumbnail.png"}
            alt={props.title}
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute top-1 right-1 bg-yellow-500 text-black font-bold py-1 px-2 rounded-full text-xs">
            {props.left}
          </div>
        </div>
        <h3 className="text-xs font-semibold text-center line-clamp-2 mb-1">
          {props.title}
        </h3>
        <p className="text-yellow-400 text-center text-xs">
          <span className="blur-[3px]">{props.cost}</span>{" "}
          <span className="blur-none">⭐</span>
        </p>
      </button>
      {openRule && (
        <InnerModal type="info" onClose={handleClosePrize}>
          <PrizeModal {...props} />
        </InnerModal>
      )}
    </>
  );
}
