import React, { useEffect, useRef, useState } from "react";
import { Manager } from "../classes/Manager";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SERVER from "../utils";

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameManager, setGameManager] = useState<Manager | null>(null);
  const [betAmount, setBetAmount] = useState<number>(10);
  const navigate = useNavigate();

  useEffect(() => {
    if (canvasRef.current) {
      const gameManager = new Manager(canvasRef.current, () => {});
      setGameManager(gameManager);
    }
  }, []);
  return (
    <div className="bg-gray-900 h-screen">
      <div className="bg-gray-800 h-[60px] shadow-lg flex justify-between items-center px-8 text-neutral-300">
        <div className="text-2xl  italic tracking-wide font-bold">Stake</div>
        <div className="flex gap-4 text-sm font-semibold">
          <button
            onClick={() => {
              navigate("/auth");
            }}
          >
            Sign in
          </button>
          <button
            onClick={() => {
              navigate("/auth");
            }}
            className="bg-blue-600 p-2 text-white rounded-md hover:bg-blue-800"
          >
            Register
          </button>
        </div>
      </div>
      <div className="flex justify-center items-center my-8">
        <div className="flex w-9/12 bg-slate-700 items-center justify-center rounded-lg h-[600px]">
          <div className="w-1/3 flex flex-col gap-y-6 px-4 py-2 h-full">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-neutral-400 font-semibold">
                Your Balance
              </p>
              <p className="bg-slate-600 p-1 rounded-md text-gray-300">900</p>
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="bet "
                className="text-sm text-neutral-400 font-semibold"
              >
                Bet Amount
              </label>
              <div className="flex justify-between p-1 bg-slate-600">
                <input
                  type="number"
                  placeholder="0.00"
                  className="p-1 bg-slate-700  text-gray-300 text-sm w-2/3"
                  id="bet"
                  value={betAmount}
                  onChange={(e) => setBetAmount(Number(e.target.value))}
                />
                <button
                  className=" px-2 hover:bg-slate-500 rounded-md text-xs text-neutral-400 font-semibold"
                  onClick={() => {
                    setBetAmount(betAmount / 2);
                  }}
                >
                  1/2x
                </button>
                <p className="border-r-2"></p>
                <button
                  className=" px-3 hover:bg-slate-500 rounded-md text-xs text-neutral-400 font-semibold"
                  onClick={() => {
                    setBetAmount(betAmount * 2);
                  }}
                >
                  2x
                </button>
              </div>
            </div>
            <button
              onClick={async () => {
                try {
                  const result = await axios.post<{
                    multiplier: number;
                    startX: number;
                  }>(SERVER + "/bet", {
                    betAmount,
                    token: localStorage.getItem("token") as string,
                  });
                  const { multiplier, startX } = result.data;
                  console.log(multiplier);
                  gameManager?.addBall(startX);
                } catch (error) {
                  console.log(error);
                }
              }}
              className="bg-green-500 rounded-md py-3 font-bold hover:bg-green-600"
            >
              Bet
            </button>
          </div>
          <div className="bg-slate-800">
            <canvas
              ref={canvasRef}
              width="800"
              height="600"
              className=" "
            ></canvas>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
