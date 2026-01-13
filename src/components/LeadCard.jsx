import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const LeadCard = ({ lead, onClick }) => {
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
    <Card 
      onClick={onClick}
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
  );
};

export default LeadCard;