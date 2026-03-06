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

    const emails = contactsData.data.map(c => c.email);

    if (emails.length === 0) {
      return NextResponse.json({ error: 'Nessun iscritto trovato' }, { status: 400 });
    }

    // 2. Invia l'email in batch (Resend supporta fino a 100 email per chiamata batch)
    // Per gestire più di 100 iscritti servirebbe un loop, ma per ora usiamo l'invio semplice
    const { data, error } = await resend.emails.send({
      from: 'Future Intelligence <newsletter@futureintelligence.space>',
      to: emails,
      subject: subject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          ${content}
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="font-size: 10px; color: #aaa; text-align: center;">
            Ricevi questa email perché ti sei iscritto alla newsletter di Future Intelligence.<br>
            © 2026 Giuseppe Gerardo Bifulco
          </p>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true, count: emails.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
