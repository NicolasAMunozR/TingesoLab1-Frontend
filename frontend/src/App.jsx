import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Home from './components/Home';
import NotFound from './components/NotFound';
import User from './components/UserList';
import AddEditUser from './components/AddEditUser';
import SimulationCredit from './components/SimulationCredit';
import CreditsList from './components/CreditsList';
import AddCredit from './components/AddCredit';
import AddTerms from './components/AddTerms';
import PreList from './components/PreList';
import AddWithdra from './components/AddWithdra';
import AddDeposit from './components/AddDeposit';

function App() {
  return (
      <Router>
          <div className="container">
              <Navbar />
              <Routes>
                  <Route path="/" element={<Navigate to="/home" replace />} /> {/* Redirección a /home */}
                  <Route path="/home" element={<Home />} />
                  <Route path="/user/list" element={<User />} />
                  <Route path="/user/add" element={<AddEditUser />} />
                  <Route path="/user/simulation" element={<SimulationCredit />} />
                  <Route path="/credit/list" element={<CreditsList />} />
                  <Route path="/credit/add/:id" element={<AddCredit />} />
                  <Route path="/credit/addterms/:id" element={<AddTerms />} />
                  <Route path="/credit/pre" element={<PreList />} />
                  <Route path="/user/withdraw/:id" element={<AddWithdra />} />
                  <Route path="/user/deposit/:id" element={<AddDeposit />} />
                  <Route path="*" element={<NotFound />} />
              </Routes>
          </div>
      </Router>
  );
}

export default App;

