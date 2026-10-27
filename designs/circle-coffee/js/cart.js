var CircleCart = (function () {
  var KEY = "circle-coffee-basket";
  var ORDER_KEY = "circle-coffee-order";
  var ADDON_PRICE = {
    "Oat milk": 20,
    "Extra Shot": 30,
    "Extra syrup / sauce": 15
  };

  function read() {
    try {
      var items = JSON.parse(localStorage.getItem(KEY));
      return Array.isArray(items) ? items : [];
    } catch (error) {
      return [];
    }
  }

  function write(items) {
    localStorage.setItem(KEY, JSON.stringify(items));
    paintCount();
  }

  function addonKey(addons) {
    return (addons || []).slice().sort().join(",");
  }

  function sameLine(a, b) {
    return a.id === b.id && addonKey(a.addons) === addonKey(b.addons);
  }

  function unitPrice(item) {
    var extra = (item.addons || []).reduce(function (sum, name) {
      return sum + (ADDON_PRICE[name] || 0);
    }, 0);
    return item.price + extra;
  }

  function lineTotal(item) {
    return unitPrice(item) * item.qty;
  }

  function total(items) {
    return (items || read()).reduce(function (sum, item) {
      return sum + lineTotal(item);
    }, 0);
  }

  function count(items) {
    return (items || read()).reduce(function (sum, item) {
      return sum + item.qty;
    }, 0);
  }

  function money(amount) {
    return "₱" + amount;
  }

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
    });
  }

  function add(item) {
    var items = read();
    var qty = Math.max(1, Math.min(20, Number(item.qty) || 1));
    var next = {
      id: item.id,
      name: item.name,
      price: item.price,
      qty: qty,
      addons: item.addons || [],
      image: item.image
    };
    var found = null;
    items.forEach(function (row) {
      if (sameLine(row, next)) found = row;
    });
    if (found) found.qty = Math.min(99, found.qty + qty);
    else items.push(next);
    write(items);
  }

  function changeQty(index, qty) {
    var items = read();
    if (!items[index]) return;
    qty = Math.max(1, Math.min(99, qty));
    items[index].qty = qty;
    write(items);
  }

  function remove(index) {
    var items = read();
    items.splice(index, 1);
    write(items);
  }

  function clear() {
    write([]);
  }

  function saveOrder(details) {
    var order = {
      items: read(),
      total: total(),
      name: details.name,
      phone: details.phone,
      note: details.note,
      when: new Date().toISOString()
    };
    sessionStorage.setItem(ORDER_KEY, JSON.stringify(order));
    clear();
    return order;
  }

  function lastOrder() {
    try {
      return JSON.parse(sessionStorage.getItem(ORDER_KEY));
    } catch (error) {
      return null;
    }
  }

  function paintCount() {
    var n = count();
    document.querySelectorAll("[data-basket-count]").forEach(function (link) {
      link.textContent = n ? "BASKET (" + n + ")" : "BASKET";
    });
  }

  function addonText(item) {
    if (!item.addons || !item.addons.length) return "";
    return item.addons.map(function (name) {
      return esc(name) + " +" + money(ADDON_PRICE[name] || 0);
    }).join(", ");
  }

  function lineMarkup(item, index, editable) {
    var controls = editable
      ? '<div class="line-qty"><button type="button" data-qty="-1" data-index="' + index + '" aria-label="Less">−</button><span>' + item.qty + '</span><button type="button" data-qty="1" data-index="' + index + '" aria-label="More">+</button><button type="button" class="line-remove" data-remove="' + index + '">Remove</button></div>'
      : "<p>Qty " + item.qty + "</p>";
    var extras = addonText(item);
    return '<article class="basket-card">' +
      '<img src="' + esc(item.image) + '" alt="">' +
      "<div><h2>" + esc(item.name) + "</h2>" +
      (extras ? '<p class="line-addons">' + extras + "</p>" : "") +
      "<p>" + money(unitPrice(item)) + " each</p>" +
      controls +
      '<p class="basket-price">' + money(lineTotal(item)) + "</p></div></article>";
  }

  function mountBasket() {
    var empty = document.querySelector(".basket-empty");
    var list = document.querySelector("#basket-list");
    var summary = document.querySelector("#basket-summary");
    if (!list) return;
    var items = read();
    if (!items.length) {
      empty.hidden = false;
      list.innerHTML = "";
      summary.hidden = true;
      return;
    }
    empty.hidden = true;
    summary.hidden = false;
    list.innerHTML = items.map(function (item, index) {
      return lineMarkup(item, index, true);
    }).join("");
    document.querySelector("#basket-sum").textContent = money(total(items));
    list.onclick = function (event) {
      var qtyBtn = event.target.closest("[data-qty]");
      var removeBtn = event.target.closest("[data-remove]");
      if (qtyBtn) {
        var index = Number(qtyBtn.getAttribute("data-index"));
        var itemsNow = read();
        changeQty(index, itemsNow[index].qty + Number(qtyBtn.getAttribute("data-qty")));
        mountBasket();
      }
      if (removeBtn) {
        remove(Number(removeBtn.getAttribute("data-remove")));
        mountBasket();
      }
    };
  }

  function mountCheckout() {
    var box = document.querySelector("#checkout-lines");
    if (!box) return;
    var items = read();
    if (!items.length) {
      box.innerHTML = '<section class="basket-empty"><p>Your basket is empty.</p><a class="btn-coral" href="menu.html">BROWSE THE MENU</a></section>';
      var form = document.querySelector("#checkout-form");
      if (form) form.hidden = true;
      return;
    }
    box.innerHTML = items.map(function (item, index) {
      return lineMarkup(item, index, false);
    }).join("") + '<p class="checkout-total">Total <strong>' + money(total(items)) + "</strong></p>";
    document.querySelector("#checkout-form").addEventListener("submit", function (event) {
      event.preventDefault();
      var data = new FormData(event.target);
      saveOrder({
        name: data.get("name"),
        phone: data.get("phone"),
        note: data.get("note")
      });
      location.href = "order.html";
    });
  }

  function mountOrder() {
    var box = document.querySelector("#order-lines");
    if (!box) return;
    var order = lastOrder();
    if (!order || !order.items || !order.items.length) {
      box.innerHTML = '<section class="basket-empty"><p>No order to show.</p><a class="btn-coral" href="menu.html">BROWSE THE MENU</a></section>';
      return;
    }
    box.innerHTML = "<h2>Thanks, " + esc(order.name) + ".</h2><p>We’ll have this ready under " + esc(order.phone) + ".</p>" +
      order.items.map(function (item, index) {
        return lineMarkup(item, index, false);
      }).join("") +
      '<p class="checkout-total">Order total <strong>' + money(order.total) + "</strong></p>" +
      (order.note ? "<p>Note: " + esc(order.note) + "</p>" : "");
  }

  function bindMenu() {
    document.querySelectorAll(".addons label").forEach(function (label) {
      var name = label.textContent.trim();
      if (!ADDON_PRICE[name] || label.querySelector(".addon-price")) return;
      var price = document.createElement("span");
      price.className = "addon-price";
      price.textContent = " +" + money(ADDON_PRICE[name]);
      label.appendChild(price);
    });
    document.querySelectorAll(".sheet-add").forEach(function (button) {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        var panel = button.closest(".sheet-panel");
        var name = panel.querySelector("h2").textContent.trim();
        var price = Number(panel.querySelector(".sheet-price").textContent.replace(/[^\d]/g, ""));
        var qty = Number(panel.querySelector(".qty input").value) || 1;
        var id = (button.getAttribute("href") || "").split("#")[1];
        var addons = [];
        var skip = false;
        panel.querySelectorAll(".addons input").forEach(function (box) {
          if (!box.checked) return;
          var label = box.parentElement.textContent.split("+")[0].trim();
          if (label === "Not now") skip = true;
          else addons.push(label);
        });
        if (skip) addons = [];
        add({
          id: id,
          name: name,
          price: price,
          qty: qty,
          addons: addons,
          image: "images/" + id + ".jpg"
        });
        location.href = "basket.html";
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    paintCount();
    bindMenu();
    mountBasket();
    mountCheckout();
    mountOrder();
  });

  return { add: add, money: money };
})();
