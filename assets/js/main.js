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
    if ($(e.target).closest(".mini-cart-header").length === 0) {
        $(".mini-cart-dropdown").removeClass('active')
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

  $(".mini-cart-header-btn").click(function (e) {
    e.preventDefault();
    $(this).siblings(".mini-cart-dropdown").addClass("active");
  });
  $(".header-cart-info-close").click(function (e) {
    e.preventDefault();
    $(this).parents(".mini-cart-dropdown").removeClass("active");
  });

  $(".js-example-basic-single").select2({
    width: "resolve",
    dir: "rtl",
  });
});
