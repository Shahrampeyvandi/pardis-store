// ***************************************************
// Shopping Cart functions
// ***************************************************
var shoppingCart = (function () {
  // Private methods and properties
  var cart = [];

  function Item(item, count) {
    this.item = item;
    this.count = count;
  }

  function saveCart() {
    localStorage.setItem("shoppingCart", JSON.stringify(cart));
  }

  function loadCart() {
    cart = JSON.parse(localStorage.getItem("shoppingCart"));
    if (cart === null) {
      cart = [];
    }
  }

  loadCart();

  // Public methods and properties
  var obj = {};

  obj.addItemToCart = function (product, count) {
    for (var i in cart) {
      if (cart[i].id === product.id) {
        cart[i].count += count;
        saveCart();
        return;
      }
    }
    console.log("addItemToCart:", product, count);

    var item = new Item(product, count);
    cart.push(item);
    saveCart();
  };

  obj.setCountForItem = function (product_id, count) {
    for (var i in cart) {
      if (cart[i].item.id === product_id) {
        cart[i].count = count;
        break;
      }
    }
    saveCart();
  };

  obj.removeItemFromCart = function (product_id) {
    // Removes one item
    for (var i in cart) {
      if (cart[i].item.id === product_id) {
        // "3" === 3 false
        cart[i].count--; // cart[i].count --
        if (cart[i].count === 0) {
          cart.splice(i, 1);
        }
        break;
      }
    }
    saveCart();
  };

  obj.removeItemFromCartAll = function (product_id) {
    // removes all item name
    for (var i in cart) {
      if (cart[i].item.id === product_id) {
        cart.splice(i, 1);
        break;
      }
    }
    saveCart();
  };

  obj.clearCart = function () {
    cart = [];
    saveCart();
  };

  obj.countCart = function () {
    // -> return total count
    var totalCount = 0;
    for (var i in cart) {
      totalCount += cart[i].count;
    }

    return totalCount;
  };

  obj.totalCart = function () {
    // -> return total cost
    var totalCost = 0;
    for (var i in cart) {
      totalCost += cart[i].price * cart[i].count;
    }
    return totalCost.toFixed(2);
  };

  obj.listCart = function () {
    // -> array of Items
    var cartCopy = [];
    console.log("Listing cart");
    console.log(cart);
    for (var i in cart) {
      var item = cart[i];
      var itemCopy = {};
      for (var p in item) {
        itemCopy[p] = item[p];
      }
      itemCopy.total = (item.price * item.count).toFixed(2);
      cartCopy.push(itemCopy);
    }
    return cartCopy;
  };

  // ----------------------------
  return obj;
})();
// ***************************************************

$(".product-card__addtocart").click(function (e) {
  e.preventDefault();
  $(this).html($.app.ajax.Template($('#BtnSpinner').html(), {}));
  if ($(this).hasClass('is-loading')) return
  $(this).addClass('is-loading')
  var product_id = $(this).attr('data-id');
  var send_data = {
    product_id: 1,
  };

  var el = $(this)



  $.app.ajax.Operation({
    url: "https://jsonplaceholder.typicode.com/posts",
    data: send_data,
    callback: function (ResData) {
      console.log(ResData);

      el.html("افزودن به سبد");
      el.removeClass('is-loading')

      if (ResData.type == "success") {
        var dummy_cart_item_response = {
          data: {
            cart_id: 1,
            product: {
              id: 1232,
              title: "این یک عنوان تست است این یک عنوان تست است",
              price: "100000",
              image:
                "assets/images/0589ee66d13b4677adb6e978ec162be1.webp",
            },
            total_price: 430000
          },
          success: true,
        };

        el.hide()
        el.next().show()


        $('.header-basket-list').append($.app.ajax.Template($('#BasketCartItem').html(),
          {
            id: product_id,
            image: dummy_cart_item_response.data.product.image,
            title: dummy_cart_item_response.data.product.title,
            price: parseInt(dummy_cart_item_response.data.product.price).toLocaleString()
          }));
        $('.header-left-icons .header-left-icons__basket').removeClass('is-empty')
        $('.header-left-icons__basket .header-left-icon__basket-count').text(productsCount()).show()
        $('.header-basket-list__empty').hide()
        $('.shopping-cart__empty').hide()
        $('.header-cart-footer__details').show()
        $('.shopping-cart__total-amount-number').text(parseInt(dummy_cart_item_response.data.total_price).toLocaleString())
      }
      if (ResData.type == 'error') {
        alert('error')
      }
    },
  });
});


function changeProductCount(product_id, val) {
  $(".header-basket-list").find(`[data-id='${product_id}']`).find('.header-basket-list-item-count').val(val)
}
function productsCount() {
  return $(".header-basket-list").children().length
}


$(document).on('click', '.product-card__plus-btn', function (e) {
  e.preventDefault()
  if ($(this).hasClass('is-loading')) return
  $(this).addClass('is-loading')
  var html = $(this).html()
  $(this).html($.app.ajax.Template($('#BtnSpinner').html(), {}));
  var product_id = $(this).parents('.product-card__action-btns').attr('data-id');
  var send_data = {
    product_id: 1,
  };
  var el = $(this)

  $.app.ajax.Operation({
    url: "https://jsonplaceholder.typicode.com/posts",
    data: send_data,
    callback: function (ResData) {

      el.removeClass('is-loading')
      el.html(html);

      if (ResData.type == "success") {
        var dummy_cart_item_response = {
          data: {
            cart_id: 1,
            product: {
              id: 123,
              title: "عنوان محصول",
              price: {
                price: "100000",
                discount_price: "90000",
              },
              image:
                "assets/images/0589ee66d13b4677adb6e978ec162be1.webp",
            },
            total_price: 430000
          },
          success: true,
        };


        $('.shopping-cart__total-amount-number').text(dummy_cart_item_response.data.total_price)
        var num = parseInt(el.siblings('.product-card__add-counter').text())
        
        $(`.product-card__action-btns[data-id="${product_id}"]`).each(function (i, v) {
          $(v).find('.product-card__add-counter').text(num + 1);
        });
        $(".header-basket-list").find(`[data-id='${product_id}']`)
        if ($(".header-basket-list").find(`[data-id='${product_id}']`).length) {
          changeProductCount(product_id, num + 1)
        }
        $('.header-left-icons .header-left-icon__basket-count').text(productsCount()).show()
        if (num + 1 > 1) {
          el.siblings('.product-card__trash-btn').hide()
          el.siblings('.product-card__minus-btn').show()
        } else {
          el.siblings('.product-card__minus-btn').hide()
          el.siblings('.product-card__trash-btn').show()
        }
      }
    },
  });


})

$(document).on('click', '.product-card__minus-btn', function (e) {
  e.preventDefault()
  if ($(this).hasClass('is-loading')) return
  $(this).addClass('is-loading')
  var product_id = $(this).parents('.product-card__action-btns').attr('data-id');
  var html = $(this).html()
  $(this).html($.app.ajax.Template($('#BtnSpinner').html(), {}));

  var send_data = {
    product_id: 1,
  };
  var el = $(this)
  $.app.ajax.Operation({
    url: "https://jsonplaceholder.typicode.com/posts",
    data: send_data,
    callback: function (ResData) {
      el.html(html);
      el.removeClass('is-loading')

      if (ResData.type == "success") {
        var dummy_cart_item_response = {
          data: {
            cart_id: 1,
            product: {
              id: 123,
              title: "عنوان محصول",
              price: {
                price: "100000",
                discount_price: "90000",
              },
              image:
                "assets/images/0589ee66d13b4677adb6e978ec162be1.webp",
            },
            total_price: 430000
          },
          success: true,
        };



        $('.shopping-cart__total-amount-number').text(dummy_cart_item_response.data.total_price)
        var num = parseInt(el.siblings('.product-card__add-counter').text())
        $(`[data-id="${product_id}"]`).each(function (i, v) {
          $(v).find('.product-card__add-counter').text(num - 1);
        });
        changeProductCount(product_id, num - 1)
        $('.header-left-icons .header-left-icon__basket-count').text(productsCount()).show()

        if ((num - 1) < 2) {
          el.hide()
          el.siblings('.product-card__trash-btn').show()
        }
      }
    },
  });


})
$(document).on('click', '.product-card .product-card__trash-btn', function (e) {
  e.preventDefault()
  if ($(this).hasClass('is-loading')) return
  $(this).addClass('is-loading')
  // shoppingCart.removeItemFromCart()
  var product_id = $(this).parents('.product-card__action-btns').attr('data-id');
  var html = $(this).html()
  var send_data = {
    product_id: 1,
  };
  var el = $(this)
  el.html($.app.ajax.Template($('#BtnSpinner').html(), {}));

  $.app.ajax.Operation({
    url: "https://jsonplaceholder.typicode.com/posts",
    data: send_data,
    callback: function (ResData) {
      el.html(html)
      el.removeClass('is-loading')

      if (ResData.type == "success") {
        var dummy_cart_item_response = {
          data: {
            cart_id: 1,
            product: {
              id: 123,
              title: "عنوان محصول",
              price: {
                price: "100000",
                discount_price: "90000",
              },
              image:
                "assets/images/0589ee66d13b4677adb6e978ec162be1.webp",
            },
            total_price: 430000
          },
          success: true,
        };



        if ($(".header-basket-list").find(`[data-id='${product_id}']`).length) {
          $(".header-basket-list").find(`[data-id='${product_id}']`).remove()
          if (productsCount() == 0) $('.header-left-icons .header-left-icon__basket-count').text(productsCount()).hide()
        }

        el.parents('.product-card__action-btns').hide()
        el.parents('.product-card__action-btns').siblings('.product-card__addtocart').show()

        if (productsCount() == 0) {
          $('.header-left-icons .header-left-icons__basket').addClass('is-empty')
          $(".shopping-cart").removeClass("active");
          $('.header-left-icons .header-left-icon__basket-count').text(productsCount())
          $('.header-left-icons .header-left-icon__basket-count').hide()
          $('.header-cart-footer__details').hide()
          $('.header-basket-list__empty').show()
          $('.shopping-cart__empty').show()
        }
      }
    },
  });

})

$(document).on('click', '.header-basket-list .product-card__trash-btn', function (e) {
  e.preventDefault()
  // shoppingCart.removeItemFromCart()
  if ($(this).hasClass('is-loading')) return
  $(this).addClass('is-loading')
  var product_id = $(this).parents('.product-card__action-btns').attr('data-id');
  var html = $(this).html()
  var send_data = {
    product_id: 1,
  };
  var el = $(this)
  el.html($.app.ajax.Template($('#BtnSpinner').html(), {}));

  $.app.ajax.Operation({
    url: "https://jsonplaceholder.typicode.com/posts",
    data: send_data,
    callback: function (ResData) {
      el.removeClass('is-loading')

      if (ResData.type == "success") {
        var dummy_cart_item_response = {
          data: {
            cart_id: 1,
            product: {
              id: 123,
              title: "عنوان محصول",
              price: {
                price: "100000",
                discount_price: "90000",
              },
              image:
                "assets/images/0589ee66d13b4677adb6e978ec162be1.webp",
            },
            total_price: 430000
          },
          success: true,
        };

        el.parents(".js-mini-cart-item").remove();

        

        if (productsCount() == 0) {
          $('.header-left-icons .header-left-icons__basket').addClass('is-empty')
          $(".shopping-cart").removeClass("active");
          $('.header-cart-footer__details').hide()
          $('.header-left-icons .header-left-icon__basket-count').text(productsCount())
          $('.header-left-icons .header-left-icon__basket-count').hide()
          $('.header-basket-list__empty').show()
          $('.shopping-cart__empty').show()
        }

      }
    },
  });

})

