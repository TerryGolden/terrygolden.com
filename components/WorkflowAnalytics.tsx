import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Mail, Users, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function WorkflowAnalytics({ workflowId }: { workflowId: string }) {
  const [analytics, setAnalytics] = useState<any>(null);
  const [stepPerformance, setStepPerformance] = useState<any[]>([]);

  useEffect(() => {
    if (workflowId) {
      loadAnalytics();
    }
  }, [workflowId]);

  const loadAnalytics = async () => {
    // Get workflow executions
    const { data: executions } = await supabase
      .from('workflow_executions')
      .select('*')
      .eq('workflow_id', workflowId);

    // Get step analytics
    const { data: steps } = await supabase
      .from('workflow_steps')
      .select('*')
      .eq('workflow_id', workflowId)
      .order('step_order');

    if (executions && steps) {
      const total = executions.length;
      const active = executions.filter(e => e.status === 'active').length;
      const completed = executions.filter(e => e.status === 'completed').length;
      const stopped = executions.filter(e => e.status === 'stopped').length;

      setAnalytics({
        total,
        active,
        completed,
        stopped,
        completionRate: total > 0 ? ((completed / total) * 100).toFixed(1) : 0
      });

      // Calculate step performance
      const stepData = await Promise.all(
        steps.map(async (step) => {
          const { data: stepAnalytics } = await supabase
            .from('workflow_step_analytics')
            .select('*')
            .eq('step_id', step.id);

          const sent = stepAnalytics?.filter(a => a.action === 'sent').length || 0;
          const opened = stepAnalytics?.filter(a => a.action === 'opened').length || 0;
          const clicked = stepAnalytics?.filter(a => a.action === 'clicked').length || 0;

          return {
            name: `Step ${step.step_order + 1}`,
            type: step.step_type,
            sent,
            opened,
            clicked,
            openRate: sent > 0 ? ((opened / sent) * 100).toFixed(1) : 0,
            clickRate: sent > 0 ? ((clicked / sent) * 100).toFixed(1) : 0
          };
        })
      );

      setStepPerformance(stepData);
    }
  };

  if (!analytics) {
    return <div className="text-center py-8">Select a workflow to view analytics</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Subscribers</p>
              <p className="text-2xl font-bold">{analytics.total}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold">{analytics.active}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold">{analytics.completed}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold">{analytics.completionRate}%</p>
            </div>
            <Mail className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Step Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stepPerformance}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sent" fill="#3b82f6" name="Sent" />
            <Bar dataKey="opened" fill="#10b981" name="Opened" />
            <Bar dataKey="clicked" fill="#8b5cf6" name="Clicked" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Engagement Rates by Step</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stepPerformance}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="openRate" stroke="#10b981" name="Open Rate %" />
            <Line type="monotone" dataKey="clickRate" stroke="#8b5cf6" name="Click Rate %" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Step Details</h3>
        <div className="space-y-4">
          {stepPerformance.map((step, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold">{step.name}</p>
                <p className="text-sm text-gray-600 capitalize">{step.type}</p>
              </div>
              <div className="text-right">
                <p className="text-sm">
                  <span className="font-semibold">{step.sent}</span> sent
                  {step.type === 'email' && (
                    <>
                      {' • '}
                      <span className="text-green-600">{step.openRate}%</span> open
                      {' • '}
                      <span className="text-purple-600">{step.clickRate}%</span> click
                    </>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
