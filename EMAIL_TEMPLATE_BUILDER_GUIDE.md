# Visual Email Template Builder Guide

## Overview
The Visual Email Template Builder allows you to create professional email templates without writing any HTML code. Build emails using drag-and-drop content blocks, customize them visually, and save them for reuse in your newsletter campaigns.

## Features

### 1. **Visual Block-Based Editor**
- **Text Blocks**: Add formatted text with customizable alignment, font size, and color
- **Image Blocks**: Insert images with custom URLs, alt text, and width settings
- **Button Blocks**: Create call-to-action buttons with custom text, links, and colors
- **Divider Blocks**: Add horizontal dividers with custom color and thickness
- **Spacer Blocks**: Control vertical spacing between elements

### 2. **Live Preview**
- See your email design in real-time as you build
- Preview exactly how your email will look to recipients
- Test different layouts before saving

### 3. **Template Management**
- Save custom templates for reuse
- Access pre-designed templates (Welcome, Announcement, Event, Digest)
- Load templates into the campaign composer
- Build a library of reusable email designs

## How to Use

### Creating a Template

1. **Navigate to Template Builder**
   - Go to Admin Dashboard → Newsletter Manager
   - Click the "Template Builder" tab

2. **Add Content Blocks**
   - Click any block type from the left sidebar to add it to your email
   - Blocks include: Text, Image, Button, Divider, Spacer
   - Blocks are added to the bottom of your email canvas

3. **Customize Blocks**
   - Click on any block in the canvas to select it
   - Use the right sidebar to customize properties:
     - **Text**: Content, alignment, font size, color
     - **Image**: URL, alt text, width, alignment
     - **Button**: Text, link URL, background color, text color, alignment
     - **Divider**: Color, height
     - **Spacer**: Height

4. **Reorder Blocks**
   - Use the up/down arrows on each block to change order
   - Delete blocks using the trash icon

5. **Preview Your Email**
   - Click "Preview" button to see the full email rendering
   - Check how it looks before saving

6. **Save Template**
   - Click "Save Template" button
   - Enter a name and optional description
   - Template is saved to your library

### Using Templates in Campaigns

1. **Create New Campaign**
   - Go to Newsletter Manager → Campaigns tab
   - Click "Create Campaign"

2. **Choose Template**
   - Click "Choose Template" button
   - Browse available templates
   - Click "Use Template" to load it

3. **Edit and Send**
   - Customize the subject line
   - Edit HTML content if needed (or use as-is)
   - Preview before sending
   - Send immediately or schedule for later

## Pre-Designed Templates

### Welcome Email
Professional welcome message for new subscribers with branding and call-to-action.

### Product Announcement
Eye-catching template for announcing new products or features with image and button.

### Event Invitation
Elegant invitation template with event details and RSVP button.

### Monthly Digest
Newsletter-style template for regular updates with multiple content sections.

## Best Practices

1. **Mobile-Friendly Design**
   - Keep content width reasonable (images at 100% or less)
   - Use readable font sizes (16px minimum)
   - Test on mobile devices

2. **Clear Call-to-Actions**
   - Use button blocks for important links
   - Make buttons stand out with contrasting colors
   - Use action-oriented text ("Shop Now", "Learn More")

3. **Visual Hierarchy**
   - Use spacers to separate sections
   - Vary text sizes for headlines vs body text
   - Use dividers to break up content

4. **Brand Consistency**
   - Save brand colors in your templates
   - Reuse successful layouts
   - Maintain consistent styling across campaigns

## Technical Details

### HTML Generation
The builder automatically generates email-compatible HTML using:
- Table-based layouts for maximum compatibility
- Inline CSS styles
- Responsive design principles
- Support for all major email clients

### Template Storage
Templates are stored in the `email_templates` database table with:
- Name and description
- Full HTML content
- Category (system or custom)
- Creation timestamp

### Integration
Templates integrate seamlessly with:
- Campaign Composer for sending
- Template Library for browsing
- Newsletter system for bulk sending

## Troubleshooting

**Images not showing?**
- Ensure image URLs are publicly accessible
- Use HTTPS URLs for security
- Check image file formats (JPG, PNG, GIF)

**Template not saving?**
- Verify you have content blocks added
- Check that template name is provided
- Ensure database connection is active

**Preview looks different from sent email?**
- Some email clients apply their own styles
- Test send to your own email first
- Use email-safe fonts and colors

## Support
For additional help or feature requests, contact your system administrator.
