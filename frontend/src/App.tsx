import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/home";
import { SigninForm } from "./components/signin-form";
import { SignupForm } from "./components/signup-form";
import SharedLink from "./components/SharedLink";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shared/:code" element={<SharedLink />} />
        <Route path="/signin" element={<SigninForm />} />
        <Route path="/signup" element={<SignupForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
