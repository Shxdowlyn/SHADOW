const handler = async (m, { conn }) => {
  // El texto que va dentro de la ventana de código
  const code = `key: {
    remoteJid: '120363423514187718@g.us',
    id: 'A55710042BA2828678DF2B26299FE371',
    participant: '276995896258574@lid'
  },
  message: Message {
    extendedTextMessage: ExtendedTextMessage {
      text: '.ver',
      contextInfo: {
        stanzaId: 'SUKI236A27D55592C20C',
        participant: '261181826699458@lid'
      }
    }
  }`

  // Esta es la estructura que "engaña" a WhatsApp para que muestre el botón gris
  const fakeQuoted = {
    key: {
      remoteJid: m.chat,
      fromMe: false,
      id: 'SUKI236A27D55592C20C',
      participant: '261181826699458@lid'
    },
    message: {
      interactiveMessage: {
        header: { title: "Código en Python" },
        body: { text: "Ver código" },
        nativeFlowMessage: {
          buttons: [{
            name: "cta_code",
            buttonParamsJson: JSON.stringify({
              display_text: "Ver código",
              title: "Código en Python",
              code: code
            })
          }]
        }
      }
    }
  }

  // Enviamos el texto2 citando el mensaje falso de arriba
  await conn.sendMessage(m.chat, { text: 'texto2' }, { quoted: fakeQuoted })
}

handler.help = ['mls']
handler.tags = ['main']
handler.command = ['mls']

export default handler
