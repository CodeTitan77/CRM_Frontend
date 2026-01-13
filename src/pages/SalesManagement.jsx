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

const SalesAgentView = () => {
  const [agents, setAgents] = useState([]);
  const [agentLeads, setAgentLeads] = useState({});
  const [loading, setLoading] = useState(false);
  
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [sort, setSort] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        const res = await fetch('https://crm-backend-beta-two.vercel.app/agents');
        const data = await res.json();
        setAgents(data?.data || []);
        setLoading(false);
      } catch (error) {
        console.log(error.message);
        setLoading(false);
      }
    };
    fetchAgents();
  }, []);

  useEffect(() => {
    const fetchLeadsByAgent = async () => {
      if (agents.length === 0) return;

      try {
        setLoading(true);
        const baseUrl = 'https://crm-backend-beta-two.vercel.app/leads';
        const leadsData = {};

        for (const agent of agents) {
          const params = new URLSearchParams();
          params.append('salesAgent', agent._id);
          if (status) params.append('status', status);

          const res = await fetch(`${baseUrl}?${params.toString()}`);
          const data = await res.json();
          let leads = data?.data || [];

          if (priority) {
            leads = leads.filter(lead => lead.priority === priority);
          }

          if (sort) {
            leads.sort((a, b) => b.timeToClose - a.timeToClose);
          }

          leadsData[agent._id] = leads;
        }

        setAgentLeads(leadsData);
        setLoading(false);
      } catch (error) {
        console.log(error.message);
        setLoading(false);
      }
    };

    fetchLeadsByAgent();
  }, [agents, status, priority, sort]);

  const handleLeadClick = (id) => {
    navigate(`/leadmanagement/${id}`);
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold">Leads by Sales Agent</h1>
        <p className="text-muted-foreground mt-1">Leads grouped by agent</p>
      </div>

      <Separator />

      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Status</p>
              <Select value={status} onValueChange={(value) => setStatus(value === "all" ? "" : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Contacted">Contacted</SelectItem>
                  <SelectItem value="Qualified">Qualified</SelectItem>
                  <SelectItem value="Proposal Sent">Proposal Sent</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
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
          {agents.map((agent) => {
            const leads = agentLeads[agent._id] || [];
            return (
              <Card key={agent._id} className="border-l-4 border-l-blue-500">
                <CardHeader className="border-b bg-blue-50 dark:bg-blue-950/20">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{agent.name}</p>
                      <p className="text-sm text-muted-foreground font-normal">{agent.email}</p>
                    </div>
                    <Badge variant="secondary">{leads.length} leads</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  {leads.length > 0 ? (
                    <div className="space-y-3">
                      {leads.map((lead) => (
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
            );
          })}
        </div>
      )}
    </div>
  )
}

export default SalesAgentView