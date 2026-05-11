import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Play, Download, Eye, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];

export default function RadioAnalytics() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [topEpisodes, setTopEpisodes] = useState<any[]>([]);
  const [growthData, setGrowthData] = useState<any[]>([]);
  const [eventTypeData, setEventTypeData] = useState<any[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);

      // Get overall stats
      const { data: analyticsData } = await supabase
        .from('radio_analytics')
        .select('*');

      const totalPlays = analyticsData?.filter(a => a.event_type === 'play').length || 0;
      const totalDownloads = analyticsData?.filter(a => a.event_type === 'download').length || 0;
      const totalViews = analyticsData?.filter(a => a.event_type === 'view').length || 0;

      setStats({
        totalPlays,
        totalDownloads,
        totalViews,
        totalEvents: analyticsData?.length || 0
      });

      // Get top episodes
      const { data: episodes } = await supabase
        .from('radio_episodes')
        .select('*')
        .eq('is_published', true);

      const episodeStats = await Promise.all(
        (episodes || []).map(async (ep) => {
          const { data } = await supabase
            .from('radio_analytics')
            .select('*')
            .eq('episode_id', ep.id);

          return {
            title: ep.title,
            plays: data?.filter(a => a.event_type === 'play').length || 0,
            downloads: data?.filter(a => a.event_type === 'download').length || 0,
            views: data?.filter(a => a.event_type === 'view').length || 0
          };
        })
      );

      setTopEpisodes(episodeStats.sort((a, b) => b.plays - a.plays).slice(0, 10));

      // Get growth data (last 30 days)
      const last30Days = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return date.toISOString().split('T')[0];
      });

      const growth = last30Days.map(date => {
        const dayData = analyticsData?.filter(a => 
          a.created_at.startsWith(date)
        ) || [];

        return {
          date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          plays: dayData.filter(a => a.event_type === 'play').length,
          downloads: dayData.filter(a => a.event_type === 'download').length,
          views: dayData.filter(a => a.event_type === 'view').length
        };
      });

      setGrowthData(growth);

      // Event type distribution
      setEventTypeData([
        { name: 'Plays', value: totalPlays },
        { name: 'Downloads', value: totalDownloads },
        { name: 'Views', value: totalViews }
      ]);

    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Plays</CardTitle>
            <Play className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalPlays || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
            <Download className="h-4 w-4 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalDownloads || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalViews || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalEvents || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="growth" className="w-full">
        <TabsList>
          <TabsTrigger value="growth">Growth Over Time</TabsTrigger>
          <TabsTrigger value="top">Top Episodes</TabsTrigger>
          <TabsTrigger value="distribution">Event Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="growth">
          <Card>
            <CardHeader>
              <CardTitle>30-Day Activity Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="plays" stroke="#8b5cf6" strokeWidth={2} />
                  <Line type="monotone" dataKey="downloads" stroke="#ec4899" strokeWidth={2} />
                  <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="top">
          <Card>
            <CardHeader>
              <CardTitle>Most Popular Episodes</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={topEpisodes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="title" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="plays" fill="#8b5cf6" />
                  <Bar dataKey="downloads" fill="#ec4899" />
                  <Bar dataKey="views" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution">
          <Card>
            <CardHeader>
              <CardTitle>Event Type Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={eventTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {eventTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
