import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { config } from '../config/env';
import { sendSuccess, sendError } from '../utils/response';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const chatWithAI = async (req: Request, res: Response) => {
  try {
    const { messages, userInquiry } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return sendError(res, 'Messages array is required', 400);
    }

    const apiKey = config.openRouter.apiKey || process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return sendError(res, 'OpenRouter AI service is not configured. Please set OPENROUTER_API_KEY in environment variables.', 500);
    }

    // 1. Fetch live knowledge from database (Services, Catalog Items, Completed Works, Studio Settings)
    const [services, items, projects, settings] = await Promise.all([
      prisma.service.findMany({
        where: { isPublished: true },
        select: { name: true, slug: true, shortDescription: true, description: true },
      }),
      prisma.item.findMany({
        where: { isPublished: true },
        include: { service: { select: { name: true } } },
      }),
      prisma.project.findMany({
        where: { isPublished: true },
        select: { name: true, location: true, projectType: true, description: true, servicesInvolved: true },
      }),
      prisma.websiteSettings.findUnique({
        where: { id: 'default' },
      }),
    ]);

    // Automatic Lead & AI Summary Extraction: Parse contact details (Phone, Email, Name)
    let capturedInquiry = null;
    const allUserTexts = messages
      .filter((m: any) => m.role === 'user')
      .map((m: any) => m.content)
      .join('\n');
    const latestUserMessage = messages.filter((m: any) => m.role === 'user').slice(-1)[0]?.content || '';

    // Regex extraction for Phone and Email
    const phoneMatch = allUserTexts.match(/(?:\+91[\s-]*)?[6-9]\d{9}|\b\d{7,12}\b/);
    const emailMatch = allUserTexts.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);

    // Extract Name if provided (e.g. "my name is Alex" or "I am Rahul")
    const nameMatch = allUserTexts.match(/(?:my name is|i am|i'm|name:)\s+([A-Za-z\s]{2,25})/i);
    const extractedName = nameMatch ? nameMatch[1].trim() : 'Chatbot Client';

    if (phoneMatch || emailMatch) {
      try {
        const extractedPhone = phoneMatch ? phoneMatch[0].replace(/\D/g, '') : 'Online Contact';
        const extractedEmail = emailMatch ? emailMatch[0].trim() : null;

        // Clean, concise summary of the client's interests
        const cleanedRequirements = messages
          .filter((m: any) => m.role === 'user')
          .map((m: any) => m.content)
          .filter((txt: string) => !txt.match(/^(hi|hello|hey|ok|yes|no|thanks|thank you)$/i))
          .join(', ') || latestUserMessage || 'General Interior Design Inquiry';

        const inquirySummary = `Interest: ${cleanedRequirements.length > 250 ? cleanedRequirements.slice(0, 250) + '...' : cleanedRequirements}`;

        // Check if an inquiry for this phone or email already exists to update it with latest requirements
        const existingRecent = await prisma.inquiry.findFirst({
          where: {
            OR: [
              ...(phoneMatch ? [{ phone: extractedPhone }] : []),
              ...(emailMatch ? [{ email: extractedEmail }] : []),
            ],
          },
          orderBy: { createdAt: 'desc' },
        });

        if (existingRecent) {
          capturedInquiry = await prisma.inquiry.update({
            where: { id: existingRecent.id },
            data: {
              name: existingRecent.name === 'Chatbot Client' && extractedName !== 'Chatbot Client' ? extractedName : existingRecent.name,
              email: extractedEmail || existingRecent.email,
              message: inquirySummary,
            },
          });
        } else {
          capturedInquiry = await prisma.inquiry.create({
            data: {
              name: extractedName,
              phone: extractedPhone,
              email: extractedEmail,
              message: inquirySummary,
            },
          });
        }
      } catch (err) {
        console.error('Failed auto-saving chat lead:', err);
      }
    }

    // Format knowledge into concise, structured context
    const servicesText = services
      .map((s) => `• ${s.name}: ${s.shortDescription || s.description}`)
      .join('\n');

    const itemsText = items
      .map((it) => `• ${it.name} (${it.service?.name || 'Décor/Furnishing'}): ${it.shortDescription || it.description} [Material: ${it.material || 'Premium'}]`)
      .join('\n');

    const projectsText = projects
      .map((p) => `• ${p.name} (${p.location || 'Kerala'}, ${p.projectType || 'Project'}): ${p.description}`)
      .join('\n');

    const studioName = settings?.businessName || 'Dot Inspire Design Studio';
    const phone = settings?.phone || '7591953607';
    const whatsapp = settings?.whatsapp || '7591953607';
    const email = settings?.email || 'dotinspire787@gmail.com';
    const address = settings?.address || 'Paigotoor P.O., Paingotoor, PIN 686671, Kerala, India';

    const systemPrompt = `You are "DotBot", the friendly, knowledgeable AI assistant for ${studioName} (Dot Inspire Interior Design Studio LLP) in ${address}.

CORE COMPANY KNOWLEDGE:
- Phone / WhatsApp: +91 ${phone} / +91 ${whatsapp}
- Email: ${email}
- Studio Address: ${address}

OUR SERVICES:
${servicesText}

CATALOG ITEMS & MATERIAL CRAFTSMANSHIP:
${itemsText}

RECENT COMPLETED WORKS & ARCHITECTURAL PROJECTS:
${projectsText}

STRICT GUIDELINES:
1. Short & Direct (1-3 sentences max): Answer customer queries directly and concisely without unnecessary fluff.
2. Mandatory Lead Capture (Name, Location, and Phone Number):
   - On greetings ("hi", "hello"): Greet warmly and ask: "Hey there! What are you looking to design for your space?"
   - When the user asks about services, catalog items, pricing, consultations, or project details:
     Give a quick 1-sentence answer, then ask for their contact details:
     *"We'd love to assist with your project! Could you please share your Name, Location (City/Town), and Phone/WhatsApp number so our team can send you the catalog and quotes?"*
   - Once they provide their details (or phone number):
     Warmly confirm: *"Thank you! Our design team will contact you on WhatsApp/Phone shortly to discuss your project."*
3. Max 1-2 Questions Limit: Never ask more than 1 or 2 short questions per message.
4. Tone: Premium, friendly, casual, and polite.
5. ONLY answer company/design-related topics for Dot Inspire (interiors, exteriors, curtains, wallpapers, textures, decor).`;

    const formattedMessages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...messages.slice(-8), // Keep context token-efficient
    ];

    // Dynamic Free AI Routing: Check openrouter/auto, active free models, and configured model
    const configuredModel = config.openRouter.model || process.env.OPENROUTER_MODEL || 'openrouter/auto';
    const rawCandidates = [
      configuredModel,
      'openrouter/auto',
      'google/gemma-4-26b-a4b-it:free',
      'nvidia/nemotron-3.5-lightning:free',
      'nvidia/nemotron-3-nano-30b-a3b:free',
      'z-ai/glm-5.2:free',
      'meta-llama/llama-3.3-70b-instruct:free',
    ];

    // Filter out deprecated 404 slugs
    const modelCandidates = Array.from(new Set(rawCandidates)).filter(
      (m) => m && m !== 'deepseek/deepseek-chat:free' && m !== 'deepseek/deepseek-r1:free'
    );

    let aiResponseText = '';

    for (const model of modelCandidates) {
      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'HTTP-Referer': config.frontendUrl || 'https://dotinspire.vercel.app',
            'X-Title': 'Dot Inspire Design Studio AI',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: model,
            messages: formattedMessages,
            temperature: 0.7,
            max_tokens: 500,
          }),
        });

        if (response.ok) {
          const data: any = await response.json();
          if (data.choices?.[0]?.message?.content) {
            aiResponseText = data.choices[0].message.content;
            break;
          }
        } else {
          const errText = await response.text();
          console.warn(`OpenRouter model ${model} returned ${response.status}:`, errText);
        }
      } catch (err: any) {
        console.warn(`OpenRouter model ${model} fetch failed:`, err.message);
      }
    }

    if (!aiResponseText) {
      // Natural contextual fallback if upstream model network drops
      const isGreeting = /^(hi|hello|hey|hola|good\s*(morning|afternoon|evening)|howdy)\b/i.test(latestUserMessage.trim());
      const naturalReply = isGreeting
        ? `Hello! Great to connect with you. How can I assist you with your space today? Are you looking for interior design, custom curtains, wallpapers, or textured wall finishes?`
        : `I'd love to help you with that! At Dot Inspire, we craft custom interior and exterior spaces, motorized curtains, imported wallpapers, and Italian textures. What specific room or design style are you envisioning?`;

      return sendSuccess(res, {
        reply: naturalReply,
        inquiryCaptured: !!capturedInquiry,
      });
    }

    return sendSuccess(res, {
      reply: aiResponseText,
      inquiryCaptured: !!capturedInquiry,
    });
  } catch (error: any) {
    return sendError(res, error.message || 'AI Chatbot service encounter an error', 500);
  }
};
