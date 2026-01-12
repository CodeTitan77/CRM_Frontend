import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Users, Filter, ArrowUpDown } from "lucide-react"

const LeadList = () => {
  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [salesFilter, setSalesFilter] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [time, setTime] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:7777/leads');
        const res2 = await fetch('http://localhost:7777/agents');
        const results = await res.json();
        const agentsData = await res2.json();
        
        setLeads(results?.data || []);
        setAgents(agentsData?.data || []);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLeads([]);
        setAgents([]);
        setLoading(false);
      }
    }
    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl = "http://localhost:7777/leads"
        const params = new URLSearchParams()

        if (status) params.append("status", status)
        if (salesFilter) params.append("salesAgent", salesFilter)

        const res = await fetch(`${baseUrl}?${params.toString()}`)
        const data = await res.json();
        let leadArray = data?.data || [];

        if (time) {
          leadArray = [...leadArray].sort(
            (a, b) => b.timeToClose - a.timeToClose
          )
        }

        if (priority) {
          const priorityOrder = {
            High: 0,
            Medium: 1,
            Low: 2,
          }

          leadArray = [...leadArray].sort(
            (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
          )
        }

        setLeads(leadArray)
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchData();
  }, [status, salesFilter, priority, time]);

  const getStatusColor = (status) => {
    const colors = {
      'New': 'bg-blue-500',
      'Contacted': 'bg-yellow-500',
      'Qualified': 'bg-emerald-500',
      'Proposal Sent': 'bg-orange-500',
      'Closed': 'bg-green-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'High': 'destructive',
      'Medium': 'default',
      'Low': 'secondary'
    };
    return colors[priority] || 'default';
  };

  const manageRoute = (id) => {
    navigate(`/leadmanagement/${id}`);
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Leads List</h1>
          <p className="text-muted-foreground mt-1">
            Total {leads.length} leads
          </p>
        </div>
        <Button 
          onClick={() => navigate('/addlead')} 
          className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 dark:from-blue-500 dark:to-cyan-500"
        >
          Add New Lead
        </Button>
      </div>

      <Separator />

      
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Filters Section */}
            <div className="lg:col-span-2 space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Select value={status} onValueChange={(value) => setStatus(value === "all" ? "" : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
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

                <Select value={salesFilter} onValueChange={(value) => setSalesFilter(value === "all" ? "" : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sales Agent" />
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
            </div>

            <Separator orientation="vertical" className="hidden lg:block" />
            <div className="lg:col-span-2 space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <ArrowUpDown className="h-4 w-4" />
                <span>Sort by</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Select value={priority} onValueChange={(value) => setPriority(value === "none" ? "" : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Sort</SelectItem>
                    <SelectItem value="true">Priority</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={time} onValueChange={(value) => setTime(value === "none" ? "" : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Time to Close" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Sort</SelectItem>
                    <SelectItem value="true">Time to Close</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Spinner />
        </div>
      ) : (
        <div className="space-y-3">
          {leads && leads.length > 0 ? (
            leads.map((lead) => (
              <Card 
                key={lead._id} 
                onClick={() => manageRoute(lead._id)}
                className="hover:shadow-lg transition-all cursor-pointer border-l-4"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold truncate">{lead.name}</h3>
                        <Badge variant={getPriorityColor(lead.priority)} className="shrink-0">
                          {lead.priority}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(lead.status)}`}></div>
                          <span>{lead.status}</span>
                        </div>
                        
                        <Separator orientation="vertical" className="h-4" />
                        
                        <span>Agent: {lead?.salesAgent?.name || 'N/A'}</span>
                        
                        <Separator orientation="vertical" className="h-4" />
                        
                        <span>Source: {lead.source}</span>
                        
                        <Separator orientation="vertical" className="h-4" />
                        
                        <span>⏱️ {lead.timeToClose} days</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
              <CardContent className="flex flex-col items-center justify-center p-12">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No leads found</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Try adjusting your filters or add a new lead
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}

export default LeadList