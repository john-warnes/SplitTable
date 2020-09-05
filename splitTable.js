/**
 * @name Split Tables
 * @description Splits Tables with the Class `splitForPrint`
 * @return {Node}
 */
function splitTables() {
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
  var thead = document.querySelector("table.splitForPrint > thead");
  thead.querySelectorAll("thead > tr > th").forEach((th) => (th.style.width = `${th.offsetWidth + 20}px`));

  document.querySelectorAll("table.splitForPrint > tbody > tr").forEach(function (e) {
    if (_RunningHeight + e.offsetHeight > MaxHeight) {
      _RunningHeight = 0;
      _PageNo++;
    }
    _RunningHeight += e.offsetHeight;
    e.setAttribute("data-page-no", _PageNo);
  });

  for (i = 1; i <= _PageNo; i++) {
    document.querySelector("table.splitForPrint").parentElement.appendChild(
      htmlToElement(
        `<div class="tablePage">
            <table id="Table${i}" class="splitTable">
              ${thead.outerHTML}
              <tbody></tbody>
            </table>
          </div>`
      )
    );

    var newTable = document.querySelector(`#Table${i} > tbody`);
    document.querySelectorAll(`table tr[data-page-no="${i}"]`).forEach((r) => newTable.appendChild(r));
  }
  document.querySelector("table.splitForPrint").remove();
}

// window.attachEvent("onload", splitTables);
document.addEventListener("DOMContentLoaded", splitTables);
