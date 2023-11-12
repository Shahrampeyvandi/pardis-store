$(document).ready(function () {
  //    resposive-megamenu-mobile------------------

  $(".nav-btn").on("click", function () {
    $(".overlay").show();
    $("nav").toggleClass("open");
  });

  $(document).on("click", function (e) {
    if ($(".dropdown").hasClass("open")) {
      $(".dropdown").removeClass("open");
    }
    if (
      $(e.target).closest(".header-basket-list-item-content").length === 0 &&
      $(e.target).closest(".header-left-icons").length === 0 &&
      $(e.target).closest("svg").length === 0
    ) {
      // $(".shopping-cart").removeClass('active')
    }
  });

  $("li.active").addClass("open").children("ul").show();
  $("li.has-sub > a").on("click", function () {
    $(this).removeAttr("href");
    var e = $(this).parent("li");
    if (e.hasClass("open")) {
      e.removeClass("open");
      e.find("li").removeClass("opne");
      e.find("ul").slideUp(200);
    } else {
      e.addClass("open");
      e.children("ul").slideDown(200);
      e.siblings("li").children("ul").slideUp(200);
      e.siblings("li").removeClass("open");
      e.siblings("li").find("li").removeClass("open");
      e.siblings("li").find("ul").slideUp(200);
    }
  });
  //    resposive-megamenu-mobile------------------

  //    checkbox--------------------------
  $(".remember-checkbox").click(function () {
    if ($(this).is(":checked")) {
      $(this)
        .parents(".checkbox-primary")
        .find(".checkbox-check")
        .addClass("checkbox-custom-pic");
    } else {
      $(this)
        .parents(".checkbox-primary")
        .find(".checkbox-check")
        .removeClass("checkbox-custom-pic");
    }
  });
  //    checkbox--------------------------

  $(".header-basket-list-item-remove").click(function (e) {
    e.preventDefault();
    $(this).parents(".js-mini-cart-item").remove();
  });

  $(".header-left-icons__basket").click(function (e) {
    e.preventDefault();

    $(this).siblings(".shopping-cart").addClass("active");
  });
  $(".shopping-cart__close").click(function (e) {
    e.preventDefault();
    $(this).parents(".shopping-cart").removeClass("active");
  });

  $(".js-example-basic-single").select2({
    width: "resolve",
    dir: "rtl",
  });

  $(".login-link").click(function (e) {
    e.preventDefault();
    $(".login-modal").fadeIn(100);
  });
  $(".remodal-overlay  .close-btn").click(function (e) {
    e.preventDefault();
    $(".remodal-overlay").fadeOut(100);
  });

  var product_owl = $(".block-products-carousel .product-slider").owlCarousel({
    stagePadding: 0,
    singleItem: true,
    items: 4,
    margin: 10,
    loop: true,
    rtl: true,
    autoplay: false,
    dots: false,
    nav: true,
    navClass: ["block-header__arrow", "block-header__arrow"],
    navContainerClass: "block-header__arrows-list",
    navText: [
      '<i class="fa fa-angle-right" aria-hidden="true"></i>',
      '<i class="fa fa-angle-left" aria-hidden="true"></i>',
    ],
    responsive: {
      0: {
        items: 1,
        nav: true,
      },
      600: {
        items: 3,
        nav: false,
      },
      1000: {
        items: 4,
        nav: true,
        loop: false,
      },
    },
  });

  $(".block-header__groups-list .block-header__group").click(function (e) {
    e.preventDefault();

    $(".block-products-carousel").addClass("block-products-carousel--loading");
    setTimeout(() => {
      $(".product-slider");
      $(".block-products-carousel").removeClass(
        "block-products-carousel--loading"
      );
    }, 1000);
  });

  $(".product-card__quickview").click(function (e) {
    e.preventDefault();
    $(this).addClass("product-card__quickview--preload");

    var el = $(this);
    var payload = {
      product_id: $(this).attr("data-id"),
    };
    $.app.ajax.Operation({
      url: "https://jsonplaceholder.typicode.com/posts",
      data: payload,
      callback: function (ResData) {
        if (ResData.type == "success") {
          var dummy_cart_item_response = {
            data: {
              cart_id: 1,
              product: {
                id: 1232,
                title: "این یک عنوان تست است این یک عنوان تست است",
                price: "100000",
                image: "assets/images/0589ee66d13b4677adb6e978ec162be1.webp",
              },
              total_price: 430000,
            },
            success: true,
          };

          $("#quickViewModal").append(
            $.app.ajax.Template($("#ProductViewTemplate").html(), {})
          );

          var productGallery = $("#productGallery");
          var productThumb = $("#productThumb");
          var slidesPerPage = 5; //globaly define number of elements per page
          var syncedSecondary = true;

          productGallery
            .owlCarousel({
              items: 1,
              slideSpeed: 2000,
              nav: false,
              autoplay: false,
              dots: false,
              rtl: true,
              loop: false,
              responsiveRefreshRate: 200,
            })
            .on("changed.owl.carousel", syncPosition);

          productThumb
            .on("initialized.owl.carousel", function () {
              productThumb.find(".owl-item").eq(0).addClass("current");
            })
            .owlCarousel({
              items: slidesPerPage,
              dots: false,
              nav: false,
              rtl: true,
              margin: 10,
              smartSpeed: 200,
              slideSpeed: 500,
              slideBy: slidesPerPage, //alternatively you can slide by 1, this way the active slide will stick to the first item in the second carousel
              responsiveRefreshRate: 100,
            })
            .on("changed.owl.carousel", syncPosition2);

          function syncPosition(el) {
            var current = el.item.index;
            productThumb
              .find(".owl-item")
              .removeClass("current")
              .eq(current)
              .addClass("current");
            var onscreen = productThumb.find(".owl-item.active").length - 1;
            var start = productThumb.find(".owl-item.active").first().index();
            var end = productThumb.find(".owl-item.active").last().index();

            if (current > end) {
              productThumb.data("owl.carousel").to(current, 100, true);
            }
            if (current < start) {
              productThumb
                .data("owl.carousel")
                .to(current - onscreen, 100, true);
            }
          }

          function syncPosition2(el) {
            if (syncedSecondary) {
              var number = el.item.index;
              productGallery.data("owl.carousel").to(number, 100, true);
            }
          }

          productThumb.on("click", ".owl-item", function (e) {
            e.preventDefault();
            var number = $(this).index();
            productGallery.data("owl.carousel").to(number, 300, true);
          });

          $("#productGallery").lightGallery({
            pager: true,
            rtl: true,
            selector: "a",
          });

          $(".quickview-modal").fadeIn();
          el.removeClass("product-card__quickview--preload");
        }
        if (ResData.type == "error") {
          alert("error");
        }
      },
    });
  });

  $(".product-card__wishlist").click(function (e) {
    e.preventDefault();
    $(this).find("svg").css("color", "#ef4056");
  });
});
