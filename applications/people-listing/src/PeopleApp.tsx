import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App";
import User from "./User";

const PeopleApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/people/:name" element={<User />} />
      </Routes>
    </BrowserRouter>
  );
};

export default PeopleApp;
