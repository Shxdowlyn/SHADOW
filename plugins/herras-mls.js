const handler = async (m, { conn }) => {
    // El contenido del código que se abre al dar clic
    const codeContent = `key: {
    remoteJid: '120363423514187718@g.us',
    fromMe: false,
    id: 'A54F66F85457C83E39DD96F8167074CF',
    participant: '276995896258574@lid'
  },
  body: '.ver',
  message: {
    extendedTextMessage: {
      text: '.ver',
      contextInfo: {
        stanzaId: 'SUKIB9B1F886466F7EFF',
        participant: '261181826699458@lid',
        quotedMessage: { conversation: '\\ntexto2' }
      }
    }
  }`

    const msg = {
        viewOnceMessage: {
            message: {
                interactiveMessage: {
                    // El botón interactivo que sale en la captura
                    nativeFlowMessage: {
                        buttons: [
                            {
                                name: "cta_code",
                                buttonParamsJson: JSON.stringify({
                                    display_text: "Ver código",
                                    title: "Código en Python",
                                    code: codeContent
                                })
                            }
                        ]
                    },
                    // El "texto2" que aparece abajo del botón en la captura
                    body: { text: "texto2" },
                    contextInfo: {
                        // IDs de tu estructura original
                        stanzaId: 'SUKIB9B1F886466F7EFF',
                        participant: '261181826699458@lid',
                        quotedMessage: {
                            conversation: "\ntexto2"
                        }
                    }
                }
            }
        }
    }

    await conn.relayMessage(m.chat, msg, { messageId: m.key.id })
}

handler.help = ['mls']
handler.tags = ['main']
handler.command = ['mls']

export default handler
