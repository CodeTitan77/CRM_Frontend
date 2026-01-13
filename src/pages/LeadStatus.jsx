import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Spinner } from "@/components/ui/spinner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import LeadCard from "@/components/LeadCard"

const LeadStatus = () => {
  const [newLeads, setNewLeads] = useState([]);
  const [contactedLeads, setContactedLeads] = useState([]);
  const [qualifiedLeads, setQualifiedLeads] = useState([]);
  const [proposalLeads, setProposalLeads] = useState([]);
  const [closedLeads, setClosedLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [salesAgent, setSalesAgent] = useState('');
  const [priority, setPriority] = useState('');
  const [sort, setSort] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await fetch('http://localhost:7777/agents');
        const data = await res.json();
        setAgents(data?.data || []);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchAgents();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const baseUrl = 'http://localhost:7777/leads';
        
        const params = new URLSearchParams();
        if (salesAgent) params.append('salesAgent', salesAgent);

        const params1 = new URLSearchParams(params);
        params1.append('status', 'New');
        const res1 = await fetch(`${baseUrl}?${params1.toString()}`);
        
        const params2 = new URLSearchParams(params);
        params2.append('status', 'Contacted');
        const res2 = await fetch(`${baseUrl}?${params2.toString()}`);
        
        const params3 = new URLSearchParams(params);
        params3.append('status', 'Qualified');
        const res3 = await fetch(`${baseUrl}?${params3.toString()}`);
        
        const params4 = new URLSearchParams(params);
        params4.append('status', 'Proposal Sent');
        const res4 = await fetch(`${baseUrl}?${params4.toString()}`);
        
        const params5 = new URLSearchParams(params);
        params5.append('status', 'Closed');
        const res5 = await fetch(`${baseUrl}?${params5.toString()}`);

        const data1 = await res1.json();
        const data2 = await res2.json();
        const data3 = await res3.json();
        const data4 = await res4.json();
        const data5 = await res5.json();

        let arr1 = data1?.data || [];
        let arr2 = data2?.data || [];
        let arr3 = data3?.data || [];
        let arr4 = data4?.data || [];
        let arr5 = data5?.data || [];

        if (priority) {
          arr1 = arr1.filter(lead => lead.priority === priority);
          arr2 = arr2.filter(lead => lead.priority === priority);
          arr3 = arr3.filter(lead => lead.priority === priority);
          arr4 = arr4.filter(lead => lead.priority === priority);
          arr5 = arr5.filter(lead => lead.priority === priority);
        }

        if (sort) {
          arr1.sort((a, b) => b.timeToClose - a.timeToClose);
          arr2.sort((a, b) => b.timeToClose - a.timeToClose);
          arr3.sort((a, b) => b.timeToClose - a.timeToClose);
          arr4.sort((a, b) => b.timeToClose - a.timeToClose);
          arr5.sort((a, b) => b.timeToClose - a.timeToClose);
        }

        setNewLeads(arr1);
        setContactedLeads(arr2);
        setQualifiedLeads(arr3);
        setProposalLeads(arr4);
        setClosedLeads(arr5);
        setLoading(false);
      } catch (error) {
        console.log(error.message);
        setLoading(false);
      }
    };
    fetchData();
  }, [salesAgent, priority, sort]);

  const handleLeadClick = (id) => {
    navigate(`/leadmanagement/${id}`);
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold">Lead Status</h1>
        <p className="text-muted-foreground mt-1">Leads by status</p>
      </div>

      <Separator />

      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Sales Agent</p>
              <Select value={salesAgent} onValueChange={(value) => setSalesAgent(value === "all" ? "" : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Agents" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Agents</SelectItem>
                  {agents.map((agent) => (
                    <SelectItem key={agent._id} value={agent._id}>
                      {agent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Priority</p>
              <Select value={priority} onValueChange={(value) => setPriority(value === "all" ? "" : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Sort by Time</p>
              <Select value={sort} onValueChange={(value) => setSort(value === "none" ? "" : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="No Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Sort</SelectItem>
                  <SelectItem value="true">Time to Close</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Spinner />
        </div>
      ) : (
        <div className="space-y-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="border-b bg-blue-50 dark:bg-blue-950/20">
              <CardTitle className="text-lg flex items-center justify-between">
                New
                <Badge variant="secondary">{newLeads.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {newLeads.length > 0 ? (
                <div className="space-y-3">
                  {newLeads.map((lead) => (
                    <LeadCard 
                      key={lead._id} 
                      lead={lead} 
                      onClick={() => handleLeadClick(lead._id)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No leads</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="border-b bg-yellow-50 dark:bg-yellow-950/20">
              <CardTitle className="text-lg flex items-center justify-between">
                Contacted
                <Badge variant="secondary">{contactedLeads.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {contactedLeads.length > 0 ? (
                <div className="space-y-3">
                  {contactedLeads.map((lead) => (
                    <LeadCard 
                      key={lead._id} 
                      lead={lead} 
                      onClick={() => handleLeadClick(lead._id)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No leads</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-emerald-500">
            <CardHeader className="border-b bg-emerald-50 dark:bg-emerald-950/20">
              <CardTitle className="text-lg flex items-center justify-between">
                Qualified
                <Badge variant="secondary">{qualifiedLeads.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {qualifiedLeads.length > 0 ? (
                <div className="space-y-3">
                  {qualifiedLeads.map((lead) => (
                    <LeadCard 
                      key={lead._id} 
                      lead={lead} 
                      onClick={() => handleLeadClick(lead._id)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No leads</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="border-b bg-orange-50 dark:bg-orange-950/20">
              <CardTitle className="text-lg flex items-center justify-between">
                Proposal Sent
                <Badge variant="secondary">{proposalLeads.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {proposalLeads.length > 0 ? (
                <div className="space-y-3">
                  {proposalLeads.map((lead) => (
                    <LeadCard 
                      key={lead._id} 
                      lead={lead} 
                      onClick={() => handleLeadClick(lead._id)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No leads</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="border-b bg-green-50 dark:bg-green-950/20">
              <CardTitle className="text-lg flex items-center justify-between">
                Closed
                <Badge variant="secondary">{closedLeads.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {closedLeads.length > 0 ? (
                <div className="space-y-3">
                  {closedLeads.map((lead) => (
                    <LeadCard 
                      key={lead._id} 
                      lead={lead} 
                      onClick={() => handleLeadClick(lead._id)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No leads</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default LeadStatus