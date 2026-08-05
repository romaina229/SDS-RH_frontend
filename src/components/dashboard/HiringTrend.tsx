//import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import Card from '../common/Card';

interface HiringTrendProps {
    data?: {
        month: string;
        count: number;
    }[];
}

const HiringTrend = ({ data }: HiringTrendProps) => {
    if (!data || data.length === 0) {
        return (
            <Card title="Évolution des embauches">
                <div className="h-64 flex items-center justify-center text-gray-500">
                    Aucune donnée disponible
                </div>
            </Card>
        );
    }

    return (
        <Card title="Évolution des embauches (6 derniers mois)">
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#6366f1" name="Embauches" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

export default HiringTrend;