$(document).ready(function() {
    init();
})

function init () {
    $('.sub-menu').click(sub_menu_click)
};

function sub_menu_click(e) {
    if ($(this).hasClass('active')) {
        $(this).removeClass('active')
    } else {
        $(this).addClass('active')
    }
    // $("#leftside-navigation ul ul").slideUp(), $(this).next().is(":visible") || $(this).next().slideDown(), e.stopPropagation()
}

function initialization_click() {
    
}