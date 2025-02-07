import React, { useEffect, useRef, useState } from "react";
import { Manager } from "../classes/Manager";

const Simulation = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameManager, setGameManager] = useState<Manager | null>(null);
  const [outputs, setOutputs] = useState<{ [index: number]: number[] }>({
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    6: [],
    7: [],
    8: [],
    9: [],
    10: [],
    11: [],
    12: [],
    13: [],
    14: [],
  });
  useEffect(() => {
    if (canvasRef.current) {
      const manager = new Manager(
        canvasRef.current,
        (index: number, startX: number) => {
          setOutputs((prevOutputs) => {
            return {
              ...prevOutputs,
              [index]: [...(prevOutputs[index] || []), startX],
            };
          });
        }
      );
      setGameManager(manager);
    }
    return () => {
      gameManager?.stop();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      gameManager?.addBall(Math.random() * 36 + 364);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [gameManager]);

  console.log(outputs);
  return (
    <div className="bg-gray-900  h-screen">
      <div className="bg-gray-800 h-[60px] shadow-lg flex justify-between items-center px-8 text-neutral-300">
        <div className="text-2xl  italic tracking-wide font-bold">Stake</div>
        <div className="flex gap-4 text-sm font-semibold">
          <button>Sign in</button>
          <button className="bg-blue-600 p-2 text-white rounded-md hover:bg-blue-800">
            Register
          </button>
        </div>
      </div>
      <div className="flex justify-center items-center my-8">
        <div className="flex w-9/12 bg-slate-700 items-center justify-center rounded-lg h-[600px]">
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

export default Simulation;
