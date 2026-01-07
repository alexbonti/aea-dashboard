import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, DollarSign, Filter } from 'lucide-react';
import data from '../data/funding_data.json';

const formatCurrency = (value) =>
    new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(value);

export function ClusterView({ clusterName }) {
    const cluster = data.clusters.find(c => c.name === clusterName);
    const [searchTerm, setSearchTerm] = useState('');
    const [programFilter, setProgramFilter] = useState('all');
    const [uniFilter, setUniFilter] = useState('all');
    const [yearFilter, setYearFilter] = useState('all');

    if (!cluster) return <div>Cluster not found</div>;

    // Get unique values for filters
    const programs = ['all', ...new Set(cluster.projects.map(p => p.program))];
    const universities = ['all', ...new Set(cluster.projects.map(p => p.university))].sort();
    const years = ['all', ...new Set(cluster.projects.map(p => p.year))].sort();

    const filteredProjects = cluster.projects.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.recipient.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesProgram = programFilter === 'all' || p.program === programFilter;
        const matchesUni = uniFilter === 'all' || p.university === uniFilter;
        const matchesYear = yearFilter === 'all' || p.year === yearFilter;

        return matchesSearch && matchesProgram && matchesUni && matchesYear;
    });

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-border rounded-xl p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">{cluster.name}</h2>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">{cluster.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                    <div className="bg-background/40 p-4 rounded-lg backdrop-blur-sm">
                        <p className="text-xs text-gray-400">Total Investment</p>
                        <p className="text-xl md:text-2xl font-bold text-white">{formatCurrency(cluster.totalFunding)}</p>
                    </div>
                    <div className="bg-background/40 p-4 rounded-lg backdrop-blur-sm">
                        <p className="text-xs text-gray-400">Projects</p>
                        <p className="text-xl md:text-2xl font-bold text-white">{cluster.projectCount}</p>
                    </div>
                    <div className="bg-background/40 p-4 rounded-lg backdrop-blur-sm">
                        <p className="text-xs text-gray-400">Avg. Funding</p>
                        <p className="text-xl md:text-2xl font-bold text-white">{formatCurrency(cluster.totalFunding / cluster.projectCount)}</p>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="space-y-4 px-1 md:px-0">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search projects, recipients, or keywords..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2.5 md:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    />
                </div>

                <div className="flex overflow-x-auto pb-2 -mx-1 md:mx-0 px-1 md:px-0 scrollbar-hide gap-3">
                    <div className="flex shrink-0 items-center gap-2 bg-card border border-border px-3 py-1.5 rounded-lg">
                        <Filter className="w-3.5 h-3.5 text-blue-400" />
                        <select
                            value={programFilter}
                            onChange={(e) => setProgramFilter(e.target.value)}
                            className="bg-transparent text-xs text-gray-300 focus:outline-none cursor-pointer"
                        >
                            <option value="all">All Programs</option>
                            {programs.filter(p => p !== 'all').map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 bg-card border border-border px-3 py-1.5 rounded-lg">
                        <MapPin className="w-3.5 h-3.5 text-blue-400" />
                        <select
                            value={uniFilter}
                            onChange={(e) => setUniFilter(e.target.value)}
                            className="bg-transparent text-xs text-gray-300 focus:outline-none cursor-pointer max-w-[150px] md:max-w-[200px]"
                        >
                            <option value="all">All Institutions</option>
                            {universities.filter(u => u !== 'all').map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 bg-card border border-border px-3 py-1.5 rounded-lg">
                        <DollarSign className="w-3.5 h-3.5 text-blue-400" />
                        <select
                            value={yearFilter}
                            onChange={(e) => setYearFilter(e.target.value)}
                            className="bg-transparent text-xs text-gray-300 focus:outline-none cursor-pointer"
                        >
                            <option value="all">All Years</option>
                            {years.filter(y => y !== 'all').map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>

                    {(searchTerm || programFilter !== 'all' || uniFilter !== 'all' || yearFilter !== 'all') && (
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setProgramFilter('all');
                                setUniFilter('all');
                                setYearFilter('all');
                            }}
                            className="shrink-0 text-xs text-blue-400 hover:text-blue-300 transition-colors px-2"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>


            {/* Project Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProjects.map((project, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-card border border-border p-4 md:p-5 rounded-lg hover:border-blue-500/50 hover:bg-blue-900/10 transition-all group flex flex-col h-full"
                    >
                        <div className="flex justify-between items-start gap-4 mb-3">
                            <div className="flex flex-col gap-1">
                                <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] rounded uppercase font-bold border border-blue-500/20 w-fit">
                                    {project.program}
                                </span>
                                <span className="text-[10px] text-muted-foreground font-mono">
                                    Year: {project.year}
                                </span>
                            </div>
                            <span className="font-mono text-emerald-400 font-bold text-sm">
                                {formatCurrency(project.funding)}
                            </span>
                        </div>

                        <h3 className="font-semibold text-white text-sm md:text-base mb-2 line-clamp-2 group-hover:text-blue-300 transition-colors">
                            {project.title}
                        </h3>

                        <div className="space-y-1.5 mb-4">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <MapPin className="w-3 h-3 text-blue-400" />
                                <span className="text-gray-300 line-clamp-1">{project.university}</span>
                            </div>
                            {project.recipient && (
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <div className="w-3 h-3 flex items-center justify-center">
                                        <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                                    </div>
                                    <span className="text-purple-300/80 line-clamp-1">{project.recipient}</span>
                                </div>
                            )}
                        </div>

                        <p className="text-xs md:text-sm text-muted-foreground line-clamp-3 mt-auto">
                            {project.summary}
                        </p>
                    </motion.div>

                ))}
            </div>

            {filteredProjects.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                    No projects found
                </div>
            )}
        </div>
    );
}
