import React, { useEffect, useState } from 'react'
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList, Pie, PieChart, ResponsiveContainer } from "recharts"
import { Spinner } from "@/components/ui/spinner"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const Reports = () => {
  const [chartData1, setChartData1] = useState([]);
  const [chartData2, setChartData2] = useState([]);
  const [chartData3, setChartData3] = useState([]);
  const [loading, setLoading] = useState(false);

  const chartConfig1 = {
    count: { label: "Leads" },
    pipeline: { label: "Pipeline", color: "hsl(var(--chart-1))" },
    other: { label: "Other", color: "hsl(var(--chart-2))" }
  };

  const chartConfig2 = {
    leads: { label: "Leads", color: "hsl(var(--chart-1))" }
  };

  const chartConfig3 = {
    count: { label: "Leads" },
    new: { label: "New", color: "hsl(var(--chart-1))" },
    contacted: { label: "Contacted", color: "hsl(var(--chart-2))" },
    qualified: { label: "Qualified", color: "hsl(var(--chart-3))" },
    proposal: { label: "Proposal", color: "hsl(var(--chart-4))" },
    closed: { label: "Closed", color: "hsl(var(--chart-5))" }
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);

        const pipelineRes = await fetch('http://localhost:7777/report/pipeline');
        const totalLeadsRes = await fetch('http://localhost:7777/leads');
        const pipelineResult = await pipelineRes.json();
        const totalLeadsResult = await totalLeadsRes.json();

        const pipelineCount = pipelineResult.totalLeadsInPipeline;
        const totalCount = totalLeadsResult?.data?.length || 0;

        setChartData1([
          { name: 'pipeline', count: pipelineCount, fill: "var(--color-pipeline)" },
          { name: 'other', count: totalCount - pipelineCount, fill: "var(--color-other)" }
        ]);

        const agentsRes = await fetch('http://localhost:7777/agents');
        const agentsResult = await agentsRes.json();
        const agents = agentsResult?.data || [];

        const agentLeadsData = [];
        for (const agent of agents) {
          const params = new URLSearchParams();
          params.append('salesAgent', agent._id);
          const res = await fetch(`http://localhost:7777/leads?${params.toString()}`);
          const data = await res.json();
          const count = data?.data?.length || 0;
          
          agentLeadsData.push({
            agent: agent.name,
            leads: count
          });
        }
        setChartData2(agentLeadsData);

        const statuses = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Closed'];
        const configKeys = ['new', 'contacted', 'qualified', 'proposal', 'closed'];
        
        const statusLeadsData = [];
        for (let i = 0; i < statuses.length; i++) {
          const params = new URLSearchParams();
          params.append('status', statuses[i]);
          const res = await fetch(`http://localhost:7777/leads?${params.toString()}`);
          const data = await res.json();
          const count = data?.data?.length || 0;
          
          statusLeadsData.push({
            name: configKeys[i],
            count: count,
            fill: `var(--color-${configKeys[i]})`
          });
        }
        setChartData3(statusLeadsData);

        setLoading(false);
      } catch (error) {
        console.log(error.message);
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-4 md:space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Reports & Analytics</h1>
        <p className="text-muted-foreground mt-1">Visual insights into your leads</p>
      </div>

      <Separator />

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Spinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
              <CardTitle className="text-lg md:text-xl">Pipeline Leads vs Total Leads</CardTitle>
              <CardDescription className="text-sm">Distribution of pipeline and other leads</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
              <ChartContainer 
                config={chartConfig1} 
                className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[250px] md:max-h-[300px]"
              >
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent nameKey="count" hideLabel />} />
                  <Pie data={chartData1} dataKey="count">
                    <LabelList
                      dataKey="name"
                      className="fill-background"
                      stroke="none"
                      fontSize={12}
                      formatter={(value) => chartConfig1[value]?.label}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm pt-4">
              <div className="flex items-center gap-2 leading-none font-medium">
                Active pipeline tracking <TrendingUp className="h-4 w-4" />
              </div>
              <div className="text-muted-foreground leading-none text-center">
                Showing pipeline distribution across all leads
              </div>
            </CardFooter>
          </Card>

          <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
              <CardTitle className="text-lg md:text-xl">Leads by Status</CardTitle>
              <CardDescription className="text-sm">Distribution of leads across different statuses</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
              <ChartContainer 
                config={chartConfig3} 
                className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[250px] md:max-h-[300px]"
              >
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent nameKey="count" hideLabel />} />
                  <Pie data={chartData3} dataKey="count">
                    <LabelList
                      dataKey="name"
                      className="fill-background"
                      stroke="none"
                      fontSize={12}
                      formatter={(value) => chartConfig3[value]?.label}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm pt-4">
              <div className="flex items-center gap-2 leading-none font-medium">
                Sales funnel insights <TrendingUp className="h-4 w-4" />
              </div>
              <div className="text-muted-foreground leading-none text-center">
                Showing lead distribution across pipeline stages
              </div>
            </CardFooter>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Leads by Sales Agent</CardTitle>
              <CardDescription className="text-sm">Number of leads assigned to each agent</CardDescription>
            </CardHeader>
            <CardContent className="p-2 md:p-6">
              <ChartContainer config={chartConfig2} className="h-[300px] md:h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={chartData2}
                    margin={{ top: 20, right: 10, left: 0, bottom: 60 }}
                  >
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="agent" 
                      tickLine={false} 
                      tickMargin={10} 
                      axisLine={false}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      interval={0}
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis 
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11 }}
                    />
                    <ChartTooltip 
                      cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }} 
                      content={<ChartTooltipContent hideLabel />} 
                    />
                    <Bar 
                      dataKey="leads" 
                      fill="var(--color-leads)" 
                      radius={[8, 8, 0, 0]}
                      maxBarSize={60}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm pt-2">
              <div className="flex gap-2 leading-none font-medium">
                Performance tracking by agent <TrendingUp className="h-4 w-4" />
              </div>
              <div className="text-muted-foreground leading-none">
                Showing total leads assigned to each sales agent
              </div>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}

export default Reports