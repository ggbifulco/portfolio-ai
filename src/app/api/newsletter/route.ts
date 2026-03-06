import { NextResponse } from 'next/server';
import { resend } from '@/lib/resend';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email non valida' },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: 'Newsletter <newsletter@futureintelligence.space>',
      to: email,
      subject: 'Benvenuto nella Newsletter di Future Intelligence!',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h1 style="color: #990024; text-transform: uppercase; letter-spacing: 2px;">Grazie per esserti iscritto!</h1>
          <p>Siamo entusiasti di averti con noi. Riceverai gli ultimi aggiornamenti su:</p>
          <ul>
            <li><strong>AI Research:</strong> Approfondimenti sui nuovi paper e tecnologie.</li>
            <li><strong>Autonomous Agents:</strong> L'evoluzione degli agenti intelligenti.</li>
            <li><strong>RAG & LLM:</strong> Tecniche avanzate di implementazione.</li>
          </ul>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #888; text-align: center;">
            © 2026 Giuseppe Gerardo Bifulco | Future Intelligence <br />
            Advanced Machine Learning Engineer
          </p>
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
