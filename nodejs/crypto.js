const crypto = require('crypto');
const QRCode = require('qrcode');
const fs = require('fs');

function createHashedThing(string) {
  const c = crypto.createHash('sha512').update(string).digest('base64');
  return crypto.createHash('sha512').update(c).digest('base64');
}

fs.writeFile('hash.js', 'const crypto = [\n', (err) => {
  if (err) throw err;
});

for (let grade = 1; grade <= 3; grade++) {
  for (let className = 1; className <= 7; className++) {
    for (let number = 1; number <= 32; number++) {
      const hash = createHashedThing(
        `${grade * 2 - 1}${className * 2 - 1}${number * 2 - 1}hcu`
      );
      fs.appendFile(
        'hash.js',
        `{gcn: ${grade}0${className}${
          number >= 10 ? '' : '0'
        }${number}, hash: '${hash}'},\n`,
        (err) => {
          if (err) throw err;
        }
      );

      // QRCode.toDataURL(hash, (err, url) => {
      //   const data = url.replace(/.*,/, '');
      //   const image = new Buffer.from(data, 'base64');
      //   fs.writeFile(
      //     `qrs/${grade}0${className}${number >= 10 ? '' : '0'}${number}.png`,
      //     image,
      //     (err) => {
      //       if (err) throw err;
      //     }
      //   );
      // });
    }
  }
}
