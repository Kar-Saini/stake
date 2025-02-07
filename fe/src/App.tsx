import { BrowserRouter, Route, Routes } from "react-router-dom";
import Game from "./components/Game";
import Simulation from "./components/Simulation";
import Auth from "./components/Auth";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route Component={Game} path="/" />
          <Route Component={Simulation} path="/simulation" />
          <Route Component={Auth} path="/auth" />
        </Routes>
      </BrowserRouter>
    </>
  );
}
