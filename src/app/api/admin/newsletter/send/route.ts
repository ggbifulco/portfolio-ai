import { NextResponse } from 'next/server';
import { resend } from '@/lib/resend';

const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

export async function POST(req: Request) {
  try {
    const { subject, content } = await req.json();

    if (!subject || !content) {
      return NextResponse.json({ error: 'Oggetto e contenuto sono obbligatori' }, { status: 400 });
    }

    if (!AUDIENCE_ID) {
      return NextResponse.json({ error: 'Audience ID non configurato' }, { status: 500 });
    }

    // 1. Recupera i contatti dall'Audience
    const { data: contactsData, error: contactsError } = await resend.contacts.list({
      audienceId: AUDIENCE_ID,
    });

    if (contactsError || !contactsData) {
      return NextResponse.json({ error: 'Errore nel recupero dei contatti' }, { status: 500 });
    }

    const contacts = contactsData.data.filter(c => !c.unsubscribed);
    const emails = contacts.map(c => c.email);

    if (emails.length === 0) {
      return NextResponse.json({ error: 'Nessun iscritto attivo trovato' }, { status: 400 });
    }

    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        ${content}
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
        <p style="font-size: 10px; color: #aaa; text-align: center;">
          Ricevi questa email perché ti sei iscritto alla newsletter di Future Intelligence.<br>
          © 2026 Giuseppe Gerardo Bifulco
        </p>
      </div>
    `;

    // Invia email individuale a ciascun iscritto (nessuno vede le email degli altri)
    // Resend batch supporta max 100 email per chiamata — chunk se necessario
    const CHUNK_SIZE = 100;
    const chunks: string[][] = [];
    for (let i = 0; i < emails.length; i += CHUNK_SIZE) {
      chunks.push(emails.slice(i, i + CHUNK_SIZE));
    }

    let totalSent = 0;
    for (const chunk of chunks) {
      const batch = chunk.map(email => ({
        from: 'Future Intelligence <newsletter@futureintelligence.space>',
        to: [email],
        subject,
        html: emailHtml,
      }));

      const { data, error } = await resend.batch.send(batch);
      if (error) {
        return NextResponse.json({ error }, { status: 400 });
      }
      totalSent += chunk.length;
    }

    return NextResponse.json({ success: true, count: totalSent });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
