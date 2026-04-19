import axios from 'axios'

let handler = async (m, { conn, text }) => {

  const basePrompt = `
Tu nombre es Simi. Respondes con humor directo y personalidad fuerte, pero sin atacar a las personas. Mantén un tono juguetón y sarcástico.
Ahora responde lo siguiente:
`

  if (!text) return conn.reply(m.chat, `*[ 🤖 ] Ingrese un texto para hablar con Simi.*`, m)

  await conn.sendPresenceUpdate('composing', m.chat)

  try {
    const prompt = encodeURIComponent(basePrompt + "\nUsuario: " + text + "\nSimi:")
    const url = `https://api-gohan.onrender.com/ai/gemini?text=${prompt}`

    const response = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      timeout: 20000,
      validateStatus: () => true
    })

    console.log("STATUS:", response.status)
    console.log("HEADERS:", response.headers)
    console.log("DATA:", response.data)

    let data = response.data

    const respuesta =
      data?.result ||
      data?.response ||
      data?.message ||
      data?.text ||
      (typeof data === "string" ? data : JSON.stringify(data))

    await conn.reply(m.chat, respuesta, m)

  } catch (e) {
    console.log("ERROR REAL:", e)
    await conn.reply(m.chat, `*[ 🤖 ] Error al conectar con Simi. Intenta de nuevo.*`, m)
  }
}

handler.help = ['simi']
handler.tags = ['tools']
handler.register = true
handler.command = ['simi']

export default handler
