import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const API_BASE_URL = 'https://crm-backend-beta-two.vercel.app';

const SalesManagement = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

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
        await fetchAgents();
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sales Management</h1>
          <p className="text-muted-foreground mt-1">Manage your sales agents</p>
        </div>
        <Button 
          onClick={() => navigate('/addagent')}
          className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 dark:from-blue-500 dark:to-cyan-500"
        >
          <Users className="h-4 w-4" />
          Add New Agent
        </Button>
      </div>

      <Separator />

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
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                      <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{agent.name}</h3>
                      <p className="text-sm text-muted-foreground">{agent.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
              <CardContent className="flex flex-col items-center justify-center p-12">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No agents found</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Add a new sales agent to get started
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}

export default SalesManagement