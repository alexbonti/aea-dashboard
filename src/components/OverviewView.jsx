import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { DollarSign, FileText, TrendingUp, Award } from 'lucide-react';
import data from '../data/funding_data.json';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#6366f1', '#14b8a6', '#f43f5e'];

const formatCurrency = (value) =>
    new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(value);

const MetricCard = ({ title, value, subtext, icon: Icon, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.4 }}
        className="bg-card border border-border p-6 rounded-xl shadow-lg hover:shadow-blue-500/10 transition-all group"
    >
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-sm text-muted-foreground font-medium">{title}</p>
                <h3 className="text-2xl font-bold mt-1 text-white group-hover:text-blue-400 transition-colors">{value}</h3>
            </div>
            <div className="p-3 bg-primary/5 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                <Icon className="w-5 h-5 text-blue-400" />
            </div>
        </div>
        {subtext && <p className="text-xs text-muted-foreground">{subtext}</p>}
    </motion.div>
);

export function OverviewView() {
    const chartData = data.institutions
        .filter(i => i.funding > 0)
        .sort((a, b) => b.funding - a.funding)
        .slice(0, 8);

    const clusterData = data.clusters.map(c => ({
        name: c.name.split(' ')[0] + '...', // Shorten for chart
        fullName: c.name,
        value: c.totalFunding
    }));

    const yearlyData = data.yearlyTrends;

    // Calculate dynamic metrics
    const topProgram = [...data.programs].sort((a, b) => b.funding - a.funding)[0];
    const peakYear = [...data.yearlyTrends].sort((a, b) => b.funding - a.funding)[0];
    const totalProjects = data.clusters.reduce((acc, c) => acc + c.projectCount, 0);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Executive Summary</h2>
                <p className="text-muted-foreground mt-2">Strategic overview of the {formatCurrency(data.meta.totalFunding)} research investment portfolio.</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Total Investment"
                    value={formatCurrency(data.meta.totalFunding)}
                    subtext="Allocated across all programs"
                    icon={DollarSign}
                    delay={0}
                />
                <MetricCard
                    title="Total Projects"
                    value={totalProjects.toLocaleString()}
                    subtext={`Across ${data.clusters.length} thematic clusters`}
                    icon={FileText}
                    delay={0.1}
                />
                <MetricCard
                    title="Top Program"
                    value={topProgram?.name || "N/A"}
                    subtext={`${formatCurrency(topProgram?.funding || 0)} allocated`}
                    icon={Award}
                    delay={0.2}
                />
                <MetricCard
                    title="Peak Investment Year"
                    value={peakYear?.year || "N/A"}
                    subtext={`${formatCurrency(peakYear?.funding || 0)} committed`}
                    icon={TrendingUp}
                    delay={0.3}
                />
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Funding by Institution */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-card border border-border rounded-xl p-6 shadow-xl"
                >
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                        Top Funded Institutions
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} layout="vertical" margin={{ left: 30 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    width={150}
                                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                                    interval={0}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                                    formatter={(value) => formatCurrency(value)}
                                />
                                <Bar dataKey="funding" radius={[0, 4, 4, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Yearly Trend */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-card border border-border rounded-xl p-6 shadow-xl"
                >
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                        Investment Trajectory
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={yearlyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="year" tick={{ fill: '#94a3b8' }} />
                                <YAxis tickFormatter={(val) => `$${val / 1000000}M`} tick={{ fill: '#94a3b8' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                                    formatter={(value) => formatCurrency(value)}
                                />
                                <Bar dataKey="funding" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Cluster Distribution */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-card border border-border rounded-xl p-6 shadow-xl"
            >
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
                    Funding by Thematic Cluster
                </h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={clusterData} margin={{ bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} angle={-15} textAnchor="end" height={60} />
                            <YAxis tickFormatter={(val) => `$${val / 1000000}M`} tick={{ fill: '#94a3b8' }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                                formatter={(value) => formatCurrency(value)}
                                labelFormatter={(label, payload) => payload[0]?.payload.fullName}
                            />
                            <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]}>
                                {clusterData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* Program Distribution */}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-card border border-border rounded-xl p-6 shadow-xl"
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                        Investment Portfolio by Program
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-border text-xs uppercase text-muted-foreground tracking-wider">
                                <th className="pb-4 pl-2 font-medium">Program Name</th>
                                <th className="pb-4 font-medium text-right">Projects</th>
                                <th className="pb-4 font-medium text-right">Total Funding</th>
                                <th className="pb-4 font-medium text-right pr-2">Avg. Per Project</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {data.programs.map((program, idx) => (
                                <tr key={idx} className="group hover:bg-white/5 transition-colors">
                                    <td className="py-4 pl-2 font-medium text-sm text-gray-200">{program.name}</td>
                                    <td className="py-4 text-right font-mono text-xs text-muted-foreground">{program.projects}</td>
                                    <td className="py-4 text-right font-mono text-sm text-emerald-400">{formatCurrency(program.funding)}</td>
                                    <td className="py-4 text-right font-mono text-sm text-blue-400 pr-2">{formatCurrency(program.average)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}

