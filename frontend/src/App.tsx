import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/home";
import { SigninForm } from "./components/signup-form";
import { SignupForm } from "./components/signin-form";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SigninForm />} />
        <Route path="/signup" element={<SignupForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
