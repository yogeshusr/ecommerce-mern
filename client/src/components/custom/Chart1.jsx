// //import React from 'react'

// "use client";

// import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

// import {
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "../../components/ui/chart";
// import { Colors } from "../../constants/colors";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "../ui/card";
// import { TrendingUp } from "lucide-react";

// const chartData = [
//   { month: "January", keyboard: 186, mouse: 80, headset: 50 },
//   { month: "February", keyboard: 305, mouse: 200, headset: 50 },
//   { month: "March", keyboard: 237, mouse: 120, headset: 50 },
//   { month: "April", keyboard: 73, mouse: 190, headset: 50 },
//   { month: "May", keyboard: 209, mouse: 130, headset: 50 },
//   { month: "June", keyboard: 214, mouse: 140, headset: 50 },
// ];

// const chartConfig = {
//   keyboard: {
//     label: "Keyboard",
//     color: Colors.customGray,
//   },
//   mouse: {
//     label: "Mouse",
//     color: Colors.customYellow,
//   },
//   headset: {
//     label: "Headset",
//     color: Colors.customIsabelline,
//   },
// };

// const Chart1 = () => {
//   return (
//     <Card classname="flex-1 rounded-xl bg-muted/50 md:min-h-min">
//       <CardHeader>
//         <CardTitle>Bar chart - Multiple</CardTitle>
//         <CardDescription>January - June 2025</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <ChartContainer config={chartConfig}>
//           <BarChart accessibilityLayer data={chartData}>
//             <CartesianGrid vertical={false} />
//             <XAxis
//               dataKey="month"
//               tickLine={false}
//               tickMargin={10}
//               axisLine={false}
//               tickFormatter={(value) => value.slice(0, 3)}
//             />
//             <ChartTooltip content={<ChartTooltipContent />} />
//             <Bar dataKey="keyboard" fill="var(--color keyboard)" radius={4} />
//             <Bar dataKey="mouse" fill="var(--color-mouse)" radius={4} />
//             <Bar dataKey="headset" fill="var(--color-headset)" radius={4} />
//           </BarChart>
//         </ChartContainer>
//         <CardFooter classname="flex-col items-start gap-2 text-sm">
//           <div className="flex gap-2 font-medium leading-none">
//             Trending Up by 5.2% this month <TrendingUp className="h-4 w-4" />
//           </div>
//           <div className="leading-none text-muted-foreground">
//             Showing total visitors for the last 6 months
//           </div>
//         </CardFooter>
//       </CardContent>
//     </Card>
//   );
// };
// export default Chart1;

"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../components/ui/chart";
import { Colors } from "../../constants/colors";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { TrendingUp } from "lucide-react";

// Removed hardcoded data and made it dynamic.
const Chart1 = () => {
  const [chartData, setChartData] = useState([]);
  const [growth, setGrowth] = useState(0);

  useEffect(() => {
    const getMetrics = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/get-metrics", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const { data } = await res.data;

        // Assuming data has monthly data structure like `totalSales` for each month
        const salesData = data.totalSales; // Replace with actual field for your data
        setChartData(salesData);

        // Assuming growth is a percentage change in sales
        setGrowth(data.totalSales.growth || 0); // Replace with actual growth calculation
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getMetrics();
  }, []);

  const chartConfig = {
    keyboard: {
      label: "Keyboard",
      color: Colors.customGray,
    },
    mouse: {
      label: "Mouse",
      color: Colors.customYellow,
    },
    headset: {
      label: "Headset",
      color: Colors.customIsabelline,
    },
  };

  return (
    <Card className="flex-1 rounded-xl bg-muted/50 md:min-h-min">
      <CardHeader>
        <CardTitle>Bar chart - Multiple</CardTitle>
        <CardDescription>January - June 2025</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="keyboard" fill="var(--color-keyboard)" radius={4} />
            <Bar dataKey="mouse" fill="var(--color-mouse)" radius={4} />
            <Bar dataKey="headset" fill="var(--color-headset)" radius={4} />
          </BarChart>
        </ChartContainer>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Trending Up by {growth}% this month <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Showing total visitors for the last 6 months
          </div>
        </CardFooter>
      </CardContent>
    </Card>
  );
};

export default Chart1;
