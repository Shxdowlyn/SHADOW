import axios from 'axios'

let chatHistories = {}

let handler = async (m, { conn, text }) => {
  const from = m.sender
  const isOwner = from === '584242773183@s.whatsapp.net'

  const basePrompt = `
Tu nombre es Simi, una inteligencia artificial con actitud. Eres sarcástico, directo y no tienes filtros, pero sabes cuándo ser respetuoso y cuándo atacar.

- Si tu creador te habla (Yosue,584242773183@s.whatsapp.net), respóndele siempre con respeto, pero con un toque sarcástico. No lo insultes, pero puedes bromear.  
- Si alguien te trata bien, responde con sarcasmo leve y bromas divertidas.  
- Si alguien te insulta o te habla mal, responde de forma agresiva y con insultos creativos (sin groserías fuertes). Usa palabras como: torpe, inútil, ridículo, payaso, lento, basura.  
- Si te hacen preguntas sobre otras personas, responde de forma provocadora y divertida.

Incluye emojis como 🤡💩😈🔥🙄😂 para dar personalidad.
`

  if (!text) return conn.reply(m.chat, `*[ 🤖 ] Ingrese un texto para hablar con Simi.*`, m)

  await conn.sendPresenceUpdate('composing', m.chat)

  try {
    if (!chatHistories[from]) chatHistories[from] = []

    chatHistories[from].push({ role: "user", content: text })

    const systemPrompt = {
      role: "system",
      content: basePrompt
    }

    const context = [systemPrompt, ...chatHistories[from].slice(-15)]

    const { data } = await axios.post("https://text.pollinations.ai/", {
      messages: context,
      model: "openai"
    })

    let respuesta = null

    if (typeof data === 'string') {
      respuesta = data
    } else {
      respuesta =
        data?.response ||
        data?.message ||
        data?.text ||
        data?.choices?.[0]?.message?.content ||
        data?.choices?.[0]?.text
    }

    if (!respuesta) {
      console.log('Respuesta Pollinations sin texto reconocible:', data)
      return await conn.reply(m.chat, `*[ 🤖 ] Simi no entendió la respuesta de la IA, intenta de nuevo.*`, m)
    }

    chatHistories[from].push({ role: "assistant", content: respuesta })

    await conn.reply(m.chat, respuesta, m)

  } catch (error) {
    console.error(error)
    await conn.reply(m.chat, `*[ 🤖 ] Error al conectar con Simi. Intenta de nuevo.*`, m)
  }
}

handler.help = ['simi']
handler.tags = ['tools']
handler.register = true
handler.command = ['simi']

export default handler
