import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Spinner } from "@/components/ui/spinner"
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Edit2, Save, X, User, Calendar, TrendingUp, Target, Clock, MessageSquare } from "lucide-react"

const LeadManagement = () => {
  const [lead, setLead] = useState({});
  const { leadId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [agents, setAgents] = useState([]);
  const [newSales, setNewSales] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [newPriority, setNewPriority] = useState('');
  const [newTimeToClose, setNewTimeToClose] = useState('');
  const [comments, setComments] = useState([]);
  const [newCom, setnewCom] = useState(false);
  const [text, setText] = useState("");
  const [author, setAuthor] = useState('');

  const statusOptions = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Closed'];
  const priorityOptions = ['High', 'Medium', 'Low'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:7777/leads/leadId/${leadId}`);
        const res2 = await fetch(`http://localhost:7777/agents`);
        const res3 = await fetch(`http://localhost:7777/leads/comments/${leadId}`);
        const data = await res.json();
        const agentsData = await res2.json();
        const commentsData = await res3.json();
        setComments(commentsData?.data);
        setAgents(agentsData?.data);
        setLead(data?.data);
        setLoading(false);
      } catch(error) {
        console.log(error.message);
        setLoading(false);
      }
    }
    
    fetchData();
  }, [leadId]);

  const UpdateLead = async () => {
    try {
      const updatedLead = {};
      
      if (newPriority !== '') {
        updatedLead.priority = newPriority;
      }
      if (newSales !== '') {
        updatedLead.salesAgent = newSales;
      }
      if (newStatus !== '') {
        updatedLead.status = newStatus;
      }
      if (newTimeToClose !== '') {
        updatedLead.timeToClose = parseInt(newTimeToClose);
      }
      
      const res = await fetch(`http://localhost:7777/leads/${leadId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedLead),
      });
      
      const result = await res.json();
      setLead(result?.data);
      setEdit(false);
      setNewSales('');
      setNewStatus('');
      setNewPriority('');
      setNewTimeToClose('');
    } catch(error) {
      console.log(error.message);
    }
  }

  const manageEdit = () => {
    setEdit(true);
  }

  const manageComment = async () => {
    try {
      const res = await fetch(`http://localhost:7777/leads/comments/${leadId}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ author: author, commentText: text }),
      });

      if (res.ok) {
        setText("");
        setAuthor("");
        const res3 = await fetch(`http://localhost:7777/leads/comments/${leadId}`);
        const commentsData = await res3.json();
        setComments(commentsData?.data);
        setnewCom(false);
      }
    } catch(error) {
      console.log(error.message);
    }
  }

  const getPriorityColor = (priority) => {
    const colors = {
      'High': 'destructive',
      'Medium': 'default',
      'Low': 'secondary'
    };
    return colors[priority] || 'default';
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        
        {!edit && (
          <Button 
            onClick={manageEdit}
            className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 dark:from-blue-500 dark:to-cyan-500"
          >
            <Edit2 className="h-4 w-4" />
            Edit Lead
          </Button>
        )}
      </div>

      <Card className="shadow-xl border-2">
        <CardHeader className="text-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className={` border-0 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105`}>
                {lead.name}
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Lead ID: {leadId}
              </CardDescription>
            </div>
            <Badge variant={getPriorityColor(lead.priority)} className="text-sm px-3 py-1">
              {lead.priority} Priority
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {!edit ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50">
                  <div className="p-2 bg-blue-500 rounded-full">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Sales Agent</p>
                    <p className="text-lg font-semibold">{lead?.salesAgent?.name || 'N/A'}</p>
                    <p className="text-xs text-muted-foreground">{lead?.salesAgent?.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/50 dark:to-emerald-900/50">
                  <div className={`p-2 ${getStatusColor(lead.status)} rounded-full`}>
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="text-lg font-semibold">{lead.status}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50">
                  <div className="p-2 bg-green-500 rounded-full">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Source</p>
                    <p className="text-lg font-semibold">{lead.source}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50">
                  <div className="p-2 bg-orange-500 rounded-full">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time to Close</p>
                    <p className="text-lg font-semibold">{lead.timeToClose} days</p>
                  </div>
                </div>
              </div>

              {lead.tags && lead.tags.length > 0 && (
                <div>
                  <Separator className="my-4" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Tags</p>
                    <div className="flex gap-2 flex-wrap">
                      {lead.tags.map((tag, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 dark:from-blue-950/50 dark:to-cyan-950/50 dark:border-blue-800"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 p-4 rounded-lg border-2 border-dashed border-blue-300 dark:border-blue-800">
                <p className="text-sm font-medium text-center text-blue-900 dark:text-blue-100">
                  Edit Mode - Update Lead Details
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    Sales Agent
                  </label>
                  <Select onValueChange={(value) => setNewSales(value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={lead?.salesAgent?.name || "Select Sales Agent"} />
                    </SelectTrigger>
                    <SelectContent>
                      {agents.map((agent) => (
                        <SelectItem key={agent._id} value={agent._id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{agent.name}</span>
                            <span className="text-xs text-muted-foreground">{agent.email}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    Status
                  </label>
                  <Select onValueChange={(value) => setNewStatus(value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={lead.status || "Select Status"} />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(status)}`}></div>
                            {status}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Target className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    Priority
                  </label>
                  <Select onValueChange={(value) => setNewPriority(value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={lead.priority || "Select Priority"} />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map((priority) => (
                        <SelectItem key={priority} value={priority}>
                          {priority}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    Time to Close (days)
                  </label>
                  <Input
                    type="number"
                    placeholder={lead.timeToClose?.toString() || "Enter days"}
                    value={newTimeToClose}
                    onChange={(e) => setNewTimeToClose(e.target.value)}
                    min="1"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={UpdateLead}
                  className="flex-1 gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 dark:from-green-500 dark:to-emerald-500"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setEdit(false);
                    setNewSales('');
                    setNewStatus('');
                    setNewPriority('');
                    setNewTimeToClose('');
                  }}
                  className="flex-1 gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Comments Section
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {
            (comments.length > 0) ? (
              <div className="space-y-3">
                {
                  comments.map((com) => (
                    <Card key={com._id} className="p-4">
                      <p className="font-medium">{com.author.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">{com.commentText}</p>
                    </Card>
                  ))
                }
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No comments available</p>
            )
          }

          <Button onClick={() => setnewCom(true)} className="w-full">
            Add Comment
          </Button>

          {
            newCom && (
              <div className="space-y-3 p-4 border rounded-lg">
                <Select onValueChange={(value) => setAuthor(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Author" />
                  </SelectTrigger>
                  <SelectContent>
                    {agents.map((agent) => (
                      <SelectItem key={agent._id} value={agent._id}>
                        {agent.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input 
                  placeholder="Add your comment"
                  value={text}
                  onChange={(e) => setText(e.target.value)} 
                />

                <Button onClick={() => manageComment()}>
                  Save Comment
                </Button>
              </div>
            )
          }
        </CardContent>
      </Card>
    </div>
  )
}

export default LeadManagement