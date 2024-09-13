import { PrizeProps } from "@/types/rules";
import React from "react";

export function PrizeDetailed(props: PrizeProps) {
  return (
    <div className="flex flex-col space-y-1.5 text-center sm:text-left gap-4 text-white">
      <h2 className="text-lg font-semibold leading-none tracking-tight text-center text-yellow-400">
        {props.title}
      </h2>

      <div className="mt-4">
        <img
          src={props.pic ? props.pic : "/images/thumbnail.png"}
          alt={props.title}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
        <p className="text-sm mb-4">{props.decription}</p>
        <div className="flex justify-between items-center">
          <p className="text-yellow-400 font-bold">
            Стоимость: <span className="blur-[3px]">{props.cost}</span>{" "}
            <span className="blur-none">⭐</span>
          </p>
          <p className="text-sm">Осталось: {props.left}</p>
        </div>
        <button className="w-full mt-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold py-2 px-4 rounded-full opacity-50 cursor-not-allowed">
          Скоро
        </button>
      </div>
    </div>
  );
}
