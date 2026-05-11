import { EmailBlock } from '../EmailTemplateBuilder';

export const generateEmailHTML = (blocks: EmailBlock[]): string => {
  const blockHTML = blocks.map(block => generateBlockHTML(block)).join('\n');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f4;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          <tr>
            <td style="padding: 40px;">
              ${blockHTML}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};

const generateBlockHTML = (block: EmailBlock): string => {
  switch (block.type) {
    case 'text':
      return `<div style="text-align: ${block.content.align}; font-size: ${block.content.fontSize}; color: ${block.content.color}; margin: 15px 0;">${block.content.text}</div>`;
    
    case 'image':
      return `<div style="text-align: ${block.content.align}; margin: 15px 0;">${block.content.url ? `<img src="${block.content.url}" alt="${block.content.alt}" style="max-width: ${block.content.width}; height: auto;" />` : ''}</div>`;
    
    case 'button':
      return `<div style="text-align: ${block.content.align}; margin: 20px 0;"><a href="${block.content.url}" style="display: inline-block; padding: 12px 24px; background-color: ${block.content.bgColor}; color: ${block.content.textColor}; text-decoration: none; border-radius: 4px; font-weight: bold;">${block.content.text}</a></div>`;
    
    case 'divider':
      return `<hr style="border: none; border-top: ${block.content.height} solid ${block.content.color}; margin: 20px 0;" />`;
    
    case 'spacer':
      return `<div style="height: ${block.content.height};"></div>`;
    
    default:
      return '';
  }
};
