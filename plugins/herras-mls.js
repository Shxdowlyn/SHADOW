const handler = async (m, { conn }) => {
    const buttonParamsJson = JSON.stringify({
        title: "Código en Python",
        display_text: "Ver código",
        code: `key: {
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
  }`
    })

    const msg = {
        viewOnceMessage: {
            message: {
                interactiveMessage: {
                    body: { text: "texto2" },
                    footer: { text: "Shadow Bot — MLS" },
                    nativeFlowMessage: {
                        buttons: [
                            {
                                name: "cta_code",
                                buttonParamsJson: buttonParamsJson
                            }
                        ]
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
