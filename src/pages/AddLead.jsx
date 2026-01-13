import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft } from "lucide-react"

const AddLead = () => {
  const [name, setName] = useState('');
  const [source, setSource] = useState('');
  const [salesAgent, setSalesAgent] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [timeToClose, setTimeToClose] = useState('');
  const [tags, setTags] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  const sourceOptions = ['Website', 'Referral', 'Cold Call', 'Advertisement', 'Email', 'Other'];
  const statusOptions = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Closed'];
  const priorityOptions = ['High', 'Medium', 'Low'];
  const tagOptions = ['High Value', 'Follow-up'];

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await fetch('https://crm-backend-beta-two.vercel.app/agents');
        const data = await res.json();
        console.log(data?.data);
        setAgents(data?.data || []);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchAgents();
  }, []);

  const handleTagToggle = (tag) => {
    setTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !source || !salesAgent || !timeToClose) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('https://crm-backend-beta-two.vercel.app/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          source,
          salesAgent,
          status: status || 'New',
          tags,
          timeToClose: parseInt(timeToClose),
          priority: priority || 'Medium',
        }),
      });

      const result = await res.json();

      if (res.ok) {
        toast({
          title: "Success",
          description: "Lead created successfully",
        });
        navigate('/');
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to create lead",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)}
        className="gap-2 mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Add New Lead</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Lead Name *</Label>
              <Input
                placeholder="Enter lead name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Lead Source *</Label>
              <Select value={source} onValueChange={setSource}>
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  {sourceOptions.map((src) => (
                    <SelectItem key={src} value={src}>
                      {src}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Sales Agent *</Label>
              <Select value={salesAgent} onValueChange={setSalesAgent}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sales agent" />
                </SelectTrigger>
                <SelectContent>
                  {agents.map((agent) => (
                    <SelectItem key={agent._id} value={agent._id}>
                      {agent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Lead Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="New (default)" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((stat) => (
                    <SelectItem key={stat} value={stat}>
                      {stat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Medium (default)" />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((pri) => (
                    <SelectItem key={pri} value={pri}>
                      {pri}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Time to Close (days) *</Label>
              <Input
                type="number"
                placeholder="Enter number of days"
                value={timeToClose}
                onChange={(e) => setTimeToClose(e.target.value)}
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                {tagOptions.map((tag) => (
                  <Button
                    key={tag}
                    type="button"
                    variant={tags.includes(tag) ? "default" : "outline"}
                    onClick={() => handleTagToggle(tag)}
                    className="flex-1"
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Lead'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default AddLead
