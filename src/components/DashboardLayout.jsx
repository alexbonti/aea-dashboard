import React, { useState, useEffect } from 'react';
import { LayoutDashboard, PieChart, Activity, Binary, Hammer, Shield, Leaf, Database, Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';
import data from '../data/funding_data.json';

const ICON_MAP = {
    'Health & Medical Technology': Activity,
    'Energy, Environment & Sustainability': Leaf,
    'Agriculture & Food Technology': PieChart,
    'Advanced Manufacturing & Materials': Hammer,
    'Defence, Aerospace, & Security': Shield,
    'Digital Technology, AI, & Data Science': Binary,
    'Mining & Resources': Database,
};

const NAV_ITEMS = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    ...data.clusters.map(cluster => ({
        id: cluster.name,
        label: cluster.name.split(' & ')[0].split(', ')[0], // Simpler labels for nav
        icon: ICON_MAP[cluster.name] || PieChart
    }))
];


export function DashboardLayout({ children, activeView, setActiveView }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDesktopOpen, setIsDesktopOpen] = useState(true);

    // Close mobile sidebar on navigation
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [activeView]);

    return (
        <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
            {/* Mobile Header */}
            <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-card/80 backdrop-blur-md border-b border-border z-30 px-4 flex items-center justify-between">
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    AEA Analytics
                </h1>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 text-muted-foreground hover:text-white"
                >
                    {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </header>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "bg-card border-r border-border transition-all duration-300 flex flex-col z-50 fixed md:relative h-full",
                    // Mobile visibility
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
                    // Desktop width
                    isDesktopOpen ? "w-64" : "w-20"
                )}
            >
                <div className="p-6 hidden md:flex items-center justify-between">
                    {isDesktopOpen ? (
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent truncate">
                            AEA Analytics
                        </h1>
                    ) : (
                        <div className="w-full flex justify-center">
                            <LayoutDashboard className="text-blue-400" />
                        </div>
                    )}
                    <button
                        onClick={() => setIsDesktopOpen(!isDesktopOpen)}
                        className="text-muted-foreground hover:text-white"
                    >
                        {isDesktopOpen ? '«' : '»'}
                    </button>
                </div>

                {/* Mobile sidebar title (since header is hidden by sidebar) */}
                <div className="p-6 md:hidden flex items-center justify-between border-b border-border/50">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        AEA Analytics
                    </h1>
                    <button onClick={() => setIsSidebarOpen(false)}>
                        <X className="w-6 h-6 text-muted-foreground" />
                    </button>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeView === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveView(item.id)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all hover:bg-white/5",
                                    isActive ? "bg-primary/10 text-primary shadow-[0_0_15px_rgba(59,130,246,0.3)]" : "text-muted-foreground"
                                )}
                                title={!isDesktopOpen ? item.label : undefined}
                            >
                                <Icon className={cn("w-5 h-5", isActive ? "text-blue-400" : "text-gray-500")} />
                                {(isDesktopOpen || isSidebarOpen) && <span>{item.label}</span>}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-border">
                    {(isDesktopOpen || isSidebarOpen) && <p className="text-xs text-muted-foreground text-center">Data Source: AEA Project Data</p>}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-background/50 relative pt-16 md:pt-0">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-background to-background pointer-events-none" />
                <div className="relative z-10 p-4 md:p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
