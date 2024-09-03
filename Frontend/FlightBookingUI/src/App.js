import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Footer from "./components/Footer/Footer";
import Home from "./components/Home/Home";

import Navbar from "./components/Navbar/Navbar";

import Subscribers from "./components/Subscribers/Subscribers";

function App() {
  return (
    <main>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Navbar />}>
            <Route index element={<Home />} />
          </Route>
        </Routes>
        <Subscribers />
        <Footer />
      </BrowserRouter>

    </main>
  );
}

export default App;
