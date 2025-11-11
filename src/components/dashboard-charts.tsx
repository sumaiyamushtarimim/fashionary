"use client";

import { Bar, BarChart, CartesianGrid, XAxis, Pie, PieChart, Cell, Legend } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { revenueData, ordersByStatusData } from "@/lib/placeholder-data";
import { useIsMobile } from "@/hooks/use-mobile";

const chartConfig: ChartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
  profit: {
    label: "Profit",
    color: "hsl(var(--chart-2))",
  },
};

const ordersChartConfig: ChartConfig = {
    new: { label: "New", color: "hsl(var(--chart-1))" },
    processing: { label: "Processing", color: "hsl(var(--chart-2))" },
    completed: { label: "Completed", color: "hsl(var(--chart-5))" },
}

export default function DashboardCharts() {
  const isMobile = useIsMobile();
  const chartData = isMobile ? revenueData.slice(-3) : revenueData;

  return (
    <>
      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle className="font-headline">Revenue & Profit Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
              <Bar dataKey="profit" fill="var(--color-profit)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Orders by Status</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={ordersChartConfig} className="mx-auto aspect-square max-h-[250px]">
              <PieChart>
                  <ChartTooltip content={<ChartTooltipContent nameKey="status" hideLabel />} />
                  <Pie 
                      data={ordersByStatusData} 
                      dataKey="value" 
                      nameKey="status" 
                      innerRadius={isMobile ? 50 : 60}
                      outerRadius={isMobile ? 70: 100}
                  >
                    {ordersByStatusData.map((entry) => (
                      <Cell key={entry.status} fill={entry.fill} />
                    ))}
                  </Pie>
                  {isMobile && <ChartLegend content={<ChartLegendContent />} />}
              </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  );
}
