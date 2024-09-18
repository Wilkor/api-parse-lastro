const path = require('path');
const fs = require("fs");


const uuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  })
}

const readRecursiveDirectory = (dir, filelist = ['']) => {
  try {
    let pathDir = path.join(process.cwd(), './src', dir);
    let files = fs.readdirSync(pathDir);
    filelist = filelist.length ? filelist : [''];
    files.forEach((file) => {
      if (fs.statSync(path.join(pathDir, file)).isDirectory()) {
        filelist = readRecursiveDirectory(path.join(dir, file), filelist);
      } else {
        filelist.push(path.join(dir, file));
      }
    });
  } catch (e) {

    console.log(e)
    throw e;
  }
  return filelist;
};

const normalizePhoneNumber = (phone) => {

  let number = phone;
  number = number.replace(/[^\d+]+/g, '');
  number = number.replace(/^00/, '+');
  if (number.match(/^1/)) number = number;
  if (!number.match(/^\+/)) number = number;

  return number;

}

const validaTelefone = (phoneText) => {

  let phoneNumber = phoneText.replace(/\D+/g, '').trim();

  var RegExp = /^(([1-2][0-8])(9\d{4})\d{4})|(((1[2-9]{1})|([2-9]{1}\d{1}))[5-9]\d{3}\d{4})$/

  if (RegExp.test(phoneNumber))
    return phoneNumber
  return false;
}


const formatMoney = (n, c, d, t) => {
  c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "," : d, t = t == undefined ? "." : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
  return "R$ " + s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
}

const createParameters = (array) => {

  const parameters = [];

  for (const iterator of array) {

    parameters.push({
      "type": "text",
      "text": `${iterator}`
    }
    )

  }

  return parameters;

}
const createExtras = (array) => {

  let extras = {
     broadcastOrigem: array[0]
  }

  array.forEach((ex, index) => {

  let idx = index + 1;

  extras[`additionalProp${idx}`] = ex


  })


return extras;

}

const removeDuplicates = (array) => {


  const uniq = [...new Set(array.map(({ Marca }) => options))].map(e => array.find(({ Marca }) => Marca === e));

  return uniq
}


 const convertThread = (dados, payloadMovidesk) => {

  const conversaBot = dados.resource.items.map((e) => {

    const types = ["image/jpeg", "hsm", "application/pdf", "audio/ogg"]

    return {
      autor: e.direction === 'sent' ? e.metadata["#messageEmitter"] ? 'Chat Humano' : 'ChatBot' : 'Cliente',
      id: e.id,
      direction: e.direction,
      text: e.type === 'text/plain' ? e.content : e.type === 'application/json' ? `Template usado: ${e.content.template.name}` : e.type === 'application/vnd.lime.select+json' ? createMenu(e) : e.type === 'application/vnd.lime.media-link+json' ? `Arquivo enviado do tipo: ${e.content.type}` : 'início do atendimento',
      type: typeof e.content === 'object' ? e.content.type : 'text',
      url: typeof e.content === 'object' ? e.content.uri : '',
      data: e.date.split('T')[0].split('-').reverse().join('/'),
      hora: formatDate(e.date)
    }
  }).filter(e => e != null)

  return toString(conversaBot);

}


function toString(conversaBot) {

  let context = [];

  conversaBot.forEach((e) => {
    context.push({ autor: e.autor, text: e.text, direction: e.direction, date: `${e.data} ${e.hora}` });
  })
  return {
    "contexto": context
  }

}


function createMenu(menu) {

  let texto = ``;

  texto = `${menu.content.text}<br><br>`;

  menu.content.options.forEach((e, index) => {

    let idx = index + 1;

    texto += `${idx} - ${e.text} <br>`;

  })

  return texto;

}



const formatDate = (date) => {
  const ndate = new Date(date);

  return `${ndate.getHours()}:${ndate.getMinutes()}:${ndate.getSeconds()}`
}

module.exports = {
  uuid,
  readRecursiveDirectory,
  normalizePhoneNumber,
  validaTelefone,
  formatMoney,
  createParameters,
  createExtras,
  removeDuplicates,
  convertThread
}