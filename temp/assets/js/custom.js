$(function() {
    $("#online-subscription").load("subscriptions.html");
    $("#testimonialsfile").load("testimonials.html");
    $("#headerfile").load("header.html");
    $("#headerfilesale").load("header-SALE.html");
    $("#footerfile").load("footer.html");
    $("#headerfile1").load("header2.html");
    $("#resource-menu").load("https://www.vidyamandir.com/resource-menu.html");
});




$(document).ready(function() {


    // $('.home-carousel').owlcarousel({
    //     loop: true,
    //     autoplay: true,
    //     arrows: false,
    //     nav: false,
    //     responsiveClass: true,
    //     TimeoutSpeed: 5000,
    // });
    $('.owl-carousel.faculty-list').owlCarousel({
        loop: true,
        margin: 10,
        autoplay: true,
        responsiveClass: true,
        autoplayTimeout: 8000,
        TimeoutSpeed: 3000,
        responsive: {
            0: {
                items: 1,
                nav: true
            },
            600: {
                items: 2,
                nav: false
            },
            1000: {
                items: 3,
                nav: true,
                margin: 20
            }
        }
    });

    $('.owl-carousel.popular-program').owlCarousel({
        loop: true,
        margin: 10,
        autoplay: true,
        responsiveClass: true,
        autoplayTimeout: 8000,
        TimeoutSpeed: 3000,
        responsive: {
            0: {
                items: 1,
                nav: true
            },
            600: {
                items: 2,
                nav: false
            },
            1000: {
                items: 2,
                nav: true,
                margin: 20
            }
        }
    });


    $('.owl-carousel.Summer-Camp').owlCarousel({
        loop: true,
        margin: 10,
        autoplay: true,
        responsiveClass: true,
        autoplayTimeout: 8000,
        TimeoutSpeed: 3000,
        responsive: {
            0: {
                items: 1,
                nav: true
            },
            600: {
                items: 2,
                nav: false
            },
            1000: {
                items: 3,
                nav: true,
                margin: 20
            }
        }
    });


    $('.owl-carousel').owlCarousel({
        loop: true,
        margin: 10,
        autoplay: true,
        responsiveClass: true,
        autoplayTimeout: 8000,
        TimeoutSpeed: 3000,
        responsive: {
            0: {
                items: 1,
                nav: true
            },
            600: {
                items: 1,
                nav: false
            },
            1000: {
                items: 1,
                nav: true,
                margin: 20
            }
        }
    });

    $('.owl-carousel.iits').owlCarousel({
        loop: true,
        margin: 10,
        autoplay: true,
        responsiveClass: true,
        autoplayTimeout: 1000,
        TimeoutSpeed: 1000,
    });
});


$(document).ready(function() {
    if ($(window).width() < 980) {
        $('.study-material').slick({
            slidesToShow: 3,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 1500,
            arrows: false,
            dots: false,
            pauseOnHover: false,
            responsive: [{
                breakpoint: 768,
                settings: {
                    slidesToShow: 3
                }
            }, {
                breakpoint: 520,
                settings: {
                    slidesToShow: 3
                }
            }]
        });
        $('.right').click(function() {
            $('.study-material').slick('slickNext');
        });
    };
});

$(document).ready(function() {
    if ($(window).width() < 980) {
        $('.smart-classroom').slick({
            slidesToShow: 3,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 2000,
            arrows: false,
            dots: false,
            pauseOnHover: false,
            responsive: [{
                breakpoint: 768,
                settings: {
                    slidesToShow: 3
                }
            }, {
                breakpoint: 520,
                settings: {
                    slidesToShow: 3
                }
            }]
        });
        $('.right').click(function() {
            $('.study-material').slick('slickNext');
        });
    };
});
$(document).ready(function() {
    if ($(window).width() < 980) {
        $('.xii-board').slick({
            slidesToShow: 3,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 1800,
            arrows: false,
            dots: false,
            pauseOnHover: false,
            responsive: [{
                breakpoint: 768,
                settings: {
                    slidesToShow: 3
                }
            }, {
                breakpoint: 520,
                settings: {
                    slidesToShow: 3
                }
            }]
        });
        $('.right').click(function() {
            $('.xii-board').slick('slickNext');
        });
    };
});
$(document).ready(function() {
    if ($(window).width() < 980) {
        $('.t-e ').slick({
            slidesToShow: 3,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 1200,
            arrows: false,
            dots: false,
            pauseOnHover: false,
            responsive: [{
                breakpoint: 768,
                settings: {
                    slidesToShow: 3
                }
            }, {
                breakpoint: 520,
                settings: {
                    slidesToShow: 3
                }
            }]
        });
        $('.right').click(function() {
            $('.t-e').slick('slickNext');
        });
    };
});

// carousel swipe code start

$(".carousel").swipe({
    swipe: function(
        event,
        direction,
        distance,
        duration,
        fingerCount,
        fingerData
    ) {
        if (direction == "left") $(this).carousel("next");
        if (direction == "right") $(this).carousel("prev");
    },
    allowPageScroll: "vertical"
});


// video autuplay code start
window.addEventListener('load', videoScroll);
window.addEventListener('scroll', videoScroll);

function videoScroll() {

    if (document.querySelectorAll('video.scrollplay[autoplay]').length > 0) {
        var windowHeight = window.innerHeight,
            videoEl = document.querySelectorAll('video.scrollplay[autoplay]');

        for (var i = 0; i < videoEl.length; i++) {

            var thisVideoEl = videoEl[i],
                videoHeight = thisVideoEl.clientHeight,
                videoClientRect = thisVideoEl.getBoundingClientRect().top;

            if (videoClientRect <= ((windowHeight) - (videoHeight * .5)) && videoClientRect >= (0 - (videoHeight * .5))) {

                thisVideoEl.play();

            } else {
                thisVideoEl.pause();
            }

        }
    }

}


$('.owl-carousel.newvmc-glimps').owlCarousel({
    loop: true,
    margin: 10,
    nav: true,
    responsive: {
        0: {
            items: 1
        },
        600: {
            items: 3
        },
        1000: {
            items: 5
        }
    }
})