import fs from 'fs';
import { createCanvas } from 'canvas'; // 1. canvas node - precisa npm i canvas, se não tiver cai no catch

// 2. se não tiver canvas, faz sem: só cria JPG escuro válido
try {
  const canvas = createCanvas(2048, 1536); // 3. Tamanho oficial do mapa Palworld - 2048x1536
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#0a1a2a'; // 4. Fundo oceano escuro
  ctx.fillRect(0,0,2048,1536);
  // 5. desenha ilhas fake pra parecer mapa - só placeholder até baixar o real
  ctx.fillStyle = '#1e3a2a';
  ctx.beginPath(); ctx.ellipse(400,400,200,200,0,0,Math.PI*2); ctx.fill(); // 6. Ilha 1
  ctx.fillStyle = '#2a3d1e';
  ctx.beginPath(); ctx.ellipse(1500,300,250,150,0,0,Math.PI*2); ctx.fill(); // 7. Ilha 2
  ctx.fillStyle = '#3d3420';
  ctx.beginPath(); ctx.ellipse(400,1000,250,250,0,0,Math.PI*2); ctx.fill(); // 8. Ilha 3
  
  fs.mkdirSync('public/map',{recursive:true}); // 9. Cria pasta se não existe
  fs.writeFileSync('public/map/palworld-official.jpg', canvas.toBuffer('image/jpeg')); // 10. Salva jpg que o componente /guia/mapa espera
  console.log('Mapa gerado em public/map/palworld-official.jpg');
} catch {
  // 11. fallback se não tiver canvas instalado - só cria pasta - evita quebrar build no vercel que não tem canvas
  fs.mkdirSync('public/map',{recursive:true});
  console.log('Pasta public/map criada. Coloca qualquer JPG de 2048x1536 lá como palworld-official.jpg');
}