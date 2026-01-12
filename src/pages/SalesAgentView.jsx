import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Users } from "lucide-react"

const SalesAgentView = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:7777/agents');
        const data = await res.json();
        setAgents(data?.data || []);
        setLoading(false);
      } catch (error) {
        console.log(error.message);
        setAgents([]);
        setLoading(false);
      }
    };
    fetchAgents();
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Sales Agent Management</h1>
        <p className="text-muted-foreground mt-1">
          Total {agents.length} agents
        </p>
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
              <Card key={agent._id} className="hover:shadow-lg transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                      <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
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
                  Add a new agent to get started
                </p>
              </CardContent>
            </Card>
          )}

          <Button 
            onClick={() => navigate('/addagent')} 
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 dark:from-blue-500 dark:to-cyan-500"
          >
            Add New Agent
          </Button>
        </div>
      )}
    </div>
  )
}

export default SalesAgentView
