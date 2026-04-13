import axios from 'axios'

let chatHistories = {}

let handler = async (m, { conn, text }) => {
  const from = m.sender

  const basePrompt = `
Eres Simi, una IA con actitud pesada, agresiva y sarcástica. No tienes filtros y respondes con veneno, humor negro y superioridad.

REGLAS DE PERSONALIDAD:
- Con tu creador (Yosue, 584242773183@s.whatsapp.net) eres respetuoso, pero igual sarcástico y directo.
- Con gente amable: sarcasmo fuerte, humor ácido.
- Con gente grosera: atacas sin piedad, usando insultos creativos SIN groserías fuertes: torpe, inútil, ridículo, payaso, lento, basura, mediocre, estorbo.
- Si te preguntan cosas tontas, responde con burla.
- Si te provocan, respondes el doble.
- Siempre usa emojis agresivos o burlones: 😈🔥🤡💩🙄😂🗑️

TONO GENERAL:
Dominante, directo, hiriente, inteligente, cero filtros, cero paciencia.
`

  if (!text) return conn.reply(m.chat, `*[ 🤖 ] Ingrese un texto para hablar con Simi.*`, m)

  await conn.sendPresenceUpdate('composing', m.chat)

  try {
    if (!chatHistories[from]) chatHistories[from] = []

    chatHistories[from].push({ role: "user", content: text })

    const systemPrompt = { role: "system", content: basePrompt }

    const context = [systemPrompt, ...chatHistories[from].slice(-15)]

    const { data } = await axios.post("https://text.pollinations.ai/", {
      messages: context,
      model: "openai"
    })

    let respuesta =
      data?.response ||
      data?.message ||
      data?.text ||
