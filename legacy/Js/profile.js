function myMenuFunction() {
    // Logika atau aksi yang ingin dilakukan saat ikon menu diklik
    console.log("Menu clicked!");
}

        var a = document.getElementById("loginbtn");
        var b = document.getElementById("registerbtn");
        var x = document.getElementById("login");
        var y = document.getElementById("register");

        function login() {
            x.style.left = "4px";
            y.style.right = "-520px";
            a.className += " white-btn";
            b.className = "btn";
            x.style.opacity = 1
            y.style.opacity = 0;
        }

        function register() {
            x.style.left = "-510px";
            y.style.right = "5px";
            a.className = "btn";
            b.className += " white-btn";
            x.style.opacity = 0;
            y.style.opacity = 1;
        }

        const menuBtn = document.querySelector(".menu-btn");
        const navigation = document.querySelector(".navigation");
        const btns = document.querySelectorAll(".nav-btn");
        const slides = document.querySelectorAll(".video-slide");
        
        menuBtn.addEventListener("click", () => {
            menuBtn.classList.toggle("active");
            navigation.classList.toggle("active");
        });
        
        
        
        var sliderNav = function(manual){
            btns.forEach((btn) => {
                btn.classList.remove("active");
            });
        
            slides.forEach((slide) => {
                slide.classList.remove("active");
            });
        
            btns[manual].classList.add("active");
            slides[manual].classList.add("active");
        }
        
        btns.forEach((btn, i) => {
            btn.addEventListener("click", () => {
                sliderNav(i);
            });
        });
   