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

$(document).on('click','.product-card__addtocart',function (e) {
  e.preventDefault();
  $(this).html($.app.ajax.Template($('#BtnSpinner').html(), {}));
  if ($(this).hasClass('is-loading')) return
  $(this).addClass('is-loading')
  $(this).attr('disabled',true)
  var product_id = $(this).attr('data-id');
  var payload = {
    product_id: product_id,
  };

  var el = $(this)



  $.app.ajax.Operation({
    url: "https://jsonplaceholder.typicode.com/posts",
    data: payload,
    callback: function (ResData) {
      console.log(ResData);

      el.html("افزودن به سبد");
      el.removeClass('is-loading')
      el.removeAttr('disabled')

      if (ResData.type == "success") {
        var dummy_cart_item_response = {
          data: {
            cart_id: 1,
            product: {
              id: 1232,
              title: "این یک عنوان تست است این یک عنوان تست است",
              price: "100000",
              image:
                "./assets/images/0589ee66d13b4677adb6e978ec162be1.webp",
            },
            total_price: "43,000",
            partial_price: "40,000",
            shipping_price: "4000",
            tax_price: "200",
            discount: "1000"
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

             $(`.product-card__addtocart[data-id="${product_id}"]`).hide()
             $(`.product-card__action-btns[data-id="${product_id}"]`).show()
            

        $('.header-left-icons .header-left-icons__basket').removeClass('is-empty')
        $('.header-left-icon__basket-count').text(productsCount()).show()
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
  $(this).attr('disabled',true)
  var html = $(this).html()
  $(this).html($.app.ajax.Template($('#BtnSpinner').html(), {}));
  var product_id = $(this).parents('.product-card__action-btns').attr('data-id');
  var el = $(this)
  
  var payload = {
    product_id: product_id,
  };
  if (el.parents('tr').attr('data-information') == 'basket') {
    payload['withTotals'] = true
  }
  

  $.app.ajax.Operation({
    url: "https://jsonplaceholder.typicode.com/posts",
    data: payload,
    callback: function (ResData) {

      el.removeClass('is-loading')
      el.removeAttr('disabled')
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
                "./assets/images/0589ee66d13b4677adb6e978ec162be1.webp",
            },
            total_price: "43,000",
            partial_price: "40,000",
            shipping_price: "4000",
            tax_price: "200",
            discount: "1000"
          },
          success: true,
        };


        $('.shopping-cart__total-amount-number').text(dummy_cart_item_response.data.total_price)
        var num = parseInt(el.siblings('.product-card__add-counter').text())
        console.log($(`.product-card__action-btns[data-id="${product_id}"]`));
        $(`.product-card__action-btns[data-id="${product_id}"]`).each(function (i, v) {
          var counter = $(v).find('.product-card__add-counter')
          counter.text(num + 1);
          if (num + 1 > 1) {
            counter.siblings('.product-card__trash-btn').hide()
            counter.siblings('.product-card__minus-btn').show()
          } else {
            counter.siblings('.product-card__minus-btn').hide()
            counter.siblings('.product-card__trash-btn').show()
          }
        });
        $(".header-basket-list").find(`[data-id='${product_id}']`)
        if ($(".header-basket-list").find(`[data-id='${product_id}']`).length) {
          changeProductCount(product_id, num + 1)
        }
        $('.header-left-icon__basket-count').text(productsCount()).show()

        if ($('table.cart__totals').length) {
          $('.partial-total').text(dummy_cart_item_response.data.partial_price)
          $('.shipping-price').text(dummy_cart_item_response.data.shipping_price)
          $('.total-price').text(dummy_cart_item_response.data.total_price)
          $('.tax-price').text(dummy_cart_item_response.data.tax_price)
        }
       
      }
    },
  });


})

$(document).on('click', '.product-card__minus-btn', function (e) {
  e.preventDefault()
  if ($(this).hasClass('is-loading')) return
  $(this).addClass('is-loading')
  $(this).attr('disabled',true)
  var product_id = $(this).parents('.product-card__action-btns').attr('data-id');
  var html = $(this).html()
  $(this).html($.app.ajax.Template($('#BtnSpinner').html(), {}));

  var payload = {
    product_id: 1,
  };
  var el = $(this)
  $.app.ajax.Operation({
    url: "https://jsonplaceholder.typicode.com/posts",
    data: payload,
    callback: function (ResData) {
      el.html(html);
      el.removeClass('is-loading')
      el.removeAttr('disabled')

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
                "./assets/images/0589ee66d13b4677adb6e978ec162be1.webp",
            },
            total_price: "43,000",
            partial_price: "40,000",
            shipping_price: "4000",
            tax_price: "200",
            discount: "1000"
          },
          success: true,
        };



        $('.shopping-cart__total-amount-number').text(dummy_cart_item_response.data.total_price)
        var num = parseInt(el.siblings('.product-card__add-counter').text())
        $(`.product-card__action-btns[data-id="${product_id}"]`).each(function (i, v) {
          $(v).find('.product-card__add-counter').text(num - 1);
          if ((num - 1) < 2) {
            el.hide()
            $(v).find('.product-card__trash-btn').show()
            $(v).find('.product-card__minus-btn').hide()
          }
        });
        if ($('table.cart__totals').length) {
          $('.partial-total').text(dummy_cart_item_response.data.partial_price)
          $('.shipping-price').text(dummy_cart_item_response.data.shipping_price)
          $('.total-price').text(dummy_cart_item_response.data.total_price)
          $('.tax-price').text(dummy_cart_item_response.data.tax_price)
        }

        changeProductCount(product_id, num - 1)
        $('.header-left-icon__basket-count').text(productsCount()).show()
       
      }
    },
  });


})
$(document).on('click', '.product-info .product-card__trash-btn', function (e) {
  e.preventDefault()
  if ($(this).hasClass('is-loading')) return
  $(this).addClass('is-loading')
  $(this).attr('disabled',true)
  // shoppingCart.removeItemFromCart()
  var product_id = $(this).parents('.product-card__action-btns').attr('data-id');
  var html = $(this).html()
  var payload = {
    product_id: 1,
  };
  var el = $(this)
  el.html($.app.ajax.Template($('#BtnSpinner').html(), {}));

  $.app.ajax.Operation({
    url: "https://jsonplaceholder.typicode.com/posts",
    data: payload,
    callback: function (ResData) {
      el.html(html)
      el.removeClass('is-loading')
      el.removeAttr('disabled')

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
                "./assets/images/0589ee66d13b4677adb6e978ec162be1.webp",
            },
            total_price: "43,000",
            partial_price: "40,000",
            shipping_price: "4000",
            tax_price: "200",
            discount: "1000"
          },
          success: true,
        };



        if ($(".header-basket-list").find(`[data-id='${product_id}']`).length) {
          $(".header-basket-list").find(`[data-id='${product_id}']`).remove()
          if (productsCount() == 0) $('.header-left-icon__basket-count').text(productsCount()).hide()
        }

        el.parents('.product-card__action-btns').hide()
        el.parents('.product-card__action-btns').siblings('.product-card__addtocart').show()

        if (productsCount() == 0) {
          $('.header-left-icons .header-left-icons__basket').addClass('is-empty')
          $(".shopping-cart").removeClass("active");
          $('.header-left-icon__basket-count').text(productsCount())
          $('.header-left-icon__basket-count').hide()
          $('.header-cart-footer__details').hide()
          $('.header-basket-list__empty').show()
          $('.shopping-cart__empty').show()
        }
      }
    },
  });

})
$(document).on('click', '.product-card .product-card__trash-btn', function (e) {
  e.preventDefault()
  if ($(this).hasClass('is-loading')) return
  $(this).addClass('is-loading')
  $(this).attr('disabled',true)
  // shoppingCart.removeItemFromCart()
  var product_id = $(this).parents('.product-card__action-btns').attr('data-id');
  var html = $(this).html()
  var payload = {
    product_id: 1,
  };
  var el = $(this)
  el.html($.app.ajax.Template($('#BtnSpinner').html(), {}));

  $.app.ajax.Operation({
    url: "https://jsonplaceholder.typicode.com/posts",
    data: payload,
    callback: function (ResData) {
      el.html(html)
      el.removeClass('is-loading')
      el.removeAttr('disabled')

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
                "./assets/images/0589ee66d13b4677adb6e978ec162be1.webp",
            },
            total_price: "43,000",
            partial_price: "40,000",
            shipping_price: "4000",
            tax_price: "200",
            discount: "1000"
          },
          success: true,
        };



        if ($(".header-basket-list").find(`[data-id='${product_id}']`).length) {
          $(".header-basket-list").find(`[data-id='${product_id}']`).remove()
          if (productsCount() == 0) $('.header-left-icon__basket-count').text(productsCount()).hide()
        }

        el.parents('.product-card__action-btns').hide()
        el.parents('.product-card__action-btns').siblings('.product-card__addtocart').show()

        if (productsCount() == 0) {
          $('.header-left-icons .header-left-icons__basket').addClass('is-empty')
          $(".shopping-cart").removeClass("active");
          $('.header-left-icon__basket-count').text(productsCount())
          $('.header-left-icon__basket-count').hide()
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
  $(this).attr('disabled',true)
  var product_id = $(this).parents('.product-card__action-btns').attr('data-id');
  var html = $(this).html()
  var payload = {
    product_id: 1,
  };
  var el = $(this)
  el.html($.app.ajax.Template($('#BtnSpinner').html(), {}));

  $.app.ajax.Operation({
    url: "https://jsonplaceholder.typicode.com/posts",
    data: payload,
    callback: function (ResData) {
      el.removeClass('is-loading')
      el.removeAttr('disabled')

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
                "./assets/images/0589ee66d13b4677adb6e978ec162be1.webp",
            },
            total_price: "43,000",
            partial_price: "40,000",
            shipping_price: "4000",
            tax_price: "200",
            discount: "1000"
          },
          success: true,
        };

        el.parents(".js-mini-cart-item").remove();
        
        if ($('table.cart__table').length) {
          $(`table.cart__table tr[data-id="${product_id}"]`).remove()
        }
        if ($('.cart-table__body').length && $('.cart-table__body').children().length == 0) {
          $('.cart-wrapper').hide()
          $('.empty-cart-wrapper').show()
        }
        if ($('table.cart__totals').length) {
          $('.partial-total').text(dummy_cart_item_response.data.partial_price)
          $('.shipping-price').text(dummy_cart_item_response.data.shipping_price)
          $('.total-price').text(dummy_cart_item_response.data.total_price)
          $('.tax-price').text(dummy_cart_item_response.data.tax_price)
        }

        if (productsCount() == 0) {
          $(`.product-card__action-btns[data-id='${product_id}']`).hide()
         $(`.product-card__addtocart[data-id='${product_id}']`).show()
          $('.header-left-icons .header-left-icons__basket').addClass('is-empty')
          $(".shopping-cart").removeClass("active");
          $('.header-cart-footer__details').hide()
          $('.header-left-icon__basket-count').text(productsCount())
          $('.header-left-icons .header-left-icon__basket-count').hide()
          $('.header-basket-list__empty').show()
          $('.shopping-cart__empty').show()
        }

      }
    },
  });

})


$(document).on('click', '.cart__table .product-card__trash-btn', function (e) {
  e.preventDefault()
  // shoppingCart.removeItemFromCart()
  if ($(this).hasClass('is-loading')) return
  $(this).addClass('is-loading')
  $(this).attr('disabled',true)
  var product_id = $(this).parents('.product-card__action-btns').attr('data-id');
  var html = $(this).html()
  var payload = {
    product_id: 1,
  };
  var el = $(this)
  el.html($.app.ajax.Template($('#BtnSpinner').html(), {}));

  $.app.ajax.Operation({
    url: "https://jsonplaceholder.typicode.com/posts",
    data: payload,
    callback: function (ResData) {
      el.removeClass('is-loading')
      el.removeAttr('disabled')

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
                "./assets/images/0589ee66d13b4677adb6e978ec162be1.webp",
            },
            total_price: "43,000",
            partial_price: "40,000",
            shipping_price: "4000",
            tax_price: "200",
            discount: "1000"
          },
          success: true,
        };

        el.parents("tr").remove();

        
        if ($(".header-basket-list").find(`[data-id='${product_id}']`).length) {
          $(".header-basket-list").find(`[data-id='${product_id}']`).remove()
          if (productsCount() == 0) $('.header-left-icon__basket-count').text(productsCount()).hide()
        }

        if ($('.cart-table__body').length && $('.cart-table__body').children().length == 0) {
          $('.cart-wrapper').hide()
          $('.empty-cart-wrapper').show()
        }
       

        if (productsCount() == 0) {
          $('.header-left-icons .header-left-icons__basket').addClass('is-empty')
          $(".shopping-cart").removeClass("active");
          $('.header-left-icon__basket-count').text(productsCount())
          $('.header-left-icons .header-left-icon__basket-count').hide()
          $('.header-cart-footer__details').hide()
          $('.header-basket-list__empty').show()
          $('.shopping-cart__empty').show()
        }
        

      }
    },
  });

})


$('.cart-table__column--remove button').click(function(e) {
  e.preventDefault()
  el = $(this)
  el.html($.app.ajax.Template($('#BtnSpinner').html(), {}));
  var product_id = $(this).attr('data-id');

  var payload = {
    product_id: product_id,
  };
  if (el.parents('tr').attr('data-information') == 'basket') {
    payload['withTotals'] = true
  }
  $.app.ajax.Operation({
    url: "https://jsonplaceholder.typicode.com/posts",
    data: payload,
    callback: function (ResData) {
      el.removeClass('is-loading')
      el.removeAttr('disabled')

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
                "./assets/images/0589ee66d13b4677adb6e978ec162be1.webp",
            },
            total_price: "43,000",
            partial_price: "40,000",
            shipping_price: "4000",
            tax_price: "200",
            discount: "1000"
          },
          success: true,
        };

        el.parents("tr").remove();

        
        if ($(".header-basket-list").find(`[data-id='${product_id}']`).length) {
          $(".header-basket-list").find(`[data-id='${product_id}']`).remove()
          if (productsCount() == 0) $('.header-left-icon__basket-count').text(productsCount()).hide()
        }

        if ($('table.cart__totals').length) {
          $('.partial-total').text(dummy_cart_item_response.data.partial_price)
          $('.shipping-price').text(dummy_cart_item_response.data.shipping_price)
          $('.total-price').text(dummy_cart_item_response.data.total_price)
          $('.tax-price').text(dummy_cart_item_response.data.tax_price)
        }

        if (productsCount() == 0) {
          $('.header-left-icons .header-left-icons__basket').addClass('is-empty')
          $(".shopping-cart").removeClass("active");
          $('.header-left-icon__basket-count').text(productsCount())
          $('.header-left-icon__basket-count').hide()
          $('.header-cart-footer__details').hide()
          $('.header-basket-list__empty').show()
          $('.shopping-cart__empty').show()
        }

      }
    },
  });
 

})