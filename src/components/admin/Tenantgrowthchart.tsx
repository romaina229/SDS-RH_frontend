import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../common/Card';

interface TenantGrowthChartProps {
    data: Array<{ month: string; count: number }>;
}

const TenantGrowthChart = ({ data }: TenantGrowthChartProps) => {
    if (!data || data.length === 0) {
        return (
            <Card title="Nouvelles organisations (6 derniers mois)">
                <div className="h-64 flex items-center justify-center text-gray-500">
                    Aucune donnée disponible
                </div>
            </Card>
        );
    }

    return (
        <Card title="Nouvelles organisations (6 derniers mois)">
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

export default TenantGrowthChart;