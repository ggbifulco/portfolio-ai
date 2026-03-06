import { NextResponse } from 'next/server';
import { resend } from '@/lib/resend';

export async function POST(req: Request) {
  try {
    const { name, email, company, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Nome, email e messaggio sono obbligatori' },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: 'Portfolio Contact <contact@futureintelligence.space>',
      to: 'bifulcogiuseppegerardo@gmail.com',
      replyTo: email,
      subject: `[Portfolio] Messaggio da ${name}${company ? ` — ${company}` : ''}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0a0a0a; color: #fff; border-radius: 12px;">
          <h2 style="color: #cc0020; font-size: 18px; margin-bottom: 24px; text-transform: uppercase; letter-spacing: 2px;">Nuovo messaggio dal portfolio</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr><td style="padding: 8px 0; color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; width: 100px;">Nome</td><td style="padding: 8px 0; color: #fff; font-size: 14px;">${name}</td></tr>
            <tr><td style="padding: 8px 0; color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Email</td><td style="padding: 8px 0; color: #fff; font-size: 14px;"><a href="mailto:${email}" style="color: #cc0020;">${email}</a></td></tr>
            ${company ? `<tr><td style="padding: 8px 0; color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Azienda</td><td style="padding: 8px 0; color: #fff; font-size: 14px;">${company}</td></tr>` : ''}
          </table>
          <div style="background: #111; border-left: 3px solid #cc0020; padding: 16px; border-radius: 4px;">
            <p style="color: #ccc; font-size: 14px; line-height: 1.7; margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
          <p style="color: #444; font-size: 10px; margin-top: 24px;">Rispondi direttamente a questa email per rispondere a ${name}.</p>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
