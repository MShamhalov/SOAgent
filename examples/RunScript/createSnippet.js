(function () {
  const fs = require('fs');
  const path = require('path');
  const { exec } = require('child_process');
  const dir = './tmp/snippets';

  const newFile = getNextSnippetFileName(fs, dir);
  const pachToFile = dir + '/' + newFile;
  fs.writeFileSync(pachToFile, '', (err) => { if (err) throw err; }, 'as');
  exec(`code -r ${pachToFile}`);
})();

function getNextSnippetFileName(fs, dirPath) {
   if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const files = fs.readdirSync(dirPath);
  const regex = /^snippet_(\d+)\.js$/;
  const indices = files
    .map(file => {
      const match = file.match(regex);
      return match ? parseInt(match[1], 10) : null;
    })
    .filter(num => num !== null);
  const maxIndex = indices.length > 0 ? Math.max(...indices) : 0;
  const newIndex = maxIndex + 1;
  const newFileName = `snippet_${newIndex}.js`;

  return newFileName;
}
