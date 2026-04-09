const handler = async (m, { conn }) => {
  // Este es el contenido que se verá al darle a "Ver código"
  const codeContent = `key: {
    remoteJid: '120363423514187718@g.us',
    remoteJidAlt: undefined,
    fromMe: false,
    id: 'A55710042BA2828678DF2B26299FE371',
    participant: '276995896258574@lid',
    participantAlt: '51928616320@s.whatsapp.net',
    addressingMode: 'lid'
  },
  message: Message {
    extendedTextMessage: ExtendedTextMessage {
      text: '.ver',
      contextInfo: ContextInfo {
        stanzaId: 'SUKI236A27D55592C20C',
        participant: '261181826699458@lid',
        quotedMessage: Message { conversation: 'HTML_CODE_CONTENT...' }
      }
    }
  },
  id: 'A55710042BA2828678DF2B26299FE371',
  chat: '120363423514187718@g.us',
  sender: '276995896258574@lid',
  pushName: 'Manuel VG',
  body: '.ver'`

  await conn.sendMessage(m.chat, {
    text: 'texto2',
    contextInfo: {
      externalAdReply: {
        title: 'Código en Python',
        body: 'Ver código',
        mediaType: 1,
        previewType: 0,
        renderLargerThumbnail: false,
        thumbnailUrl: 'https://files.catbox.moe/wfd0ze.jpg', // Tu logo de Shadow
        sourceUrl: 'https://whatsapp.com'
      },
      // Usamos el ID y participante de tu estructura para que sea idéntico
      stanzaId: 'SUKI236A27D55592C20C',
      participant: '261181826699458@lid',
      quotedMessage: {
        conversation: codeContent
      }
    }
  }, { quoted: m })
}

handler.help = ['mls']
handler.tags = ['main']
handler.command = ['mls']

export default handler
