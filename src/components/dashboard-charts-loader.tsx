"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const DashboardCharts = dynamic(() => import('@/components/dashboard-charts'), {
  ssr: false,
  loading: () => (
    <>
      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle className="font-headline">Revenue & Profit Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Orders by Status</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center">
          <Skeleton className="h-[250px] w-[250px] rounded-full" />
        </CardContent>
      </Card>
    </>
  )
});

export default function DashboardChartsLoader() {
  return <DashboardCharts />;
}
