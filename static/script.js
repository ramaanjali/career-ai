const sidebar = document.querySelector(".sidebar");

const openSidebar =
    document.getElementById("openSidebar");

const closeSidebar =
    document.getElementById("closeSidebar");


/* Open sidebar */

if (openSidebar) {

    openSidebar.addEventListener(
        "click",
        function () {

            sidebar.classList.add("open");

        }
    );

}


/* Close sidebar */

if (closeSidebar) {

    closeSidebar.addEventListener(
        "click",
        function () {

            sidebar.classList.remove("open");

        }
    );

}


/* Close mobile sidebar after navigation */

document.querySelectorAll(".nav-item")
.forEach(function (item) {

    item.addEventListener(
        "click",
        function () {

            if (window.innerWidth <= 768) {

                sidebar.classList.remove("open");

            }

        }
    );

});