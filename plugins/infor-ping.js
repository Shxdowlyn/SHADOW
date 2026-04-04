import speed from 'performance-now'
import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
  let timestamp = speed()
  let userId = m.sender
  let userName = conn.getName(userId)
  let userNumber = userId.split('@')[0]

  // 1. Mandamos el texto de carga rápido (sin esperar al fetch aún)
  let { key } = await conn.reply(m.chat, '❐ 𝐂𝐚𝐥𝐜𝐮𝐥𝐚𝐧𝐝𝐨 𝐏𝐢𝐧𝐠... 🚀', m)

  try {
    // 2. Preparamos la miniatura pequeña para el estilo Business
    const res = await fetch('https://i.bb.co/ZRLSTxY/b024390e236.jpg')
    const thumb = Buffer.from(await res.arrayBuffer())

    // 3. Creamos el mensaje citado (quoted) tipo Business
    const shadow_xyz = {
      key: {
        remoteJid: 'status@broadcast',
        fromMe: false,
        id: 'ShadowPingStatus',
        participant: '0@s.whatsapp.net'
      },
      message: {
        productMessage: {
          product: {
            productImage: {
              mimetype: 'image/jpeg',
              jpegThumbnail: thumb
            },
            title: 'WhatsApp Business • Estado',
            description: 'Shadow team',
            currencyCode: 'USD',
            priceAmount1000: 0,
            retailerId: 'ShadowCore',
            productImageCount: 1
          },
          businessOwnerJid: '584242773183@s.whatsapp.net'
        }
      }
    }

    let latency = speed() - timestamp
    let ping = latency.toFixed(0)

    let result = `
✨ *¡𝐏𝐎𝐍𝐆!* ✨

> 🌌 *𝐓𝐢𝐞𝐦𝐩𝐨:* ${ping}𝐦𝐬
> 👤 *𝐔𝐬𝐮𝐚𝐫𝐢𝐨:* ${userName} (@${userNumber})
> 👑 *𝐃𝐮𝐞𝐧̃𝐨𝐬:* 𝐘𝐨𝐬𝐮𝐞 (𝐒𝐡𝐚𝐝𝐨𝐰) & 𝐀𝐝𝐨
> 🏎️ *𝐋𝐢𝐧𝐮𝐱 𝐒𝐩𝐞𝐞𝐝:* 𝐌𝐚́𝐱𝐢𝐦𝐚 𝐕𝐞𝐥𝐨𝐜𝐢𝐝𝐚𝐝 🚀

🖥️ *𝐒𝐭𝐚𝐭𝐮𝐬:* 𝐎𝐧𝐥𝐢𝐧𝐞 
🛰️ *𝐍𝐨𝐝𝐞:* 𝐯𝟐𝟎.𝟏𝟏.𝟎
⚡ *𝐏𝐨𝐰𝐞𝐫:* 𝟏𝟎𝟎% 𝐂𝐚𝐩𝐚𝐜𝐢𝐭𝐲

*જ 𝐒𝐡𝐚𝐝𝐨𝐰 𝐆𝐚𝐫𝐝𝐞𝐧 𝐈𝐧𝐭𝐞𝐫𝐟𝐚𝐜𝐞 🧪 𖤓*`.trim()

    // 4. Borramos el de carga
    await conn.sendMessage(m.chat, { delete: key })

    // 5. Enviamos la imagen final con el quoted especial
    await conn.sendMessage(m.chat, { 
      image: { url: 'https://files.catbox.moe/yfdd3r.jpg' }, 
      caption: result, 
      mentions: [userId],
      contextInfo: {
        externalAdReply: {
          title: 'Shadow Garden Interface',
          body: 'System Status: Optimal',
          thumbnail: thumb,
          sourceUrl: 'https://whatsapp.com/channel/120363403739366547@newsletter',
          mediaType: 1,
          showAdAttribution: true
        }
      }
    }, { quoted: shadow_xyz })

  } catch (e) {
    console.error(e)
    // Si falla la imagen pequeña, manda la grande normal para no dejarte colgado
    await conn.sendMessage(m.chat, { 
      image: { url: 'https://files.catbox.moe/yfdd3r.jpg' }, 
      caption: '❌ Error en miniatura, pero aquí el ping rápido.' 
    }, { quoted: m })
  }
}

handler.help = ['ping']
handler.tags = ['informacion']
handler.command = ['ping', 'p']

export default handler
