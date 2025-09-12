const fs = require('fs');
const path = require('path');

// Fonction pour supprimer les console.log d'un fichier
function removeConsoleLogs(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Compter les console.log avant suppression
    const beforeCount = (content.match(/console\.log\(/g) || []).length;
    
    // Supprimer les console.log (en gardant les autres méthodes console)
    content = content.replace(/^\s*console\.log\([^;]*\);\s*$/gm, '');
    content = content.replace(/^\s*console\.log\([^;]*\);\s*$/g, '');
    
    // Supprimer les console.log sur plusieurs lignes
    content = content.replace(/^\s*console\.log\(\s*[\s\S]*?\);\s*$/gm, '');
    
    // Compter les console.log après suppression
    const afterCount = (content.match(/console\.log\(/g) || []).length;
    const removedCount = beforeCount - afterCount;
    
    if (removedCount > 0) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ ${filePath}: ${removedCount} console.log supprimés`);
      return removedCount;
    }
    
    return 0;
  } catch (error) {
    console.error(`❌ Erreur avec ${filePath}:`, error.message);
    return 0;
  }
}

// Fonction pour parcourir récursivement les dossiers
function walkDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Ignorer node_modules et .next
      if (!['node_modules', '.next', '.git', 'dist', 'build'].includes(file)) {
        walkDir(filePath, fileList);
      }
    } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Démarrer le processus
console.log('🚀 Début de la suppression des console.log...\n');

const srcDir = path.join(__dirname, 'src');
const files = walkDir(srcDir);

let totalFiles = 0;
let totalRemoved = 0;

files.forEach(file => {
  const removed = removeConsoleLogs(file);
  if (removed > 0) {
    totalFiles++;
    totalRemoved += removed;
  }
});

console.log(`\n📊 Résumé:`);
console.log(`- Fichiers modifiés: ${totalFiles}`);
console.log(`- Total console.log supprimés: ${totalRemoved}`);
console.log(`- Fichiers traités: ${files.length}`);



