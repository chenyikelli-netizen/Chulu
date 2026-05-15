export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const { text } = await request.json();

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "你是一個職涯標籤辨識系統。請根據經歷選出最符合的 2-3 個標籤，僅輸出 JSON 格式：{\"tags\": [\"標籤1\", \"標籤2\"]}"
          },
          { role: "user", content: text }
        ],
        response_format: { type: "json_object" }
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
        return new Response(JSON.stringify({ error: data.error?.message || "Groq API 呼叫失敗" }), { 
            status: response.status,
            headers: { "Content-Type": "application/json" }
        });
    }

    return new Response(data.choices[0].message.content, {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
        status: 500,
        headers: { "Content-Type": "application/json" }
    });
  }
}
