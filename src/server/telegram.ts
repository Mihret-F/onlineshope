import { Inquiry } from '../types.js';
import { store } from './store.js';

function escapeHtml(text: string): string {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export async function sendTelegramInquiryNotification(inquiry: Inquiry): Promise<{ success: boolean; error?: string }> {
  try {
    const settings = store.getSettings();
    const token = settings.telegramBotToken || process.env.TELEGRAM_BOT_TOKEN;
    const chatId = settings.telegramChatId || process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      console.warn('Telegram credentials not configured. Skipping Telegram notification.');
      return { success: false, error: 'Telegram Bot Token or Chat ID not configured in Admin Settings or Environment.' };
    }

    const createdDate = new Date(inquiry.createdAt || Date.now());
    const day = createdDate.getDate();
    const month = createdDate.toLocaleString('en-US', { month: 'long' });
    const year = createdDate.getFullYear();
    const dateFormatted = `${day} ${month} ${year}`;

    const timeFormatted = createdDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    let telegramUsername = (inquiry.telegramUsername || '').trim();
    if (telegramUsername && !telegramUsername.startsWith('@')) {
      telegramUsername = `@${telegramUsername}`;
    }
    if (!telegramUsername) {
      telegramUsername = 'Not provided';
    }

    const formattedInquiryNumber = inquiry.inquiryNumber.startsWith('#')
      ? inquiry.inquiryNumber
      : `#${inquiry.inquiryNumber}`;

    const adminTelegram = '@Mercyyy_07';

    const messageHtml = `🔔 <b>NEW MERCY SHOPES INQUIRY</b>

━━━━━━━━━━━━━━━━

🆔 <b>Inquiry:</b> ${escapeHtml(formattedInquiryNumber)}

👤 <b>Customer:</b> ${escapeHtml(inquiry.customerName)}

📱 <b>Phone:</b> ${escapeHtml(inquiry.phone)}

✈️ <b>Telegram:</b> ${escapeHtml(telegramUsername)}

📧 <b>Email:</b> <a href="mailto:${escapeHtml(inquiry.email)}">${escapeHtml(inquiry.email)}</a>

📍 <b>Location:</b> ${escapeHtml(inquiry.location || 'Addis Ababa')}

🛍️ <b>Product:</b> ${escapeHtml(inquiry.productName || 'General Product')}

📦 <b>Quantity:</b> ${inquiry.quantity}

📝 <b>Description:</b>
${escapeHtml(inquiry.message)}

📅 <b>Date:</b> ${dateFormatted}

⏱️ <b>Time:</b> ${timeFormatted}

━━━━━━━━━━━━━━━━

🔔 <b>Status:</b> ${escapeHtml(inquiry.status.toUpperCase())}

👨‍💼 <b>Admin Telegram:</b> ${adminTelegram}`;

    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageHtml,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });

    const data = await response.json();
    if (!data.ok) {
      console.error('Telegram Bot API Error:', data);
      return { success: false, error: data.description || 'Failed to send Telegram message' };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Error in sendTelegramInquiryNotification:', err);
    return { success: false, error: err?.message || 'Network error sending Telegram notification' };
  }
}

export async function sendTestTelegramNotification(tokenOverride?: string, chatIdOverride?: string): Promise<{ success: boolean; error?: string }> {
  try {
    const settings = store.getSettings();
    const token = tokenOverride || settings.telegramBotToken || process.env.TELEGRAM_BOT_TOKEN;
    const chatId = chatIdOverride || settings.telegramChatId || process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return { success: false, error: 'Telegram Bot Token and Chat ID are required.' };
    }

    const messageHtml = `🔔 <b>MERCY SHOPES TELEGRAM TEST NOTIFICATION</b>

━━━━━━━━━━━━━━━━

This is a test notification from <b>Mercy Shopes E-Commerce & Inquiry System</b>.
Telegram Bot Integration is operational!

👨‍💼 <b>Admin Contact:</b> @Mercyyy_07
━━━━━━━━━━━━━━━━`;

    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageHtml,
        parse_mode: 'HTML'
      })
    });

    const data = await response.json();
    if (!data.ok) {
      return { success: false, error: data.description || 'Telegram API returned error' };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to test Telegram integration' };
  }
}

