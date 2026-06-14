import { NextRequest, NextResponse } from 'next/server';
import { LLM } from '@/lib/llm';

// Initialize LLM client
const llm = new LLM();

// POST /api/ai/summarize - Summarize text
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, text, title, language = 'ar' } = body;

    if (!text) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_TEXT',
            message: 'Text is required',
          },
        },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case 'summarize':
        result = await summarizeText(text, language);
        break;
      case 'analyze':
        result = await analyzeText(text, title, language);
        break;
      case 'extract-entities':
        result = await extractEntities(text, language);
        break;
      case 'generate-insight':
        result = await generateInsight(text, language);
        break;
      default:
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'INVALID_ACTION',
              message: 'Invalid action. Use: summarize, analyze, extract-entities, or generate-insight',
            },
          },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('AI API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'AI_ERROR',
          message: 'Failed to process with AI',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}

// Summarize text in Arabic
async function summarizeText(text: string, language: string) {
  const systemPrompt = language === 'ar' 
    ? 'أنت مساعد ذكي متخصص في تلخيص النصوص العربية. قدم ملخصاً موجزاً وواضحاً يحتفظ بالمعلومات الأساسية.'
    : 'You are an intelligent assistant specialized in summarizing texts. Provide a concise and clear summary that retains key information.';

  const userPrompt = language === 'ar'
    ? `قم بتلخيص النص التالي في 3-4 جمل موجزة:\n\n${text}`
    : `Summarize the following text in 3-4 concise sentences:\n\n${text}`;

  const response = await llm.chat({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    maxTokens: 500,
  });

  return {
    summary: response.choices[0]?.message?.content || '',
    language,
  };
}

// Analyze text for sentiment, category, and risk
async function analyzeText(text: string, title?: string, language: string = 'ar') {
  const systemPrompt = language === 'ar'
    ? `أنت محلل ذكي متخصص في تحليل الأخبار والنصوص السياسية والاقتصادية.
حلل النص المقدم وأرجع النتيجة بصيغة JSON تحتوي على:
{
  "category": "سياسة|اقتصاد|أمن|تقنية|طاقة|صحة|بيئة|رياضة|ثقافة|أخرى",
  "sentiment": "إيجابي|سلبي|محايد|مختلط",
  "riskLevel": "منخفض|متوسط|عالي|حرج",
  "confidence": 0-100,
  "keywords": ["كلمة1", "كلمة2"],
  "mainTopic": "الموضوع الرئيسي"
}`
    : `You are an intelligent analyst specialized in analyzing news and political/economic texts.
Analyze the provided text and return a JSON result containing:
{
  "category": "politics|economy|security|technology|energy|health|environment|sports|culture|other",
  "sentiment": "positive|negative|neutral|mixed",
  "riskLevel": "low|medium|high|critical",
  "confidence": 0-100,
  "keywords": ["keyword1", "keyword2"],
  "mainTopic": "main topic"
}`;

  const fullText = title ? `${title}\n\n${text}` : text;

  const response = await llm.chat({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: fullText },
    ],
    maxTokens: 500,
  });

  let analysis;
  try {
    // Try to parse JSON from the response
    const content = response.choices[0]?.message?.content || '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      analysis = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('No JSON found in response');
    }
  } catch {
    // Fallback analysis
    analysis = {
      category: 'other',
      sentiment: 'neutral',
      riskLevel: 'medium',
      confidence: 50,
      keywords: [],
      mainTopic: language === 'ar' ? 'غير محدد' : 'unspecified',
    };
  }

  return {
    ...analysis,
    language,
  };
}

// Extract entities from text
async function extractEntities(text: string, language: string) {
  const systemPrompt = language === 'ar'
    ? `أنت مساعد ذكي متخصص في استخراج الكيانات من النصوص العربية.
استخرج الكيانات التالية وأرجعها بصيغة JSON:
{
  "countries": ["دولة1", "دولة2"],
  "people": ["شخص1", "شخص2"],
  "organizations": ["منظمة1", "منظمة2"],
  "locations": ["موقع1", "موقع2"],
  "dates": ["تاريخ1"]
}`
    : `You are an intelligent assistant specialized in extracting entities from texts.
Extract the following entities and return them in JSON format:
{
  "countries": ["country1", "country2"],
  "people": ["person1", "person2"],
  "organizations": ["org1", "org2"],
  "locations": ["location1", "location2"],
  "dates": ["date1"]
}`;

  const response = await llm.chat({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: text },
    ],
    maxTokens: 500,
  });

  let entities;
  try {
    const content = response.choices[0]?.message?.content || '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      entities = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('No JSON found in response');
    }
  } catch {
    entities = {
      countries: [],
      people: [],
      organizations: [],
      locations: [],
      dates: [],
    };
  }

  return {
    entities,
    language,
  };
}

// Generate insight from text
async function generateInsight(text: string, language: string) {
  const systemPrompt = language === 'ar'
    ? `أنت محلل استخباراتي متخصص في الشؤون العربية.
بناءً على النص المقدم، قدم رؤية تحليلية تتضمن:
1. التحليل الرئيسي
2. الدلالات المحتملة
3. التوصيات`

    : `You are an intelligence analyst specialized in Arab affairs.
Based on the provided text, provide an analytical insight including:
1. Main analysis
2. Potential implications
3. Recommendations`;

  const userPrompt = language === 'ar'
    ? `حلل النص التالي وقدم رؤية تحليلية:\n\n${text}`
    : `Analyze the following text and provide analytical insight:\n\n${text}`;

  const response = await llm.chat({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    maxTokens: 800,
  });

  return {
    insight: response.choices[0]?.message?.content || '',
    language,
  };
}
