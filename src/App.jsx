import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound.jsx";
import Localmate from "./pages/localmate.jsx";
import LocalmateList from "./pages/localmateList.jsx";
import Navbar from "./components/navbar.jsx";
import AdminProvider from "./context/ContextProvider.jsx";
function App() {
  return (
    <AdminProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Localmate />} />
          <Route path="/list" element={<LocalmateList />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AdminProvider>
  );
}

export default App;
