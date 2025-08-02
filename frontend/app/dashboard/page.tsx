"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AuthGuard } from "@/components/auth-guard"
import { MainHeader } from "@/components/main-header"
import { useAuth } from "@/contexts/auth-context"
import { api } from "@/lib/api"
import { 
  Ticket, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Users, 
  AlertTriangle,
  MessageSquare,
  Plus,
  Loader2
} from "lucide-react"

interface TicketSummary {
  id: string
  ticket_number: string
  subject: string
  status: string
  priority_name: string
  priority_level: number
  category_name: string
  category_color: string
  created_by_username: string
  assigned_to_username?: string
  created_at: string
  updated_at: string
  comments_count: number
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [tickets, setTickets] = useState<TicketSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total_tickets: 0,
    open_tickets: 0,
    resolved_tickets: 0,
    avg_response_time: "1.2h"
  })

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      // Get tickets using the same API as other pages
      const response = await api.getTickets(new URLSearchParams({ 
        ordering: '-created_at',
        page_size: '20'
      }))
      
      const allTickets = response.results || response
      setTickets(allTickets)
      
      // Calculate stats from the tickets data
      const totalTickets = allTickets.length
      const openTickets = allTickets.filter((t: TicketSummary) => t.status === 'open' || t.status === 'in_progress').length
      const resolvedTickets = allTickets.filter((t: TicketSummary) => t.status === 'resolved').length
      
      setStats({
        total_tickets: totalTickets,
        open_tickets: openTickets,
        resolved_tickets: resolvedTickets,
        avg_response_time: "1.2h"
      })
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60))
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays === 1) return "1 day ago"
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "destructive"
      case "assigned": return "default"
      case "in_progress": return "warning"
      case "waiting_customer": return "secondary"
      case "resolved": return "success"
      case "closed": return "secondary"
      default: return "secondary"
    }
  }

  if (loading) {
    return (
      <AuthGuard>
        <MainHeader />
        <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-32 h-32 bg-[#f9d423]/10 rounded-full floating-3d blur-sm"></div>
            <div className="absolute top-40 right-20 w-24 h-24 bg-[#ff4e50]/10 rounded-full floating-3d" style={{animationDelay: '2s'}}></div>
            <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-[#f9d423]/5 rounded-full floating-3d" style={{animationDelay: '4s'}}></div>
            <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-[#ff4e50]/5 rounded-full floating-3d" style={{animationDelay: '6s'}}></div>
            <div className="absolute bottom-20 right-10 w-28 h-28 bg-[#f9d423]/10 rounded-full floating-3d" style={{animationDelay: '8s'}}></div>
          </div>
          <div className="container mx-auto py-8 relative z-10">
            <div className="flex items-center justify-center h-64">
              <div className="text-center space-y-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#f9d423] border-r-transparent mx-auto"></div>
                <p className="text-white text-lg font-medium">Loading dashboard...</p>
              </div>
            </div>
          </div>
        </div>
      </AuthGuard>
    )
  }
  return (
    <AuthGuard>
      <MainHeader />
      <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] relative overflow-hidden">
        {/* Floating 3D Elements Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-[#f9d423]/10 rounded-full floating-3d blur-sm"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-[#ff4e50]/10 rounded-full floating-3d" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-[#f9d423]/5 rounded-full floating-3d" style={{animationDelay: '4s'}}></div>
          <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-[#ff4e50]/5 rounded-full floating-3d" style={{animationDelay: '6s'}}></div>
          <div className="absolute bottom-20 right-10 w-28 h-28 bg-[#f9d423]/10 rounded-full floating-3d" style={{animationDelay: '8s'}}></div>
        </div>
        
        <div className="container mx-auto py-8 space-y-8 relative z-10">
        {/* Welcome Section */}
        <div className="flex items-center justify-between slide-in-3d">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-lg">Dashboard</h1>
            <p className="text-white/90 drop-shadow-md">
              Welcome back! Here's an overview of your support activity.
            </p>
          </div>
          <Link href="/tickets/new">
            <Button className="bg-gradient-to-r from-[#ff4e50] to-[#f9d423] hover:from-[#f9d423] hover:to-[#ff4e50] text-white font-semibold button-3d bounce-3d">
              <Plus className="h-4 w-4 mr-2" />
              Create New Ticket
            </Button>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="card-3d backdrop-blur-md bg-[#0f2027]/80 border-white/20 glass-3d">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">My Tickets</CardTitle>
              <Ticket className="h-4 w-4 text-[#f9d423]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.total_tickets}</div>
              <p className="text-xs text-white/70">
                Total tickets
              </p>
            </CardContent>
          </Card>
          
          <Card className="card-3d backdrop-blur-md bg-[#0f2027]/80 border-white/20 glass-3d">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Open Issues</CardTitle>
              <AlertTriangle className="h-4 w-4 text-[#f9d423]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.open_tickets}</div>
              <p className="text-xs text-white/70">
                Awaiting response
              </p>
            </CardContent>
          </Card>
          
          <Card className="card-3d backdrop-blur-md bg-[#0f2027]/80 border-white/20 glass-3d">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Resolved</CardTitle>
              <CheckCircle className="h-4 w-4 text-[#f9d423]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.resolved_tickets}</div>
              <p className="text-xs text-white/70">
                Completed
              </p>
            </CardContent>
          </Card>
          
          <Card className="card-3d backdrop-blur-md bg-[#0f2027]/80 border-white/20 glass-3d">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Response Time</CardTitle>
              <Clock className="h-4 w-4 text-[#f9d423]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.avg_response_time}</div>
              <p className="text-xs text-white/70">
                Average response
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Activity */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="card-3d backdrop-blur-md bg-[#0f2027]/80 border-white/20 glass-3d">
              <CardHeader>
                <CardTitle className="text-white">Recent Tickets</CardTitle>
              </CardHeader>
            <CardContent className="space-y-4">
              {tickets.slice(0, 4).map((ticket) => (
                <Link key={ticket.id} href={`/tickets/${ticket.id}`}>
                  <div className="flex items-center justify-between p-4 border border-white/20 rounded-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg card-3d">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-white">{ticket.subject}</p>
                        <Badge 
                          variant={getStatusColor(ticket.status) as any}
                          className="text-xs badge-3d"
                        >
                          {ticket.status.replace("_", " ")}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-3 text-xs text-white/70">
                        <span>{ticket.ticket_number}</span>
                        <span>•</span>
                        <span className="capitalize">{ticket.priority_name} priority</span>
                        <span>•</span>
                        <span>Updated {formatDate(ticket.updated_at)}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {ticket.comments_count > 0 && (
                        <div className="flex items-center text-xs text-white/70">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          {ticket.comments_count}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
              {tickets.length === 0 && (
                <div className="text-center py-8">
                  <Ticket className="h-12 w-12 text-white/60 mx-auto mb-4" />
                  <p className="text-white/70">No tickets found</p>
                </div>
              )}
              <div className="pt-2">
                <Link href="/tickets">
                  <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/10 button-3d">
                    View All Tickets
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="card-3d backdrop-blur-md bg-[#0f2027]/80 border-white/20 glass-3d">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/tickets/new">
                <Button className="w-full justify-start bg-white text-[#ff4e50] hover:bg-white/90 button-3d">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Ticket
                </Button>
              </Link>
              <Link href="/tickets">
                <Button variant="outline" className="w-full justify-start border-white/30 text-white hover:bg-white/10 button-3d">
                  <Ticket className="h-4 w-4 mr-2" />
                  View My Tickets
                </Button>
              </Link>
              <Link href="/knowledge-base">
                <Button variant="outline" className="w-full justify-start border-white/30 text-white hover:bg-white/10 button-3d">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Browse Knowledge Base
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Knowledge Base Articles */}
          <Card className="card-3d backdrop-blur-md bg-[#0f2027]/80 border-white/20 glass-3d">
            <CardHeader>
              <CardTitle className="text-white">Popular Articles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                "How to reset your password",
                "Setting up VPN access",
                "Email troubleshooting guide", 
                "Software installation process",
                "Hardware replacement requests"
              ].map((article, index) => (
                <div key={index} className="p-3 border border-white/20 rounded-lg hover:bg-white/10 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] card-3d">
                  <p className="text-sm text-white">{article}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="card-3d backdrop-blur-md bg-[#0f2027]/80 border-white/20 glass-3d">
            <CardHeader>
              <CardTitle className="text-white">System Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white">Email Service</span>
                <Badge variant="success" className="badge-3d">Operational</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white">VPN Gateway</span>
                <Badge variant="success" className="badge-3d">Operational</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white">File Server</span>
                <Badge variant="warning" className="badge-3d">Maintenance</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white">Support Portal</span>
                <Badge variant="success" className="badge-3d">Operational</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </div>
    </AuthGuard>
  )
}
