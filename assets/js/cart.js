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
  var send_data = {
    product_id: 1,
  };

  var el = $(this)



  $.app.ajax.Operation({
    url: "https://jsonplaceholder.typicode.com/posts",
    data: send_data,
    callback: function (ResData) {
    //   if (ResData.success == "success") {
        if (true) {
        var dummy_cart_item_response = {
          data: {
            cart_id:1,
            product: {
              id:  1232,
              title: "عنوان محصول",
              price: {
                price: "100000",
                discount_price: "90000",
              },
              image:
                "https://dkstatics-public.digikala.com/digikala-products/89425b3496b3f56bf7f39cb970f01c1419712272_1657121566.jpg?x-oss-process=image/resize,m_lfit,h_300,w_300/quality,q_80",
            },
            total_price: 430000
          },
          success: true,
        };

        el.html("افزودن به سبد");
        el.removeClass('is-loading')



        el.hide()
        el.next().show()
        // shoppingCart.addItemToCart(dummy_cart_item_response.data.product, 1);
        
        $('.header-basket-list').append($.app.ajax.Template($('#BasketCartItem').html(), {id: dummy_cart_item_response.data.product.id}));
        $('.header-left-icons .header-basket-icon').removeClass('is-empty')
        $('.header-basket-icon .cart-count').text(productsCount()).show()

        // $('.header-cart-info-footer').show()
        $('.header-cart-info__empty').hide()
        $('.header-cart-footer__details').show()
        $('.header-cart-info-total-amount-number').text(dummy_cart_item_response.data.total_price)

      }
    },
  });
});


function changeProductCount(product_id,val) {
  $(".header-basket-list").find(`[data-id='${product_id}']`).find('.header-basket-list-item-count').val(val )
}
function productsCount() {
  return $(".header-basket-list").children().length
}


$(document).on('click', '.product-card__plus-btn',function(e) {
  e.preventDefault()
  if ($(this).hasClass('is-loading')) return
  $(this).addClass('is-loading')
  var html = $(this).html()
  $(this).html($.app.ajax.Template($('#BtnSpinner').html(), {}));
  var product_id = $(this).parents('.product-card').attr('data-id');

  var send_data = {
    product_id: 1,
  };
  var el = $(this)

  $.app.ajax.Operation({
    url: "https://jsonplaceholder.typicode.com/posts",
    data: send_data,
    callback: function (ResData) {
    //   if (ResData.success == "success") {
        if (true) {
        var dummy_cart_item_response = {
          data: {
            cart_id:1,
            product: {
              id:  123,
              title: "عنوان محصول",
              price: {
                price: "100000",
                discount_price: "90000",
              },
              image:
                "https://dkstatics-public.digikala.com/digikala-products/89425b3496b3f56bf7f39cb970f01c1419712272_1657121566.jpg?x-oss-process=image/resize,m_lfit,h_300,w_300/quality,q_80",
            },
            total_price: 430000
          },
          success: true,
        };

        el.removeClass('is-loading')
        el.html(html);
        $('.header-cart-info-total-amount-number').text(dummy_cart_item_response.data.total_price)
        var num =parseInt(el.siblings('.product-card__add-counter').text())
        // el.siblings('.product-card__add-counter').text(num + 1)
        $(`[data-id="1232"]`).each(function(i,v) {
          $(v).find('.product-card__add-counter').text(num + 1);
        });
        $(".header-basket-list").find(`[data-id='${product_id}']`)
        if ($(".header-basket-list").find(`[data-id='${product_id}']`).length) {
          changeProductCount(product_id, num + 1)
        }
        $('.header-left-icons .cart-count').text(productsCount()).show()
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

$(document).on('click','.product-card__minus-btn',function(e) {
  e.preventDefault()
  if ($(this).hasClass('is-loading')) return
  $(this).addClass('is-loading')
  var product_id = $(this).parents('.product-card').attr('data-id'); 
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
    //   if (ResData.success == "success") {
        if (true) {
        var dummy_cart_item_response = {
          data: {
            cart_id:1,
            product: {
              id:  123,
              title: "عنوان محصول",
              price: {
                price: "100000",
                discount_price: "90000",
              },
              image:
                "https://dkstatics-public.digikala.com/digikala-products/89425b3496b3f56bf7f39cb970f01c1419712272_1657121566.jpg?x-oss-process=image/resize,m_lfit,h_300,w_300/quality,q_80",
            },
            total_price: 430000
          },
          success: true,
        };

        el.html(html);
        el.removeClass('is-loading')

        $('.header-cart-info-total-amount-number').text(dummy_cart_item_response.data.total_price)
        var num =parseInt(el.siblings('.product-card__add-counter').text())
        $(`[data-id="1232"]`).each(function(i,v) {
          $(v).find('.product-card__add-counter').text(num - 1);
        });
        changeProductCount(product_id, num - 1)
        $('.header-left-icons .cart-count').text(productsCount()).show()
      
        if ((num - 1) < 2) {
          el.hide()
          el.siblings('.product-card__trash-btn').show()
        } 
      }
    },
  });
  
 
})
$(document).on('click','.product-card .product-card__trash-btn',function(e) {
  e.preventDefault()
  if ($(this).hasClass('is-loading')) return
  $(this).addClass('is-loading')
  // shoppingCart.removeItemFromCart()
  var product_id = $(this).parents('.product-card').attr('data-id');
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
    //   if (ResData.success == "success") {
        if (true) {
        var dummy_cart_item_response = {
          data: {
            cart_id:1,
            product: {
              id:  123,
              title: "عنوان محصول",
              price: {
                price: "100000",
                discount_price: "90000",
              },
              image:
                "https://dkstatics-public.digikala.com/digikala-products/89425b3496b3f56bf7f39cb970f01c1419712272_1657121566.jpg?x-oss-process=image/resize,m_lfit,h_300,w_300/quality,q_80",
            },
            total_price: 430000
          },
          success: true,
        };

        el.html(html)
        el.removeClass('is-loading')

        if ($(".header-basket-list").find(`[data-id='${product_id}']`)) {
          $(".header-basket-list").find(`[data-id='${product_id}']`).remove()
          if (productsCount() == 0) $('.header-left-icons .cart-count').text(productsCount()).hide()
        }
      
        el.parents('.product-card__added-btn').hide()
        el.parents('.product-card__added-btn').siblings('.product-card__addtocart').show()

        if (productsCount() == 0) {
        $('.header-left-icons .header-basket-icon').addClass('is-empty')

        }
      }
    },
  });
 
})

$(document).on('click','.header-basket-list .product-card__trash-btn',function(e) {
  e.preventDefault()
  // shoppingCart.removeItemFromCart()
  if ($(this).hasClass('is-loading')) return
  $(this).addClass('is-loading')
  var product_id = $(this).parents('.product-card').attr('data-id');
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
    //   if (ResData.success == "success") {
        if (true) {
        var dummy_cart_item_response = {
          data: {
            cart_id:1,
            product: {
              id:  123,
              title: "عنوان محصول",
              price: {
                price: "100000",
                discount_price: "90000",
              },
              image:
                "https://dkstatics-public.digikala.com/digikala-products/89425b3496b3f56bf7f39cb970f01c1419712272_1657121566.jpg?x-oss-process=image/resize,m_lfit,h_300,w_300/quality,q_80",
            },
            total_price: 430000
          },
          success: true,
        };

        el.parents(".js-mini-cart-item").remove();
        el.removeClass('is-loading')
      
        // el.parents('.product-card__added-btn').hide()
        // el.parents('.product-card__added-btn').siblings('.product-card__addtocart').show()

        if (productsCount() == 0) {
        $('.header-left-icons .header-basket-icon').addClass('is-empty')
        $('.header-cart-info-footer').hide()
        $(".mini-cart-dropdown").removeClass("active");
        $('.header-left-icons .cart-count').text(productsCount())
        if (productsCount() == 0) $('.header-left-icons .cart-count').hide()

        }

      }
    },
  });
 
})


$(".add-to-cart").click(function (event) {
  event.preventDefault();
  var name = $(this).attr("data-id");
  var price = Number($(this).attr("data-price"));

  shoppingCart.addItemToCart(name, price, 1);
  displayCart();
});

$("#clear-cart").click(function (event) {
  shoppingCart.clearCart();
  displayCart();
});

function displayCart() {
 
}

$("#show-cart").on("click", ".delete-item", function (event) {
  var name = $(this).attr("data-name");
  shoppingCart.removeItemFromCartAll(name);
  displayCart();
});

$("#show-cart").on("click", ".subtract-item", function (event) {
  var name = $(this).attr("data-name");
  shoppingCart.removeItemFromCart(name);
  displayCart();
});

$("#show-cart").on("click", ".plus-item", function (event) {
  var name = $(this).attr("data-name");
  shoppingCart.addItemToCart(name, 0, 1);
  displayCart();
});

$("#show-cart").on("change", ".item-count", function (event) {
  var name = $(this).attr("data-name");
  var count = Number($(this).val());
  shoppingCart.setCountForItem(name, count);
  displayCart();
});

displayCart();
