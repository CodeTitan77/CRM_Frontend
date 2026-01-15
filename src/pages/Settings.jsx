import React, { useEffect, useState } from 'react'
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Trash2, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const API_BASE_URL = 'https://crm-backend-beta-two.vercel.app';

const Settings = () => {
  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchLeads = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/leads`);
      const data = await res.json();
      setLeads(data?.data || []);
    } catch (error) {
      console.log(error.message);
      toast({
        title: "Error",
        description: "Failed to fetch leads",
        variant: "destructive",
      });
    }
  };

  const fetchAgents = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/agents`);
      const data = await res.json();
      setAgents(data?.data || []);
    } catch (error) {
      console.log(error.message);
      toast({
        title: "Error",
        description: "Failed to fetch agents",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await fetchLeads();
        await fetchAgents();
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteLead = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/leads/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast({
          title: "Lead deleted successfully",
        });
        fetchLeads();
      }
    } catch (error) {
      console.log(error.message);
      toast({
        title: "Error",
        description: "Failed to delete lead",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAgent = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/agents/${id}`, {
        method: 'DELETE',
      });

      const result = await res.json();

      if (res.ok) {
        toast({
          title: "Agent deleted successfully",
        });
        fetchAgents();
      } else {
        toast({
          title: "Cannot delete agent",
          description: result.message || "This agent has leads assigned",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error.message);
      toast({
        title: "Error",
        description: "Failed to delete agent",
        variant: "destructive",
      });
    }
  };

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

  return (
    <div className="container mx-auto p-6 max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your leads and agents</p>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Manage Leads</h2>
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
                  className="hover:shadow-lg transition-all border-l-4"
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

                      <Button 
                        variant="destructive" 
                        size="icon" 
                        className="shrink-0"
                        onClick={() => handleDeleteLead(lead._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                <CardContent className="flex flex-col items-center justify-center p-12">
                  <p className="text-lg font-medium">No leads found</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      <Separator className="my-8" />

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Manage Sales Agents</h2>
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Spinner />
          </div>
        ) : (
          <div className="space-y-3">
            {agents && agents.length > 0 ? (
              agents.map((agent) => (
                <Card 
                  key={agent._id} 
                  className="hover:shadow-lg transition-all border-l-4 border-l-blue-500"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                          <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{agent.name}</h3>
                          <p className="text-sm text-muted-foreground">{agent.email}</p>
                        </div>
                      </div>

                      <Button 
                        variant="destructive" 
                        size="icon" 
                        className="shrink-0"
                        onClick={() => handleDeleteAgent(agent._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                <CardContent className="flex flex-col items-center justify-center p-12">
                  <p className="text-lg font-medium">No agents found</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Settings