/**
 * GA4 + Meta Pixel helper.
 * GA4: G-BD02GW14CW (gtag.js)
 * Meta Pixel: 2667115627038009 (fbq)
 * Conversion API runs server-side; pass the same event_id so Meta can dedupe.
 */
(function (global) {
  var MEASUREMENT_ID = "G-BD02GW14CW";
  var META_PIXEL_ID = "2667115627038009";

  var META_STANDARD = {
    form_submit: "Lead",
    trial_start: "StartTrial",
  };

  global.dataLayer = global.dataLayer || [];
  if (typeof global.gtag !== "function") {
    global.gtag = function gtag() {
      global.dataLayer.push(arguments);
    };
  }

  var alreadyGa = !!(
    global.__AV_GA_CONFIGURED ||
    document.querySelector('script[src*="googletagmanager.com/gtag/js"]')
  );
  if (!alreadyGa) {
    global.gtag("js", new Date());
    global.gtag("config", MEASUREMENT_ID);
    var gaScript = document.createElement("script");
    gaScript.async = true;
    gaScript.src =
      "https://www.googletagmanager.com/gtag/js?id=" + MEASUREMENT_ID;
    document.head.appendChild(gaScript);
  }
  global.__AV_GA_CONFIGURED = true;

  if (!global.__AV_META_PIXEL_CONFIGURED) {
    global.__AV_META_PIXEL_CONFIGURED = true;
    if (!global.fbq) {
      var n = (global.fbq = function () {
        if (n.callMethod) n.callMethod.apply(n, arguments);
        else n.queue.push(arguments);
      });
      if (!global._fbq) global._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = "2.0";
      n.queue = [];
      var t = document.createElement("script");
      t.async = true;
      t.src = "https://connect.facebook.net/en_US/fbevents.js";
      var s = document.getElementsByTagName("script")[0];
      if (s && s.parentNode) s.parentNode.insertBefore(t, s);
      else document.head.appendChild(t);
    }
    global.fbq("init", META_PIXEL_ID);
    global.fbq("track", "PageView");
  }

  function newEventId() {
    if (global.crypto && typeof global.crypto.randomUUID === "function") {
      return global.crypto.randomUUID();
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      var v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  function trackMeta(name, eventId) {
    if (typeof global.fbq !== "function") return;
    var opts = { eventID: eventId };
    if (META_STANDARD[name]) {
      global.fbq("track", META_STANDARD[name], {}, opts);
    } else {
      global.fbq("trackCustom", name, {}, opts);
    }
  }

  function track(name, params) {
    var eventId =
      (params && (params.event_id || params.eventID)) || newEventId();
    var gtagParams = Object.assign({}, params || {}, { event_id: eventId });
    if (typeof global.gtag === "function") {
      global.gtag("event", name, gtagParams);
    }
    trackMeta(name, eventId);
    return eventId;
  }

  function trackIfFirstVehicle(payload) {
    if (!payload || !payload.isFirstVehicle) return;
    track("trial_activated", {
      event_id: payload.metaEventId || newEventId(),
    });
  }

  global.AVAnalytics = {
    measurementId: MEASUREMENT_ID,
    metaPixelId: META_PIXEL_ID,
    newEventId: newEventId,
    event: track,
    trackIfFirstVehicle: trackIfFirstVehicle,
  };
})(window);
