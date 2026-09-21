(function (global) {
  function money(n) {
    const x = Number(n);
    if (!Number.isFinite(x)) return 0;
    return Math.round(x * 100) / 100;
  }
  function hasNetCheck(v) {
    return v !== null && v !== undefined && v !== "";
  }
  function dealerRevenue(opts) {
    opts = opts || {};
    const sold = money(opts.soldPrice);
    const addOnRev = money(opts.addOnRevenue);
    if (sold > 0) return money(sold + addOnRev);
    if (hasNetCheck(opts.netCheck)) {
      return money(
        Number(opts.netCheck) -
          money(opts.salesTax) -
          money(opts.licenseFees),
      );
    }
    return 0;
  }
  function netProfit(opts) {
    opts = opts || {};
    return money(
      dealerRevenue(opts) -
        money(opts.vehicleCost) -
        money(opts.commission),
    );
  }
  global.AVDealProfit = { money, dealerRevenue, netProfit };
})(typeof window !== "undefined" ? window : globalThis);
