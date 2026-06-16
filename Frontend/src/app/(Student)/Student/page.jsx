"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardStats } from "@/features/student/StudentThunk";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  GraduationCap,
  BookOpen,
  Building2,
  Layers,
  Users,
  ArrowUpRight,
  Loader2,
} from "lucide-react";

const COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b"];

export default function DashboardPage() {
  const dispatch = useDispatch();
  const dashboard = useSelector((s) => s.student.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  /* ──────────── Stat cards ──────────── */
  const cards = [
    {
      title: "Total Students",
      value: dashboard.studentCount,
      icon: <Users size={24} />,
      color: "bg-indigo-500/10 text-indigo-600 border-indigo-200",
      iconBg: "bg-indigo-500/20",
    },
    {
      title: "Total Classes",
      value: dashboard.classCount,
      icon: <Building2 size={24} />,
      color: "bg-violet-500/10 text-violet-600 border-violet-200",
      iconBg: "bg-violet-500/20",
    },
    {
      title: "Total Sections",
      value: dashboard.sectionCount,
      icon: <Layers size={24} />,
      color: "bg-cyan-500/10 text-cyan-600 border-cyan-200",
      iconBg: "bg-cyan-500/20",
    },
    {
      title: "Total Subjects",
      value: dashboard.subjectCount,
      icon: <BookOpen size={24} />,
      color: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
      iconBg: "bg-emerald-500/20",
    },
    {
      title: "Total Admissions",
      value: dashboard.admissionCount,
      icon: <GraduationCap size={24} />,
      color: "bg-amber-500/10 text-amber-600 border-amber-200",
      iconBg: "bg-amber-500/20",
    },
  ];

  /* ──────────── Chart data ──────────── */
  const barData = [
    { name: "Students", count: dashboard.studentCount },
    { name: "Classes", count: dashboard.classCount },
    { name: "Sections", count: dashboard.sectionCount },
    { name: "Subjects", count: dashboard.subjectCount },
    { name: "Admissions", count: dashboard.admissionCount },
  ];

  const pieData = [
    { name: "Students", value: dashboard.studentCount || 1 },
    { name: "Classes", value: dashboard.classCount || 1 },
    { name: "Sections", value: dashboard.sectionCount || 1 },
    { name: "Subjects", value: dashboard.subjectCount || 1 },
    { name: "Admissions", value: dashboard.admissionCount || 1 },
  ];

  if (dashboard.loading && !dashboard.classCount) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={32} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Overview of your student management system
        </p>
      </div>

      {/* ─────────────── Stat Cards ─────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-card border border-border rounded-2xl shadow-sm p-5 hover:shadow-md transition"
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className={`p-2.5 rounded-xl ${card.color.split(" ")[0]} ${
                  card.color.split(" ")[1]
                }`}
              >
                {card.icon}
              </div>
              <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                Total <ArrowUpRight size={12} />
              </span>
            </div>
            <div className="text-3xl font-bold text-foreground">
              {card.value}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {card.title}
            </div>
          </div>
        ))}
      </div>

      {/* ─────────────── Charts ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Bar Chart */}
        <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Overview by Category
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Bar
                  dataKey="count"
                  fill="hsl(var(--primary))"
                  radius={[6, 6, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Distribution
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Legend
                  wrapperStyle={{
                    fontSize: "12px",
                    color: "hsl(var(--muted-foreground))",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ─────────────── Quick Links ─────────────── */}
      <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link
            href="/Student/Setup/Class"
            className="flex items-center gap-3 p-4 rounded-xl bg-indigo-500/5 border border-indigo-200 hover:bg-indigo-500/10 transition group"
          >
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-600">
              <Building2 size={20} />
            </div>
            <div>
              <div className="font-medium text-sm text-foreground group-hover:text-indigo-600 transition">
                Manage Classes
              </div>
              <div className="text-xs text-muted-foreground">
                {dashboard.classCount} classes
              </div>
            </div>
          </Link>

          <Link
            href="/Student/Setup/Section"
            className="flex items-center gap-3 p-4 rounded-xl bg-violet-500/5 border border-violet-200 hover:bg-violet-500/10 transition group"
          >
            <div className="p-2 rounded-lg bg-violet-500/20 text-violet-600">
              <Layers size={20} />
            </div>
            <div>
              <div className="font-medium text-sm text-foreground group-hover:text-violet-600 transition">
                Manage Sections
              </div>
              <div className="text-xs text-muted-foreground">
                {dashboard.sectionCount} sections
              </div>
            </div>
          </Link>

          <Link
            href="/Student/Setup/Subject"
            className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-200 hover:bg-emerald-500/10 transition group"
          >
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-600">
              <BookOpen size={20} />
            </div>
            <div>
              <div className="font-medium text-sm text-foreground group-hover:text-emerald-600 transition">
                Manage Subjects
              </div>
              <div className="text-xs text-muted-foreground">
                {dashboard.subjectCount} subjects
              </div>
            </div>
          </Link>

          <Link
            href="/Student/Admission"
            className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-200 hover:bg-amber-500/10 transition group"
          >
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-600">
              <GraduationCap size={20} />
            </div>
            <div>
              <div className="font-medium text-sm text-foreground group-hover:text-amber-600 transition">
                New Admission
              </div>
              <div className="text-xs text-muted-foreground">
                {dashboard.admissionCount} admitted
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}