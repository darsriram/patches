const fs = require('fs');
const sharp = require('sharp');
const path = require('path');
const output = 'exports/logos';
const versions = [
 { name:'patches-full', width:1600,height:400,fg:'#29332e',brand:'#ff7043',bg:null },
 { name:'patches-icon',width:512,height:512,brand:'#ff7043',bg:null,icon:true },
 { name:'patches-black-background',width:1600,height:400,fg:'#ffffff',brand:'#ff7043',bg:'#000000' },
 { name:'patches-black-inverted',width:1600,height:400,fg:'#ffffff',brand:'#ffffff',bg:'#000000' },
];
(async()=>{for(const v of versions){
 const x=v.icon?76:100,y=v.icon?58:80,w=v.icon?360:220,h=v.icon?396:242;
 const back = 'M0 66Q0 48 17 40L107 2Q132 -7 132 20V110Q132 128 116 135L25 163Q0 172 0 146Z';
 const front = 'M46 110Q46 90 64 81L157 37Q180 28 180 55V143Q180 160 162 168L71 195Q46 204 46 179Z';
 const icon = `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="0 0 180 198"><path d="${back}" fill="${v.brand}"/><path d="${front}" fill="${v.brand}" fill-opacity=".52"/></svg>`;
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${v.width}" height="${v.height}" viewBox="0 0 ${v.width} ${v.height}" role="img" aria-label="Patches${v.icon?' icon':''}"><defs><filter id="brand" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 -1 -1 -1 0 3"/><feComposite operator="in" in2="SourceGraphic" result="mask"/><feFlood flood-color="${v.brand}"/><feComposite operator="in" in2="mask"/></filter></defs>${v.bg?`<rect width="100%" height="100%" fill="${v.bg}"/>`:''}${icon}${v.icon?'':`<text x="390" y="249" fill="${v.fg}" font-family="Helvetica Neue,Arial,sans-serif" font-size="150" font-weight="500" letter-spacing="24">PATCHES</text>`}</svg>`;
 fs.writeFileSync(path.join(output,v.name+'.svg'),svg);
 await sharp(Buffer.from(svg)).png().toFile(path.join(output,v.name+'.png'));
 console.log(v.name);
}})().catch(e=>{console.error(e);process.exit(1)});
