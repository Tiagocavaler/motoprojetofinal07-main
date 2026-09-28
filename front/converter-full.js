const fs = require('fs');
const path = require('path');

const ROOT = '.';
const MOBILE = '../palworld-mobile';

function copyAndConvert(src, dest) {
  if (!fs.existsSync(src)) {
    console.log('PULANDO (não existe):', src);
    return;
  }
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(f => {
      if (['.next', 'node_modules', '.git'].includes(f)) return;
      copyAndConvert(path.join(src, f), path.join(dest, f));
    });
  } else {
    // Só converte TS/JS
    if (src.endsWith('.tsx') || src.endsWith('.ts') || src.endsWith('.js') || src.endsWith('.jsx')) {
      let content = fs.readFileSync(src, 'utf8');
      content = content.replace(/<div/g, '<View').replace(/<\/div>/g, '</View>');
      content = content.replace(/className=/g, 'style=');
      content = content.replace(/<button/g, '<TouchableOpacity').replace(/<\/button>/g, '</TouchableOpacity>');
      content = content.replace(/<img/g, '<Image');
      if (!fs.existsSync(path.dirname(dest))) fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, content);
      console.log(`Convertido: ${src}`);
    } else {
      if (!fs.existsSync(path.dirname(dest))) fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(src, dest);
    }
  }
}

console.log('Iniciando conversão total...');
copyAndConvert(path.join(ROOT, 'app'), path.join(MOBILE, 'app'));
copyAndConvert(path.join(ROOT, 'lib'), path.join(MOBILE, 'lib'));
copyAndConvert(path.join(ROOT, 'public'), path.join(MOBILE, 'assets'));
if (fs.existsSync(path.join(ROOT, 'components'))) {
  copyAndConvert(path.join(ROOT, 'components'), path.join(MOBILE, 'components'));
}
console.log('✅ TUDO CONVERTIDO DE UMA VEZ!');