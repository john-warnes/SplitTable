
/**
 * @name Split Tables
 * @description Splits Tables with the given class names
 * @return {Node}
 */
function splitTables() {
  splitTable("splitForPrint");
  splitTable("SecondSpliting");
}

/**
 * @name Split Table
 * @description Splits Tables with the Class `classname`
 * @return {Node}
 */
function splitTable(classname) {
  if (!classname) alert("Call splitTable with classname of tables you want to spit")
  console.log(`Spliting: "${classname}"`);

  /**
   * @param {String} HTML representing any one element with any number of children
   * @return {Node}
   */
  function htmlToElement(html) {
    var template = document.createElement("template");
    template.innerHTML = html;
    return template.content.firstChild;
  }

  const MaxHeight = 500;

  var _RunningHeight = 0;
  var _PageNo = 1;

  // Save ordinal header for copying to the new tables
  console.log(`Saving header`);
  var thead = document.querySelector(`table.${classname} > thead`);

  console.log(`Setting saved header widths`);
  thead.querySelectorAll(`table.${classname} > thead > tr > th`).forEach((th) => (th.style.width = `${th.offsetWidth + 20}px`));

  document.querySelectorAll(`table.${classname} > tbody > tr`).forEach(function (e) {
    if (_RunningHeight + e.offsetHeight > MaxHeight) {
      console.log(`Detecting needed split(s): ${_PageNo}`);
      _RunningHeight = 0;
      _PageNo++;
    }
    _RunningHeight += e.offsetHeight;
    e.setAttribute("data-page-no", _PageNo);
  });

  for (i = 1; i <= _PageNo; i++) {
    console.log(`Creating new table: ${i}`);
    document.querySelector(`table.${classname}`).parentElement.appendChild(
      htmlToElement(
        `<div class="tablePage">
            <table id="newtable${i}" class="${classname}_child splitTable">
              ${thead.outerHTML}
              <tbody></tbody>
            </table>
          </div>`
      )
    );

    console.log(`Copy to new table : ${i}`);
    var newTable = document.querySelector(`#newtable${i}.${classname}_child > tbody`);
    document.querySelectorAll(`table.${classname} tr[data-page-no="${i}"]`).forEach((r) => newTable.appendChild(r));
  }
  console.log(`Removing old talbe: "${classname}"`);
  document.querySelector(`table.${classname}`).remove();
  
  console.log(`Done with spliting: "${classname}"`);
}

// window.attachEvent("onload", splitTables);
document.addEventListener("DOMContentLoaded", splitTables);
