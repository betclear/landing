/**
 * Capture Google Ads click IDs and store in first-party cookies.
 * Include on every betclear.app page (layout / _document / index.html).
 */
(function () {
  var DAYS = 90;

  function setCookie(name, value, days) {
    var d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie =
      name +
      "=" +
      encodeURIComponent(value) +
      ";expires=" +
      d.toUTCString() +
      ";path=/;SameSite=Lax";
  }

  function getCookie(name) {
    var m = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return m ? decodeURIComponent(m[2]) : "";
  }

  function getParam(key) {
    try {
      return new URLSearchParams(window.location.search).get(key) || "";
    } catch (e) {
      return "";
    }
  }

  ["gclid", "gbraid", "wbraid"].forEach(function (key) {
    var v = getParam(key);
    if (v) setCookie("_" + key, v, DAYS);
  });

  // Expose for checkout
  window.BetClearAttribution = {
    gclid: function () {
      return getCookie("_gclid") || getParam("gclid") || "";
    },
    gbraid: function () {
      return getCookie("_gbraid") || getParam("gbraid") || "";
    },
    wbraid: function () {
      return getCookie("_wbraid") || getParam("wbraid") || "";
    },
    all: function () {
      return {
        gclid: this.gclid(),
        gbraid: this.gbraid(),
        wbraid: this.wbraid(),
      };
    },
  };
})();
