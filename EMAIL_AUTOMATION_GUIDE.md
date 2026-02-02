# Email Automation Workflow System Guide

## Overview

The email automation workflow system allows you to create triggered email sequences that automatically send based on subscriber actions or time-based rules. This includes welcome series, re-engagement campaigns, drip campaigns, and custom automation sequences.

## Features

### 1. **Visual Workflow Builder**
- Drag-and-drop interface for creating multi-step email sequences
- Add email steps, delays, and conditional logic
- Save and manage multiple workflows
- Activate/pause workflows with one click

### 2. **Trigger Types**
- **New Subscriber**: Automatically triggered when someone subscribes
- **Inactive Subscriber**: Triggered after X days of inactivity
- **Time-Based**: Scheduled campaigns with specific start dates

### 3. **Workflow Steps**
- **Email Step**: Send an email using a template
- **Delay Step**: Wait for specified time (days, hours, minutes)
- **Condition Step**: Branch based on subscriber behavior (opened, clicked, etc.)

### 4. **Performance Analytics**
- Track executions for each workflow
- Monitor open rates and click rates per step
- View completion rates and active subscribers
- Detailed step-by-step performance metrics

## Getting Started

### Creating Your First Workflow

1. **Access Workflow Builder**
   - Go to Admin Dashboard → Newsletter → Workflows tab
   - Click "New Workflow" to create a new automation

2. **Configure Basic Settings**
   - Enter workflow name (e.g., "Welcome Series")
   - Add description
   - Select trigger type (e.g., "New Subscriber")

3. **Add Workflow Steps**
   - Click "Add Email" to send an email
   - Click "Add Delay" to wait before next step
   - Click "Add Condition" for conditional logic

4. **Configure Email Steps**
   - Select email template from dropdown
   - Customize subject line
   - Template content is loaded automatically

5. **Set Delays**
   - Enter days, hours, and/or minutes to wait
   - Example: 3 days, 0 hours, 0 minutes

6. **Save and Activate**
   - Click "Save Workflow" to save changes
   - Click "Activate" to start the automation

## Pre-Built Workflow Templates

### Welcome Series
**Trigger**: New Subscriber
**Purpose**: Onboard new subscribers with a series of welcome emails

**Suggested Steps**:
1. Email: Welcome email (immediate)
2. Delay: 2 days
3. Email: Introduction to your content
4. Delay: 3 days
5. Email: Exclusive offer or content

### Re-engagement Campaign
**Trigger**: Inactive Subscriber (30 days)
**Purpose**: Win back subscribers who haven't opened emails

**Suggested Steps**:
1. Email: "We miss you" message
2. Delay: 5 days
3. Condition: Check if opened
4. Email: Special offer or incentive
5. Delay: 7 days
6. Email: Final re-engagement attempt

### Product Launch Drip
**Trigger**: Time-Based
**Purpose**: Build anticipation for product launch

**Suggested Steps**:
1. Email: Teaser announcement
2. Delay: 3 days
3. Email: Feature highlights
4. Delay: 3 days
5. Email: Launch day notification

## How Workflows Are Triggered

### Automatic Triggers

1. **New Subscriber Workflow**
   - Automatically triggered when someone subscribes via the newsletter form
   - The frontend calls `trigger-workflow` edge function after successful subscription
   - All active workflows with trigger type "subscriber_added" are initiated

2. **Processing Workflow Steps**
   - The `process-workflow-steps` edge function runs periodically (recommended: every 5-15 minutes)
   - It checks for executions ready to process based on `next_execution_at` timestamp
   - Sends emails, applies delays, and moves to next step automatically

### Manual Triggers (Advanced)

You can manually trigger workflows using the edge function:

```javascript
await supabase.functions.invoke('trigger-workflow', {
  body: { 
    subscriberEmail: 'user@example.com',
    triggerType: 'subscriber_added'
  }
});
```

## Setting Up Automated Processing

To ensure workflows run automatically, you need to schedule the processing function:

### Option 1: GitHub Actions (Recommended)

Create `.github/workflows/process-workflows.yml`:

```yaml
name: Process Email Workflows

on:
  schedule:
    - cron: '*/15 * * * *'  # Every 15 minutes
  workflow_dispatch:

jobs:
  process:
    runs-on: ubuntu-latest
    steps:
      - name: Process Workflows
        run: |
          curl -X POST https://api.databasepad.com/functions/v1/process-workflow-steps \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_ANON_KEY }}"
```

### Option 2: External Cron Service

Use a service like cron-job.org or EasyCron to call the endpoint every 15 minutes:

**URL**: `https://api.databasepad.com/functions/v1/process-workflow-steps`
**Method**: POST
**Headers**: `Authorization: Bearer YOUR_SUPABASE_ANON_KEY`

### Option 3: Supabase Database Webhooks

Set up a pg_cron job in Supabase (requires paid plan):

```sql
SELECT cron.schedule(
  'process-workflows',
  '*/15 * * * *',
  $$
  SELECT net.http_post(
    url:='https://api.databasepad.com/functions/v1/process-workflow-steps',
    headers:='{"Authorization": "Bearer YOUR_KEY"}'::jsonb
  );
  $$
);
```

## Best Practices

### Email Content
- Use clear, compelling subject lines
- Personalize content when possible
- Include clear call-to-action buttons
- Test emails before activating workflows

### Timing
- Don't send too many emails too quickly
- Space emails at least 2-3 days apart
- Consider time zones for your audience
- Avoid sending on weekends (unless appropriate)

### Testing
- Test workflows with a small group first
- Monitor analytics closely after activation
- A/B test subject lines and content
- Adjust based on performance data

### Maintenance
- Review workflow performance monthly
- Update underperforming emails
- Remove subscribers who consistently don't engage
- Keep email templates fresh and relevant

## Troubleshooting

### Workflows Not Triggering
- Check workflow status is "active" not "draft" or "paused"
- Verify trigger type matches the action
- Ensure processing function is running on schedule

### Emails Not Sending
- Verify RESEND_API_KEY is configured correctly
- Check email templates are properly formatted
- Review edge function logs for errors
- Ensure "from" email is verified in Resend

### Analytics Not Updating
- Confirm workflow_step_analytics table is receiving data
- Check that execution IDs are being tracked correctly
- Verify step IDs match between executions and analytics

## Database Schema

### email_workflows
- `id`: Workflow UUID
- `name`: Workflow name
- `trigger_type`: subscriber_added, inactivity, time_based
- `status`: draft, active, paused, archived

### workflow_steps
- `id`: Step UUID
- `workflow_id`: Parent workflow
- `step_order`: Order in sequence
- `step_type`: email, delay, condition
- `step_config`: JSON configuration

### workflow_executions
- `id`: Execution UUID
- `workflow_id`: Parent workflow
- `subscriber_email`: Subscriber email
- `current_step_id`: Current step being executed
- `status`: active, completed, stopped
- `next_execution_at`: When to process next

### workflow_step_analytics
- `execution_id`: Related execution
- `step_id`: Related step
- `action`: sent, opened, clicked, bounced

## Support

For issues or questions:
1. Check edge function logs in Supabase dashboard
2. Review workflow execution status in database
3. Verify all environment variables are set correctly
4. Test with a single subscriber before scaling

## Future Enhancements

Potential features to add:
- A/B testing for email content
- Advanced segmentation based on subscriber behavior
- Dynamic content personalization
- Integration with external CRM systems
- SMS notifications alongside emails
- Webhook triggers for custom events
