/** EE:BrowserScript */
const path = document.location.pathname.split('/');
if (path[1] !== 'record' && !/\d{18}/.test(path[3])) {
  console.error("Перейдите на страницу с записью!");
}
let attrString = '';

(async function () {
  const tableName = path[2];
  const recordId = path[3];
  const silentMode = false;

  const states = {
    registered:       '1',
    open: 				    '2',
    inprogress:			  '3',
    closedcomplete:	  '4',
    closedincomplete: '5',
    readyfortest:	 	  '6',
    draft:				    '7',
	  eadyfordeploy:   	'8',
	  canceled: 			  '10',
  };

  const attributes = {
    status: states.open, 
    rem_attr: {
      x5rem_partner: "175163074607200304"
    }
  };
  
  console.log(await changeRecord(attributes, tableName, recordId, silentMode));
})();

async function changeRecord(attributes, tableName, recordId, silentMode = false) {
  attrString = '';

  for (const currentAttribute in attributes) {
    if (currentAttribute === 'rem_attr') {
      const remAttrs = attributes.rem_attr;
       if (remAttrs && Object.keys(remAttrs).length > 0) {
         for (const currentRemAttr in remAttrs) {
        const value = remAttrs[currentRemAttr];
        attrString += `record.rem_attr.setValue('${currentRemAttr}', ${JSON.stringify(value)});\n`;
      }
    } else {
      const value = attributes[currentAttribute];
     attrString += `record.setValue('${currentAttribute}', ${JSON.stringify(value)});\n`;
    }
  }
  
  const code = `
    const record = new SimpleRecord('${tableName}');
    record.get('${recordId}');
    ${attrString}
    record.silentMode(${silentMode});
    print (record.update());
  `;

  return await sa.runScript(code);
}