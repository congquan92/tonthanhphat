import { Package, Users, ShoppingCart, DollarSign, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { stats, recentOrders } from "@/app/admin/data";

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">Tổng quan</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Chào mừng trở lại! Đây là những gì đang xảy ra hôm nay.</p>
                </div>
                <Button className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 sm:w-auto">
                    <span>Xem báo cáo</span>
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <Card key={index} className="group relative overflow-hidden rounded-2xl border-0 bg-white shadow-lg shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-slate-800 dark:shadow-slate-900/50">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.title}</p>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                                    <div className={`inline-flex items-center gap-1 text-sm font-medium ${stat.trend === "up" ? "text-emerald-600" : "text-red-500"}`}>
                                        {stat.trend === "up" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                                        <span>{stat.change}</span>
                                        <span className="text-slate-400">so với tháng trước</span>
                                    </div>
                                </div>
                                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                                    <stat.icon className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </CardContent>
                        {/* Decorative gradient */}
                        <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${stat.color} opacity-10 blur-2xl`} />
                    </Card>
                ))}
            </div>

            {/* Recent Orders */}
            <Card className="rounded-2xl border-0 bg-white shadow-lg shadow-slate-200/50 dark:bg-slate-800 dark:shadow-slate-900/50">
                <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-700">
                    <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Đơn hàng gần đây</CardTitle>
                    <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                        Xem tất cả
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-slate-100 dark:divide-slate-700">
                        {recentOrders.map((order, index) => (
                            <div key={index} className="flex items-center justify-between p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-sm font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">{order.id.slice(-3)}</div>
                                    <div>
                                        <p className="font-medium text-slate-900 dark:text-white">{order.customer}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{order.product}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="font-semibold text-slate-900 dark:text-white">{order.amount}</p>
                                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${order.statusColor}`}>{order.status}</span>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
