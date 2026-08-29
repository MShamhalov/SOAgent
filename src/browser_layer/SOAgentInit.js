// ==UserScript==
// @name         SOAgent Init
// @namespace    http://tampermonkey.net/
// @version      2026-01-08
// @description  try to take over the world!
// @author       Magomed Shamkhalov
// @match        https://simple_one_instance_url.ru*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x5.ru
// @grant        none
// ==/UserScript==

(function () {
  'use strict';
  window.sa = {
    async runScript(scriptContent) {
      const body = JSON.stringify({ "script": scriptContent });

      const myHeaders = new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${s_user.accessToken}`
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: body,
        redirect: "follow",
      };

      try {
        const response = await fetch(`${document.location.origin}/v1/admin-script/run`, requestOptions);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        const resultData = result.data.info;
        return resultData;
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }
  };

  let _s_form_id;

  Object.defineProperty(window, 's_form_id', {
    get() {
      return _s_form_id;
    },
    set(value) {
      _s_form_id = value;
      window.s_form = s_widgets.getFormById(value);
    },
    configurable: true
  });
})();