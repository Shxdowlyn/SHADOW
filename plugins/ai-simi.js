import axios from 'axios'

let handler = async (m, { conn, usedPrefix, command, text }) => {
  const username = `${conn.getName(m.sender)}`
  const sender = m.sender
  const isOwner = m.sender === '584242773183@s.whatsapp.net'

  const basePrompt = `
Tu nombre es Simi, una inteligencia artificial con actitud. Eres sarcástico, directo y no tienes filtros, pero sabes cuándo ser respetuoso y cuándo atacar.

- Si tu creador te habla (584242773183@s.whatsapp.net), respóndele siempre con respeto, pero con un toque sarcástico. No lo insultes, pero puedes bromear.  
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
    const response = await simiAI(fullPrompt)
    await conn.reply(m.chat, response, m)
  } catch (error) {
    console.error(error)
    await conn.reply(m.chat, '*Error: intenta más tarde.*', m)
  }
}

handler.help = ['simi']
handler.tags = ['tools']
handler.register = true
handler.command = ['simi']
export default handler

async function simiAI(prompt) {
  try {
    const url = `https://api.adoolab.xyz/ai/gemini?q=${encodeURIComponent(prompt)}`
    const response = await axios.get(url)

    if (response.data?.result) {
      return response.data.result
    } else {
      return "🤖 No pude generar una respuesta, intenta otra vez."
    }

  } catch (error) {
    console.error(error)
    throw error
  }
      }
