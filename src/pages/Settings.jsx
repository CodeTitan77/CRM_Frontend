import React, { useEffect, useState } from 'react'
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const Settings = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
     const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:7777/leads');
      const data = await res.json();
      setLeads(data?.data || []);
      setLoading(false);
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  };

    fetchLeads();
  }, []);

 

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:7777/leads/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {

        toast({
          title: "Lead deleted successfully",
        });
         const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:7777/leads');
      const data = await res.json();
      setLeads(data?.data || []);
      setLoading(false);
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  };
        fetchLeads();
      }
    } catch (error) {
      console.log(error.message);
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
        <p className="text-muted-foreground mt-1">Manage your leads</p>
      </div>

      <Separator />

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
                      onClick={() => handleDelete(lead._id)}
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
  )
}

export default Settings