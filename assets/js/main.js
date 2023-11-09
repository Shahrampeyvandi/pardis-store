$(document).ready(function () {
  //    resposive-megamenu-mobile------------------

  $(".nav-btn").on("click", function () {
    $(".overlay").show();
    $("nav").toggleClass("open");
  });

  $(document).on('click', function(e) {
    if ($('.dropdown').hasClass('open')) {
      $('.dropdown').removeClass('open');
    }
    if ($(e.target).closest(".header-basket-list-item-content").length === 0 && $(e.target).closest(".header-left-icons").length === 0
    && $(e.target).closest("svg").length === 0) {
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


  $('.login-link').click(function(e) {
    e.preventDefault()
    $('.login-modal').fadeIn(100)
  })
  $('.login-modal .close-btn').click(function(e) {
    e.preventDefault()
    $('.login-modal').fadeOut(100)
  })

  var product_owl =   $(".block-products-carousel .product-slider").owlCarousel({
    stagePadding: 0,
    singleItem: true,
    items: 4,
    margin:10,
    loop: true,
    rtl: true,
    autoplay: false,
    dots:false,
    nav: true,
    navClass: ['block-header__arrow','block-header__arrow'],
    navContainerClass: 'block-header__arrows-list',
    navText: [
      '<i class="fa fa-angle-right" aria-hidden="true"></i>',
      '<i class="fa fa-angle-left" aria-hidden="true"></i>'
  ],
  responsive:{
    0:{
        items:1,
        nav:true
    },
    600:{
        items:3,
        nav:false
    },
    1000:{
        items:4,
        nav:true,
        loop:false
    }
}
  });
  $('.block-header__groups-list .block-header__group').click(function(e) {
    e.preventDefault()
    // console.log($('.second').children().eq(index));
    // $('.block-products-carousel .product-slider').trigger( 'remove.owl.carousel', [1] );
    
    $('.block-products-carousel').addClass('block-products-carousel--loading');
    setTimeout(() => {

      $('.product-slider')
    $('.block-products-carousel').removeClass('block-products-carousel--loading');
      
    }, 1000);
   
  })

  $('.product-card__wishlist').click(function(e) {
    e.preventDefault()
    $(this).find('svg').css('color', '#ef4056')
    
  })
});
