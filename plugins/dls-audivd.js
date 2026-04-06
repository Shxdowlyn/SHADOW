import { downloadMediaMessage } from '@whiskeysockets/baileys'
import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'
import { join } from 'path'

const handler = async (m, { conn }) => {
    const q = m.quoted ? m.quoted : m
    const mime = (q.msg || q).mimetype || ''

    if (!/video/.test(mime)) return m.reply('✨ *Shadow Garden — Análisis*\n\n❌ Responde a un video para extraer su audio.')

    await m.react("⏳")

    try {
        const videoBuffer = await downloadMediaMessage(q, 'buffer', {}, { logger: console })
        if (!videoBuffer) return m.reply('❌ No se pudo obtener el video.')

        const tempDir = join(process.cwd(), './tmp')
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir)

        const tempVideo = join(tempDir, `${Date.now()}.mp4`)
        const tempAudio = join(tempDir, `${Date.now()}.mp3`)

        fs.writeFileSync(tempVideo, videoBuffer)

        ffmpeg(tempVideo)
            .toFormat('mp3')
            .on('end', async () => {
                const audioBuffer = fs.readFileSync(tempAudio)
                
                await conn.sendMessage(m.chat, { 
                    audio: audioBuffer, 
                    mimetype: 'audio/mpeg', 
                    ptt: false,
                    contextInfo: {
                        externalAdReply: {
                            title: 'Shadow Garden - Audio Extractor',
                            body: 'Audio extraído con éxito 🌌',
                            thumbnailUrl: 'https://i.ibb.co/fdjQ3zng/dec97605db05.jpg',
                            sourceUrl: global.redes,
                            mediaType: 1,
                            showAdAttribution: true
                        }
                    }
                }, { quoted: m })

                if (fs.existsSync(tempVideo)) fs.unlinkSync(tempVideo)
                if (fs.existsSync(tempAudio)) fs.unlinkSync(tempAudio)
                await m.react("✅")
            })
            .on('error', (err) => {
                console.error(err)
                m.reply('❌ Error en la conversión.')
                if (fs.existsSync(tempVideo)) fs.unlinkSync(tempVideo)
            })
            .save(tempAudio)

    } catch (e) {
        console.error(e)
        m.reply('❌ Fallo al procesar el archivo.')
    }
}

handler.help = ['audivd']
handler.tags = ['convertidor']
handler.command = ['audivd']
handler.register = true

export default handler
