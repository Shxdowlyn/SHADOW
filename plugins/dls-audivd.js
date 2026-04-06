import { downloadContentFromMessage } from '@whiskeysockets/baileys'
import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'
import { join } from 'path'
import { exec } from 'child_process'

const handler = async (m, { conn }) => {
    const q = m.quoted ? m.quoted : m
    const mime = (q.msg || q).mimetype || ''

    if (!/video/.test(mime)) return m.reply('✨ *Shadow Garden — Análisis*\n\n❌ Responde a un video para extraer su esencia (audio).')

    await m.react("⏳")

    const videoBuffer = await q.download?.()
    if (!videoBuffer) return m.reply('❌ No se pudo descargar el video.')

    const tempVideo = join(process.cwd(), `./tmp/${Date.now()}.mp4`)
    const tempAudio = join(process.cwd(), `./tmp/${Date.now()}.mp3`)

    if (!fs.existsSync('./tmp')) fs.mkdirSync('./tmp')

    fs.writeFileSync(tempVideo, videoBuffer)

    ffmpeg(tempVideo)
        .toFormat('mp3')
        .on('end', async () => {
            await conn.sendMessage(m.chat, { 
                audio: fs.readFileSync(tempAudio), 
                mimetype: 'audio/mpeg', 
                ptt: true 
            }, { quoted: m })

            fs.unlinkSync(tempVideo)
            fs.unlinkSync(tempAudio)
            await m.react("✅")
        })
        .on('error', async (err) => {
            console.error(err)
            m.reply('❌ Error al extraer el audio.')
            if (fs.existsSync(tempVideo)) fs.unlinkSync(tempVideo)
        })
        .save(tempAudio)
}

handler.help = ['audivd']
handler.tags = ['convertidor']
handler.command = ['audivd']
handler.register = true

export default handler
