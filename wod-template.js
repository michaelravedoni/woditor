/* Get data from #wod-data */
var d = document.querySelectorAll('#wod-data')[0].innerHTML;
/* check if d contains at least one character of non whitespace */
if (/\S/.test(d)) {
  var data = JSON.parse(d);
  console.log(data);
}

/* Transparency */
Transparency.render(document.getElementById('wod-template-container'), data);



/**
* Get the template node and render with wod-data corresponding key.
*
* @param {Object} json JSON+LD coming from the wod-data.
* @param {String} key.
*
*/
/*
function dataRender(key, stack) {
  console.log(key+' type '+typeof stack[key]);
  var node = document.querySelectorAll('[data-wod-'+key+']')[0];
  if (node != undefined) {
    var nodeA = node.getAttribute('data-wod-'+key);
    if (typeof stack[key] === 'string') {
      console.log('in string if: '+stack[key]);
      node.innerHTML = stack[key];
    } else if (typeof stack[key] == 'object') {
      console.log('in object loop: '+stack[key]);
      node.innerHTML = "object not implemented";
    }
  }
  else {
    console.log('in else: '+stack[key]);
  }
}
*/
/* For each key in wod-data render it */
/*
for (var k in data) {
  if (data.hasOwnProperty(k)) {
    dataRender(k, data);
  }
}
*/
