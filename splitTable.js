
/**
 * @name Split Table
 * @description Splits Tables with the Class `className`
 * @return {Node}
 */
function splitTables() {
  let log = console.log;
  const className = 'splitForPrint';
  const MaxHeight = 200;
  log(`Splitting.`);

  /**
   * @param {String} HTML representing any one element with any number of children
   * @return {Node}
   */
  function htmlToElement(html) {
    var template = document.createElement("template");
    template.innerHTML = html;
    return template.content.firstChild;
  }


  let tables = document.querySelectorAll(`table.${className}`)

  for (table_index = 0; table_index < tables.length; table_index++) {
    log(`number of tables: ${tables.length}`)
    log(`index: ${table_index}`)

    let ntable = tables[table_index];

    let _RunningHeight = 0;
    let _PageNo = 1;

    // Save ordinal header for copying to the new tables
    log(`Saving header`);
    var thead = ntable.querySelector(`thead`);

    log(`Setting saved header widths`);
    thead.querySelectorAll(`tr > th`).forEach((th) => (th.style.width = `${th.offsetWidth + 20}px`));

    ntable.querySelectorAll(`tbody > tr`).forEach(function (e) {
      if (_RunningHeight + e.offsetHeight > MaxHeight) {
        log(`Detecting needed split(s): ${_PageNo}`);
        _RunningHeight = 0;
        _PageNo++;
      }
      _RunningHeight += e.offsetHeight;
      e.setAttribute("data-page-no", _PageNo);
    });

    for (i = 1; i <= _PageNo; i++) {
      log(`Creating new table: ${i}`);
      ntable.parentElement.appendChild(
        htmlToElement(
          `<div class="tablePage">
              <table id="${className}_${table_index}_${i}" class="splitTable">
                ${thead.outerHTML}
                <tbody></tbody>
              </table>
            </div>`
        )
      );

      log(`Copying rows to new table : ${i}`);
      var newTable = document.querySelector(`#${className}_${table_index}_${i}.splitTable > tbody`);
      ntable.querySelectorAll(`tr[data-page-no="${i}"]`).forEach((r) => newTable.appendChild(r));
    }
    log(`Removing old table.`);
    ntable.remove();
  }
  log(`Done with splitting.`);

}

// window.attachEvent("onload", splitTables);
document.addEventListener("DOMContentLoaded", splitTables);
