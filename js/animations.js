/* =========================================================
   DAILYROUTINE ANIMATIONS
========================================================= */


/* =========================================================
   SCROLL REVEAL
========================================================= */

const revealObserver =
    new IntersectionObserver(
        function (entries) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {

                    entry.target.classList.add(
                        "revealed"
                    );

                    revealObserver.unobserve(
                        entry.target
                    );

                }

            });

        },
        {
            threshold: 0.12
        }
    );


document
    .querySelectorAll(".reveal")
    .forEach(function (element) {

        revealObserver.observe(element);

    });



/* =========================================================
   PARALLAX HERO
========================================================= */

window.addEventListener(
    "scroll",
    function () {

        const terminal =
            document.querySelector(".hero-terminal");

        if (!terminal) return;

        const scroll =
            window.scrollY;


        if (scroll < 800) {

            terminal.style.transform =
                `translateY(${scroll * 0.035}px)`;

        }

    }
);



/* =========================================================
   MOUSE MOVEMENT EFFECT
========================================================= */

document.addEventListener(
    "mousemove",
    function (event) {

        const glow =
            document.querySelector(".hero-glow");


        if (!glow) return;


        const x =
            event.clientX / window.innerWidth;

        const y =
            event.clientY / window.innerHeight;


        glow.style.transform =
            `translate(${x * 30}px, ${y * 20}px)`;

    }
);