import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { inputText, model = 'deepseek-chat' } = await request.json();
    
    // 从环境变量获取API密钥
    const apiKey = process.env.DEEPSEEK_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API密钥未配置，请在服务器设置环境变量DEEPSEEK_API_KEY' }, 
        { status: 500 }
      );
    }

    if (!inputText) {
      return NextResponse.json(
        { error: '请提供输入文本' }, 
        { status: 400 }
      );
    }

    // 根据不同模型使用不同的提示词
    let systemPrompt = '你是一个擅长制造反转和阴阳怪气效果的表情包生成助手。你的回复总是出人意料，充满戏剧性的转折或者暗含讽刺。';
    let userPrompt = `针对"${inputText}"这个问题，请给出10个出人意料的神回复，要么有戏剧性的反转，要么带着阴阳怪气的效果。每个回答必须非常简短（20字以内），直接给出回应，不要解释。请以JSON数组格式返回，格式为["回复1", "回复2", ...]。参考例子："男朋友不听话怎么办？-换个男朋友"，"怎么哄生气的男朋友？-别哄他不配。`;
    
    // 如果是R1模型，增强理性解释
    if (model === 'deepseek-reasoner') {
      systemPrompt = '你是一个擅长制造反转和阴阳怪气效果的表情包生成助手。你需要思考什么回复最有反差感，最出人意料。进行缜密思考后给出答案。';
      userPrompt = `针对"${inputText}"这个问题，请通过推理分析，给出20个最有反转效果的神回复。你的思考过程应该考虑：
1. 文字原意与反义
2. 幽默与讽刺效果
3. 突然转折的惊喜感

每个回复必须简短（20字以内），富有戏剧性。认真思考并以JSON数组格式返回，格式为["回复1", "回复2", ...]。参考例子："男朋友不听话怎么办？-换个男朋友"，"怎么哄生气的男朋友？-别哄他不配"`;
    }

    // 调用DeepSeek API
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        max_tokens: 800,
        temperature: 0.9
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      return NextResponse.json(
        { error: `API请求失败: HTTP ${response.status}`, details: errorData }, 
        { status: response.status }
      );
    }

    const data = await response.json();
    
    if (!data || !data.choices || !data.choices[0] || !data.choices[0].message) {
      return NextResponse.json(
        { error: 'API返回格式异常' }, 
        { status: 500 }
      );
    }
    
    let aiResponse = data.choices[0].message.content;
    
    // 尝试从返回内容中解析JSON数组
    let responses = [];
    try {
      // 查找JSON数组开始和结束的位置
      const startIndex = aiResponse.indexOf('[');
      const endIndex = aiResponse.lastIndexOf(']') + 1;
      
      if (startIndex !== -1 && endIndex !== -1) {
        const jsonStr = aiResponse.substring(startIndex, endIndex);
        responses = JSON.parse(jsonStr);
      } else {
        // 如果没有找到JSON数组，尝试按行拆分
        responses = aiResponse.split('\n')
          .map(line => line.trim())
          .filter(line => line && !line.startsWith('[') && !line.startsWith(']'))
          .map(line => {
            // 清理引号、序号等字符
            return line.replace(/^[0-9]+[\.、\-\s"]*|[""]$/g, '').trim();
          });
      }
    } catch (error) {
      console.error("解析AI回复失败:", error);
      // 如果解析失败，尝试直接使用第一行作为回复
      responses = [aiResponse.split('\n')[0].replace(/["""]/g, '').trim()];
    }
    
    // 确保至少有一个回复
    if (responses.length === 0) {
      responses = ["AI生成失败，请重试"];
    }
    
    // 清理和格式化每个响应
    responses = responses.map(resp => {
      let clean = resp.replace(/[*_~`]/g, '').trim();
      // 如果太长，截断
      return clean.length > 25 ? clean.substring(0, 25) : clean;
    });
    
    // 删除重复项
    responses = [...new Set(responses)];
    
    // 最多返回10个
    responses = responses.slice(0, 10);

    return NextResponse.json({ responses });
  } catch (error) {
    console.error('处理请求时出错:', error);
    return NextResponse.json(
      { error: '服务器内部错误', details: error.message }, 
      { status: 500 }
    );
  }
}

// 提供OPTIONS请求的处理，用于CORS预检
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}