import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import Card from '../common/Card';

const COLORS = ['#9ca3af', '#6366f1', '#3b82f6', '#10b981', '#f59e0b'];

const PLAN_LABELS: Record<string, string> = {
    gratuit: 'Gratuit',
    starter: 'Starter',
    standard: 'Standard',
    business: 'Business',
    enterprise: 'Enterprise',
};

interface PlanDistributionChartProps {
    data: Array<{ plan: string; count: number }>;
}

const PlanDistributionChart = ({ data }: PlanDistributionChartProps) => {
    const formatted = (data || []).map((item) => ({
        name: PLAN_LABELS[item.plan] || item.plan,
        count: item.count,
    }));

    if (formatted.length === 0) {
        return (
            <Card title="Répartition par formule">
                <div className="h-64 flex items-center justify-center text-gray-500">
                    Aucune donnée disponible
                </div>
            </Card>
        );
    }

    return (
        <Card title="Répartition par formule d'abonnement">
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={formatted}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="count"
                            label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                        >
                            {formatted.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

export default PlanDistributionChart;