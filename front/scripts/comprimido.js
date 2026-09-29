// scripts/comprimido.js
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const PASTAS = ['public/armas', 'public/armaduras', 'public/escudo', 'public/esferas', 'public/municao', 'public/pals']

async function comprimir() {
  for (const pasta of PASTAS) {
    if (!fs.existsSync(pasta)) continue
    const arquivos = fs.readdirSync(pasta).filter(f => f.endsWith('.png'))
    console.log(`Comprimindo ${arquivos.length} arquivos de ${pasta}...`)
    
    for (const arquivo of arquivos) {
      const input = path.join(pasta, arquivo)
      const buffer = await sharp(input).png({ quality: 70, compressionLevel: 9 }).toBuffer()
      fs.writeFileSync(input, buffer)
    }
  }
  console.log('PRONTO! 500 arquivos comprimidos')
}

comprimir()