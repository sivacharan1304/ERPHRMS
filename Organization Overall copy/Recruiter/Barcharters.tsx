import React from 'react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

type Props = {}

const data = [
    {
        label: "Jan",
        Applications: 4000,
        Shortlisted: 2400,
        Rejected: 2000,
        amt: 2400
    },
    {
        label: "Feb",
        Applications: 3000,
        Shortlisted: 1398,
        Rejected: 7000,
        amt: 2210
    },
    {
        label: "Mar",
        Applications: 2000,
        Shortlisted: 9800,
        Rejected: 3000,
        amt: 2290
    },
    {
        label: "Apr",
        Applications: 2780,
        Shortlisted: 3908,
        Rejected: 5000,
        amt: 2000
    },
    {
        label: "May",
        Applications: 1890,
        Shortlisted: 4800,
        Rejected: 3000,
        amt: 2181
    },
    {
        label: "Jun",
        Applications: 2390,
        Shortlisted: 3800,
        Rejected: 6000,
        amt: 2500
    },
    {
        label: "Jul",
        Applications: 3490,
        Shortlisted: 4300,
        Rejected: 2000,
        amt: 2100
    },
    {
        label: "Aug",
        Applications: 4000,
        Shortlisted: 2400,
        Rejected: 7000,
        amt: 2400
    },
    {
        label: "Sep",
        Applications: 3000,
        Shortlisted: 1398,
        Rejected: 8000,
        amt: 2210
    },
    {
        label: "Oct",
        Applications: 2000,
        Shortlisted: 9800,
        Rejected: 9000,
        amt: 2290
    },
    {
        label: "Nov",
        Applications: 2780,
        Shortlisted: 3908,
        Rejected: 1000,
        amt: 2000
    },
    {
        label: "Dec",
        Applications: 1890,
        Shortlisted: 4800,
        Rejected: 500,
        amt: 2181
    }
];

const Barcharters = (props: Props) => {
    return (
        <ResponsiveContainer width="100%" height={250}>
            <BarChart className='mb-5'
                width={500}
                height={250}
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5
                }}>

                <XAxis dataKey="label" />
                <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                    height={1} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Applications" fill="#56CCF2" />
                <Bar dataKey="Shortlisted" fill="#30FF6A" />
                <Bar dataKey="Rejected" fill="#FFA600" />
            </BarChart>
        </ResponsiveContainer>
    );
}

export default Barcharters