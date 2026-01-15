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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch('https://crm-backend-beta-two.vercel.app/leads');
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
    try {
      if (status === '' || status === 'all') {
        setLeads(allLeads);
      } else {
        setLeads(allLeads.filter(lead => lead.status === status));
      }
    } catch (error) {
      console.log(error.message);
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

  const getPriorityColor = (priority) => {
    const colors = {
      High: 'destructive',
      Medium: 'default',
      Low: 'secondary'
    };
    return colors[priority] || 'default';
  };

  const manageRoute = (id) => {
    navigate(`/leadmanagement/${id}`);
  };

  const statCards = [
    { label: 'New', count: statusCounts.New, icon: Users, gradient: 'bg-gradient-to-br from-blue-500 to-blue-700', iconBg: 'bg-blue-400/20' },
    { label: 'Contacted', count: statusCounts.Contacted, icon: TrendingUp, gradient: 'bg-gradient-to-br from-yellow-500 to-yellow-700', iconBg: 'bg-yellow-400/20' },
    { label: 'Qualified', count: statusCounts.Qualified, icon: CheckCircle, gradient: 'bg-gradient-to-br from-purple-500 to-purple-700', iconBg: 'bg-purple-400/20' },
    { label: 'Proposal Sent', count: statusCounts['Proposal Sent'], icon: Send, gradient: 'bg-gradient-to-br from-orange-500 to-orange-700', iconBg: 'bg-orange-400/20' },
    { label: 'Closed', count: statusCounts.Closed, icon: XCircle, gradient: 'bg-gradient-to-br from-green-500 to-green-700', iconBg: 'bg-green-400/20' },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 pb-24 sm:pb-6 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
            Leads Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage and track your sales leads
          </p>
        </div>

        <Button
          onClick={() => navigate('/addlead')}
          className="w-full sm:w-auto self-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          Add New Lead
        </Button>
      </div>

      <Separator />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat) => (
          <Card
            key={stat.label}
            className={`${stat.gradient} border-0 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/90">{stat.label}</p>
                  <p className="text-3xl font-bold mt-2">{stat.count}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.iconBg}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Select onValueChange={(value) => setStatus(value === "all" ? "" : value)}>
          <SelectTrigger className="w-full sm:w-[200px]">
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

      {/* Leads */}
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Spinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {leads.length > 0 ? (
            leads.map((lead) => (
              <Card
                key={lead._id}
                onClick={() => manageRoute(lead._id)}
                className="cursor-pointer border-2 hover:border-primary/50 hover:shadow-2xl transition-all bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:scale-[1.02]"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{lead.name}</CardTitle>
                      <CardDescription>Source: {lead.source}</CardDescription>
                    </div>
                    <Badge variant={getPriorityColor(lead.priority)}>
                      {lead.priority}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(lead.status)}`} />
                    <span className="text-sm font-medium">{lead.status}</span>
                  </div>

                  {lead.tags?.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {lead.tags.map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="text-sm text-muted-foreground pt-2">
                    ⏱️ {lead.timeToClose} days
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center p-12">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No leads found</p>
                <p className="text-sm text-muted-foreground">
                  Try adjusting filters or add a new lead
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}

export default Home
