import './App.css'
import { Routes, Route } from 'react-router-dom';
import Home from '../src/pages/Home';
import AddAgent from './pages/AddAgent';
import AddLead from './pages/AddLead';
import LeadList from './pages/LeadList';
import LeadManagement from './pages/LeadManagement';
import LeadStatus from './pages/LeadStatus';
import SalesAgentView from './pages/SalesAgentView';
import Reports from './pages/Reports';
import SalesManagement from './pages/SalesManagement';

function App() {
  return (
    <Routes>
      <Route path="/home" element={<Home/>}/>
      <Route path="/addagent" element={<AddAgent/>}/>
      <Route path="/addlead" element={<AddLead/>}/>
      <Route path="/leadlist" element={<LeadList/>}/>
      <Route path="/leadmanagement" element={<LeadManagement/>}/>
      <Route path="/leadstatus" element={<LeadStatus/>}/>
      <Route path="/reports" element={<Reports/>}/>
      <Route path="/salesagentview" element={<SalesAgentView/>}/>
      <Route path="/salesmanagement" element={<SalesManagement/>}/>
    </Routes>
  )
}

export default App