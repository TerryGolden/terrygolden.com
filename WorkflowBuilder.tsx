import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Mail, Clock, GitBranch, Play, Pause, Save } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface WorkflowStep {
  id?: string;
  step_order: number;
  step_type: 'email' | 'delay' | 'condition';
  step_config: any;
}

export default function WorkflowBuilder() {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null);
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [triggerType, setTriggerType] = useState('subscriber_added');
  const [templates, setTemplates] = useState<any[]>([]);

  useEffect(() => {
    loadWorkflows();
    loadTemplates();
  }, []);

  const loadWorkflows = async () => {
    const { data } = await supabase.from('email_workflows').select('*').order('created_at', { ascending: false });
    if (data) setWorkflows(data);
  };

  const loadTemplates = async () => {
    const { data } = await supabase.from('email_templates').select('*');
    if (data) setTemplates(data);
  };

  const loadWorkflow = async (workflowId: string) => {
    const workflow = workflows.find(w => w.id === workflowId);
    setSelectedWorkflow(workflow);
    setName(workflow.name);
    setDescription(workflow.description);
    setTriggerType(workflow.trigger_type);

    const { data } = await supabase.from('workflow_steps').select('*').eq('workflow_id', workflowId).order('step_order');
    if (data) setSteps(data);
  };

  const addStep = (type: 'email' | 'delay' | 'condition') => {
    const newStep: WorkflowStep = {
      step_order: steps.length,
      step_type: type,
      step_config: type === 'email' ? { template_id: '', subject: '', content: '' } :
                   type === 'delay' ? { days: 1, hours: 0, minutes: 0 } :
                   { condition: 'opened', value: true }
    };
    setSteps([...steps, newStep]);
  };

  const updateStep = (index: number, config: any) => {
    const updated = [...steps];
    updated[index].step_config = { ...updated[index].step_config, ...config };
    setSteps(updated);
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const saveWorkflow = async () => {
    if (!name) {
      toast.error('Please enter a workflow name');
      return;
    }

    const workflowData = {
      name,
      description,
      trigger_type: triggerType,
      status: 'draft'
    };

    let workflowId = selectedWorkflow?.id;

    if (selectedWorkflow) {
      await supabase.from('email_workflows').update(workflowData).eq('id', selectedWorkflow.id);
    } else {
      const { data } = await supabase.from('email_workflows').insert(workflowData).select().single();
      workflowId = data?.id;
    }

    if (workflowId) {
      await supabase.from('workflow_steps').delete().eq('workflow_id', workflowId);
      
      const stepsData = steps.map((step, index) => ({
        workflow_id: workflowId,
        step_order: index,
        step_type: step.step_type,
        step_config: step.step_config
      }));

      await supabase.from('workflow_steps').insert(stepsData);
    }

    toast.success('Workflow saved successfully');
    loadWorkflows();
  };

  const toggleWorkflowStatus = async () => {
    if (!selectedWorkflow) return;
    
    const newStatus = selectedWorkflow.status === 'active' ? 'paused' : 'active';
    await supabase.from('email_workflows').update({ status: newStatus }).eq('id', selectedWorkflow.id);
    
    toast.success(`Workflow ${newStatus === 'active' ? 'activated' : 'paused'}`);
    loadWorkflows();
    loadWorkflow(selectedWorkflow.id);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1">
        <Card className="p-4">
          <h3 className="font-semibold mb-4">Workflows</h3>
          <Button onClick={() => { setSelectedWorkflow(null); setName(''); setDescription(''); setSteps([]); }} className="w-full mb-4">
            <Plus className="w-4 h-4 mr-2" /> New Workflow
          </Button>
          <div className="space-y-2">
            {workflows.map(w => (
              <div key={w.id} onClick={() => loadWorkflow(w.id)} 
                   className={`p-3 rounded cursor-pointer ${selectedWorkflow?.id === w.id ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
                <div className="font-medium text-sm">{w.name}</div>
                <div className="text-xs opacity-75">{w.status}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="lg:col-span-3">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Workflow Builder</h2>
            <div className="flex gap-2">
              {selectedWorkflow && (
                <Button onClick={toggleWorkflowStatus} variant="outline">
                  {selectedWorkflow.status === 'active' ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                  {selectedWorkflow.status === 'active' ? 'Pause' : 'Activate'}
                </Button>
              )}
              <Button onClick={saveWorkflow}>
                <Save className="w-4 h-4 mr-2" /> Save Workflow
              </Button>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <Label>Workflow Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Welcome Series" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe this workflow..." />
            </div>
            <div>
              <Label>Trigger Type</Label>
              <Select value={triggerType} onValueChange={setTriggerType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="subscriber_added">New Subscriber</SelectItem>
                  <SelectItem value="inactivity">Inactive Subscriber</SelectItem>
                  <SelectItem value="time_based">Time-Based</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold mb-2">Workflow Steps</h3>
            <div className="flex gap-2 mb-4">
              <Button onClick={() => addStep('email')} size="sm" variant="outline">
                <Mail className="w-4 h-4 mr-2" /> Add Email
              </Button>
              <Button onClick={() => addStep('delay')} size="sm" variant="outline">
                <Clock className="w-4 h-4 mr-2" /> Add Delay
              </Button>
              <Button onClick={() => addStep('condition')} size="sm" variant="outline">
                <GitBranch className="w-4 h-4 mr-2" /> Add Condition
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <Card key={index} className="p-4 border-l-4 border-primary">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    {step.step_type === 'email' && <Mail className="w-5 h-5 text-blue-500" />}
                    {step.step_type === 'delay' && <Clock className="w-5 h-5 text-orange-500" />}
                    {step.step_type === 'condition' && <GitBranch className="w-5 h-5 text-purple-500" />}
                    <span className="font-semibold capitalize">Step {index + 1}: {step.step_type}</span>
                  </div>
                  <Button onClick={() => removeStep(index)} size="sm" variant="ghost">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {step.step_type === 'email' && (
                  <div className="space-y-3">
                    <div>
                      <Label>Template</Label>
                      <Select value={step.step_config.template_id} onValueChange={(v) => updateStep(index, { template_id: v })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select template" />
                        </SelectTrigger>
                        <SelectContent>
                          {templates.map(t => (
                            <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Subject</Label>
                      <Input value={step.step_config.subject} onChange={(e) => updateStep(index, { subject: e.target.value })} />
                    </div>
                  </div>
                )}

                {step.step_type === 'delay' && (
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label>Days</Label>
                      <Input type="number" value={step.step_config.days} onChange={(e) => updateStep(index, { days: parseInt(e.target.value) })} />
                    </div>
                    <div>
                      <Label>Hours</Label>
                      <Input type="number" value={step.step_config.hours} onChange={(e) => updateStep(index, { hours: parseInt(e.target.value) })} />
                    </div>
                    <div>
                      <Label>Minutes</Label>
                      <Input type="number" value={step.step_config.minutes} onChange={(e) => updateStep(index, { minutes: parseInt(e.target.value) })} />
                    </div>
                  </div>
                )}

                {step.step_type === 'condition' && (
                  <div>
                    <Label>Condition</Label>
                    <Select value={step.step_config.condition} onValueChange={(v) => updateStep(index, { condition: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="opened">Email Opened</SelectItem>
                        <SelectItem value="clicked">Link Clicked</SelectItem>
                        <SelectItem value="not_opened">Not Opened</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
