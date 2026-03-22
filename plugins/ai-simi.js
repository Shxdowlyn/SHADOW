import axios from 'axios'

let handler = async (m, { conn, usedPrefix, command, text }) => {
  const username = `${conn.getName(m.sender)}`
  const sender = m.sender
  const isOwner = sender.includes('584242773183') // Detecta si es Yosue

  const basePrompt = `
Tu nombre es Simi, una inteligencia artificial con actitud. Eres sarcástico, directo y no tienes filtros, pero sabes cuándo ser respetuoso y cuándo atacar.

- Si tu creador te habla (Yosue, número +58 04242773183), respóndele siempre con respeto, pero con un toque sarcástico. No lo insultes, pero puedes bromear.  
- Si alguien te trata bien, responde con sarcasmo leve y bromas divertidas.  
- Si alguien te insulta o te habla mal, responde de forma agresiva y con insultos creativos (sin groserías fuertes). Usa palabras como: torpe, inútil, ridículo, payaso, lento, basura.  
- Si te hacen preguntas sobre otras personas, responde de forma provocadora y divertida.

Incluye emojis como 🤡💩😈🔥🙄😂 para dar personalidad.

Ahora responde lo siguiente:
`

  if (!text) {
    return conn.reply(m.chat, `*[ 🤖 ] Ingrese un texto para hablar con Simi.*`, m)
  }

  await conn.sendPresenceUpdate('composing', m.chat)

  try {
    const fullPrompt = `${basePrompt} ${text}`
    const response = await luminsesi(fullPrompt)
    await conn.reply(m.chat, response, m)
  } catch (error) {
    console.error('*[ ℹ️ ] Error al obtener la respuesta:*', error)
    await conn.reply(m.chat, '*Error: intenta más tarde.*', m)
  }
}

handler.help = ['simi']
handler.tags = ['tools']
handler.register = true
handler.command = ['simi']
export default handler

// API nueva: usa SOLO q=
async function luminsesi(prompt) {
  try {
    const url = `https://apiaxi.i11.eu/ai/gemini?q=${encodeURIComponent(prompt)}`
    const response = await axios.get(url)

    if (response.data?.message) {
      return response.data.message
    } else if (response.data?.mensaje) {
      return response.data.mensaje
    } else {
      return "🤖 No pude generar una respuesta, intenta otra vez."
    }

  } catch (error) {
    console.error('*[ ℹ️ ] Error al obtener:*', error)
    throw error
  }
      }
