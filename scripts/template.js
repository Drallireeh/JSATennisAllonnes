let smMenu = document.getElementById("smartphone-menu");

smMenu.addEventListener("click", function () {
    let menu = document.getElementById("menu");
    if (getComputedStyle(menu, null).display === "none") {
        menu.classList.add('nav-fixed--mobile');
        menu.classList.remove('nav-fixed--desktop');
        smMenu.classList.add("open");
        // Ferme le menu en au clic outside
        document.addEventListener("click", function (e) {
            if (!e.target.classList.contains("open") && !e.target.classList.contains("burger-menu")) {
                menu.classList.remove("nav-fixed--mobile");
                menu.classList.add('nav-fixed--desktop');
                smMenu.classList.remove("open");
                removeEventListener("click", document);
            }
        });
    }
    else {
        menu.classList.remove("nav-fixed--mobile");
        menu.classList.add('nav-fixed--desktop');
        smMenu.classList.remove("open");
    }
});