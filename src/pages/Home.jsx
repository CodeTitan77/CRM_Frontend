import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Spinner } from "@/components/ui/spinner"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Users, TrendingUp, CheckCircle, Send, XCircle } from "lucide-react"

const Home = () => {
  const [leads, setLeads] = useState([]);
  const [allLeads, setAllLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const navigate=useNavigate();


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:7777/leads');
        const results = await res.json();
        
        setAllLeads(results?.data || []);
        setLeads(results?.data || []);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLeads([]);
        setAllLeads([]);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (status === '' || status === 'all') {
      setLeads(allLeads);
    } else {
      setLeads(allLeads.filter(lead => lead.status === status));
    }
  }, [status, allLeads]);

  const statusCounts = {
    New: allLeads.filter(l => l.status === 'New').length,
    Contacted: allLeads.filter(l => l.status === 'Contacted').length,
    Qualified: allLeads.filter(l => l.status === 'Qualified').length,
    'Proposal Sent': allLeads.filter(l => l.status === 'Proposal Sent').length,
    Closed: allLeads.filter(l => l.status === 'Closed').length,
  };

  const getStatusColor = (status) => {
    const colors = {
      'New': 'bg-gradient-to-r from-blue-500 to-blue-600',
      'Contacted': 'bg-gradient-to-r from-yellow-500 to-yellow-600',
      'Qualified': 'bg-gradient-to-r from-purple-500 to-purple-600',
      'Proposal Sent': 'bg-gradient-to-r from-orange-500 to-orange-600',
      'Closed': 'bg-gradient-to-r from-green-500 to-green-600'
    };
    return colors[status] || 'bg-gray-500';
  };
  const manageRoute=(id)=>{
     navigate(`/leadmanagement/${id}`);
  }

  const getPriorityColor = (priority) => {
    const colors = {
      'High': 'destructive',
      'Medium': 'default',
      'Low': 'secondary'
    };
    return colors[priority] || 'default';
  };

  const statCards = [
    { 
      label: 'New', 
      count: statusCounts.New, 
      icon: Users, 
      gradient: 'bg-gradient-to-br from-blue-500 to-blue-700',
      iconBg: 'bg-blue-400/20'
    },
    { 
      label: 'Contacted', 
      count: statusCounts.Contacted, 
      icon: TrendingUp, 
      gradient: 'bg-gradient-to-br from-yellow-500 to-yellow-700',
      iconBg: 'bg-yellow-400/20'
    },
    { 
      label: 'Qualified', 
      count: statusCounts.Qualified, 
      icon: CheckCircle, 
      gradient: 'bg-gradient-to-br from-purple-500 to-purple-700',
      iconBg: 'bg-purple-400/20'
    },
    { 
      label: 'Proposal Sent', 
      count: statusCounts['Proposal Sent'], 
      icon: Send, 
      gradient: 'bg-gradient-to-br from-orange-500 to-orange-700',
      iconBg: 'bg-orange-400/20'
    },
    { 
      label: 'Closed', 
      count: statusCounts.Closed, 
      icon: XCircle, 
      gradient: 'bg-gradient-to-br from-green-500 to-green-700',
      iconBg: 'bg-green-400/20'
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
            Leads Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">Manage and track your sales leads</p>
        </div>
        <Button onClick={()=>navigate('/addlead')} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          Add New Lead
        </Button>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat) => (
          <Card 
            key={stat.label} 
            className={`${stat.gradient} border-0 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/90">{stat.label}</p>
                  <p className="text-3xl font-bold mt-2 text-white">{stat.count}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.iconBg}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <Select onValueChange={(value) => setStatus(value === "all" ? "" : value)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Select status</SelectLabel>
              <SelectItem value="all">All Leads</SelectItem>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="Contacted">Contacted</SelectItem>
              <SelectItem value="Qualified">Qualified</SelectItem>
              <SelectItem value="Proposal Sent">Proposal Sent</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          Showing {leads.length} of {allLeads.length} leads
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Spinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {leads && leads.length > 0 ? (
            leads.map((lead) => (
              <Card 
               onClick={()=>manageRoute(lead._id)}
                key={lead._id} 
                className="hover:shadow-2xl transition-all cursor-pointer border-2 hover:border-primary/50 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:scale-[1.02]"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-gray-900 dark:text-gray-100">
                        {lead.name}
                      </CardTitle>
                      <CardDescription className="mt-1 text-gray-600 dark:text-gray-400">
                        Source: {lead.source}
                      </CardDescription>
                    </div>
                    <Badge 
                      variant={getPriorityColor(lead.priority)}
                      className="shadow-sm"
                    >
                      {lead.priority}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(lead.status)} shadow-md`}></div>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{lead.status}</span>
                    </div>
                    
                    {lead.tags && lead.tags.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {lead.tags.map((tag, index) => (
                          <Badge 
                            key={index} 
                            variant="outline" 
                            className="text-xs bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 dark:from-blue-950 dark:to-purple-950 dark:border-blue-800"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <span className="text-xs">⏱️</span>
                        {lead.timeToClose} days
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full">
              <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                <CardContent className="flex flex-col items-center justify-center p-12">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No leads found</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Try adjusting your filters or add a new lead
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Home