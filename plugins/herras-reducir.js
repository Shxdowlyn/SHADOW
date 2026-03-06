import Jimp from 'jimp'
import axios from 'axios'
import FormData from 'form-data'
import pkg from '@whiskeysockets/baileys'

const { generateWAMessageFromContent, proto, prepareWAMessageMedia } = pkg

let handler = async (m, { conn, text }) => {

  if (!text) {
    return conn.reply(m.chat, `❍ Responde a una imagen/sticker para reducirlo.`, m)
  }

  let input = text.trim().split(/[x×]/i)
  if (input.length !== 2 || isNaN(input[0]) || isNaN(input[1])) {
    return m.reply(`❌ Formato incorrecto.\nUsa:  *${usedPrefix}reducir 300×300*`)
  }

  let width = parseInt(input[0])
  let height = parseInt(input[1])

  let media
  if (m.quoted && /image|sticker/.test(m.quoted.mtype)) {
    media = await m.quoted.download()
  } else if (/image|sticker/.test(m.mtype)) {
    media = await m.download()
  } else {
    return conn.reply(m.chat, `❍ Responde a una imagen/sticker para reducirlo.`, m)
  }

  try {
    // PROCESAR IMAGEN
    let image = await Jimp.read(media)
    image.resize(width, height)
    let buffer = await image.getBufferAsync(Jimp.MIME_JPEG)

    // SUBIR A IMGBB (API FUNCIONAL)
    let formData = new FormData()
    formData.append('image', buffer.toString('base64'))
    formData.append('key', '3a3e4f1e3a3c4d7c9d8f1b2e3c4d5f6a')

    let uploadRes = await axios.post('https://api.imgbb.com/1/upload', formData, {
      headers: formData.getHeaders()
    })

    let uploadedUrl = uploadRes.data.data.url

    // PREPARAR MEDIA PARA WHATSAPP
    let mediaMsg = await prepareWAMessageMedia(
      { image: buffer },
      { upload: conn.waUploadToServer }
    )

    // BOTÓN COPIAR
    const buttons = [{
      name: "cta_copy",
      buttonParamsJson: JSON.stringify({
        display_text: "♡ Copiar enlace",
        copy_code: uploadedUrl
      })
    }]

    // MENSAJE INTERACTIVO
    const msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          interactiveMessage: proto.Message.InteractiveMessage.fromObject({
            body: proto.Message.InteractiveMessage.Body.fromObject({
              text: `☁️ L I N K:\n${uploadedUrl}`
            }),
            footer: proto.Message.InteractiveMessage.Footer.fromObject({
              text: `Imagen reducida a *${width}×${height}*`
            }),
            header: proto.Message.InteractiveMessage.Header.fromObject({
              title: "ⓘ IMAGEN REDUCIDA",
              hasMediaAttachment: true,
              imageMessage: mediaMsg.imageMessage
            }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
              buttons
            })
          })
        }
      }
    }, { quoted: m })

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })

  } catch (e) {
    console.error(e)
    m.reply('⚠️ Ocurrió un error al procesar la imagen.')
  }
}

handler.command = ['reduce', 'reducir']
handler.help = ['reduce', 'reducir']
handler.tags = ['tools']

export default handler
