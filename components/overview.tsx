"use client"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
 interface OverviewProps {
    data: any[];
}

export const Overview: React.FC<OverviewProps> = ({data}) => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart
                data={data}
            >
                <XAxis 
                    dataKey="name" 
                    stroke="#888878" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                />
                <YAxis 
                    stroke="#888878"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}€`}
                />
                <Bar dataKey="total" fill="#1487" radius={[4,4,0,0]} />
            </BarChart>
        </ResponsiveContainer>
    )
}