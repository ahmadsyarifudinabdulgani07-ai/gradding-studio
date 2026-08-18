// ============================================================
// GRADDING STUDIO - JS.JS FINAL
// Booking + Portfolio + Hero Supabase
// ============================================================

const SUPABASE_URL =
    "https://pepmipkozeclxzoezedn.supabase.co";

const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlcG1pcGtvemVjbHh6b2V6ZWRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3MjQ5MjMsImV4cCI6MjEwMjMwMDkyM30.N84rVUnRjGxZ89GpQ9X4Qn3AOX2czjWMaNs0x4uicZ8";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );


const BUCKET =
    "portfolio";


const PORTFOLIO_FOLDERS = [
    "wisuda",
    "kelulusan",
    "grup",
    "lainnya"
];


const HERO_FOLDER =
    "website/hero";

const HERO_FILE =
    "hero.jpg";

const HERO_PATH =
    HERO_FOLDER +
    "/" +
    HERO_FILE;


// ============================================================
// ELEMENT
// ============================================================

const form =
    document.getElementById(
        "bookingForm"
    );


const message =
    document.getElementById(
        "message"
    );


const gallery =
    document.getElementById(
        "galleryGrid"
    );


// ============================================================
// HELPER
// ============================================================

function msg(
    text,
    type = ""
) {

    if (!message) {

        return;

    }


    message.textContent =
        text;


    message.className =
        "msg " + type;

}


function esc(value) {

    return String(
        value ?? ""
    )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        );

}


// ============================================================
// BOOKING CODE
// ============================================================

function bookingCode() {

    const date =
        new Date()
            .toISOString()
            .slice(0, 10)
            .replaceAll(
                "-",
                ""
            );


    const random =
        Math.floor(
            1000 +
            Math.random() *
            9000
        );


    return (
        "GV-" +
        date +
        "-" +
        random
    );

}


// ============================================================
// FOTO HERO DARI SUPABASE
// ============================================================

async function loadHeroImage() {

    const heroImage =
        document.querySelector(
            ".hero-photo img"
        );


    if (!heroImage) {

        return;

    }


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .storage
                .from(BUCKET)
                .list(
                    HERO_FOLDER
                );


        if (error) {

            throw error;

        }


        const exists =
            (data || [])
                .some(
                    function (file) {

                        return (
                            file.name ===
                            HERO_FILE
                        );

                    }
                );


        // Kalau belum ada hero Supabase,
        // gunakan foto lokal index.html.

        if (!exists) {

            return;

        }


        const {
            data:
            publicData
        } =
            supabaseClient
                .storage
                .from(BUCKET)
                .getPublicUrl(
                    HERO_PATH
                );


        heroImage.src =
            publicData.publicUrl +
            "?v=" +
            Date.now();

    }

    catch (error) {

        console.error(
            "Hero error:",
            error
        );

    }

}


// ============================================================
// BOOKING
// ============================================================

if (form) {

    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            msg(
                "Menyimpan booking..."
            );


            const row = {

                booking_code:
                    bookingCode(),

                name:
                    document
                        .getElementById(
                            "name"
                        )
                        .value
                        .trim(),

                phone:
                    document
                        .getElementById(
                            "phone"
                        )
                        .value
                        .trim(),

                booking_date:
                    document
                        .getElementById(
                            "date"
                        )
                        .value,

                booking_time:
                    document
                        .getElementById(
                            "time"
                        )
                        .value,

                service:
                    document
                        .getElementById(
                            "service"
                        )
                        .value,

                package_name:
                    document
                        .getElementById(
                            "package"
                        )
                        .value,

                location:
                    document
                        .getElementById(
                            "location"
                        )
                        .value
                        .trim(),

                notes:
                    document
                        .getElementById(
                            "notes"
                        )
                        .value
                        .trim(),

                status:
                    "Menunggu"

            };


            try {

                const {
                    error
                } =
                    await supabaseClient
                        .from(
                            "bookings"
                        )
                        .insert([
                            row
                        ]);


                if (error) {

                    throw error;

                }


                msg(
                    "Booking berhasil! Nomor: " +
                    row.booking_code,
                    "success"
                );


                alert(
                    "Booking berhasil!\n\n" +
                    "Nomor Booking: " +
                    row.booking_code
                );


                form.reset();

            }

            catch (error) {

                console.error(
                    "Booking error:",
                    error
                );


                msg(
                    "Booking gagal: " +
                    error.message,
                    "error"
                );

            }

        }
    );

}


// ============================================================
// AMBIL FOTO DARI FOLDER
// ============================================================

async function getFilesFromFolder(
    folder
) {

    const {
        data,
        error
    } =
        await supabaseClient
            .storage
            .from(BUCKET)
            .list(
                folder,
                {

                    limit:
                        200,

                    offset:
                        0,

                    sortBy: {

                        column:
                            "created_at",

                        order:
                            "desc"

                    }

                }
            );


    if (error) {

        throw error;

    }


    return (
        data || []
    )
        .filter(
            function (file) {

                return (
                    file.name &&
                    /\.(jpe?g|png|webp)$/i
                        .test(
                            file.name
                        )
                );

            }
        )
        .map(
            function (file) {

                return {

                    ...file,

                    path:
                        folder +
                        "/" +
                        file.name

                };

            }
        );

}


// ============================================================
// FOTO ROOT LAMA
// ============================================================

async function getRootFiles() {

    const {
        data,
        error
    } =
        await supabaseClient
            .storage
            .from(BUCKET)
            .list(
                "",
                {

                    limit:
                        200,

                    sortBy: {

                        column:
                            "created_at",

                        order:
                            "desc"

                    }

                }
            );


    if (error) {

        throw error;

    }


    return (
        data || []
    )
        .filter(
            function (file) {

                return (
                    file.name &&
                    /\.(jpe?g|png|webp)$/i
                        .test(
                            file.name
                        )
                );

            }
        )
        .map(
            function (file) {

                return {

                    ...file,

                    path:
                        file.name

                };

            }
        );

}


// ============================================================
// LOAD PORTFOLIO
// ============================================================

async function loadPortfolio() {

    if (!gallery) {

        return;

    }


    gallery.innerHTML =
        `
        <div class="empty">
            Memuat portfolio...
        </div>
        `;


    try {

        let allPhotos = [];


        // ======================================
        // FOTO LAMA ROOT
        // ======================================

        const rootPhotos =
            await getRootFiles();


        allPhotos.push(
            ...rootPhotos
        );


        // ======================================
        // FOTO DARI FOLDER
        // ======================================

        for (
            const folder
            of PORTFOLIO_FOLDERS
        ) {

            const files =
                await getFilesFromFolder(
                    folder
                );


            allPhotos.push(
                ...files
            );

        }


        // ======================================
        // URUT TERBARU
        // ======================================

        allPhotos.sort(
            function (a, b) {

                return (
                    new Date(
                        b.created_at ||
                        0
                    )
                    -
                    new Date(
                        a.created_at ||
                        0
                    )
                );

            }
        );


        if (
            allPhotos.length ===
            0
        ) {

            gallery.innerHTML =
                `
                <div class="empty">
                    Belum ada foto portfolio.
                </div>
                `;

            return;

        }


        gallery.innerHTML =
            "";


        // ======================================
        // TAMPILKAN FOTO
        // ======================================

        allPhotos.forEach(
            function (file) {


                const {
                    data:
                    publicData
                } =
                    supabaseClient
                        .storage
                        .from(BUCKET)
                        .getPublicUrl(
                            file.path
                        );


                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "gallery-item";


                const image =
                    document.createElement(
                        "img"
                    );


                image.src =
                    publicData.publicUrl;


                image.alt =
                    "Portfolio Gradding Studio";


                image.loading =
                    "lazy";


                item.appendChild(
                    image
                );


                gallery.appendChild(
                    item
                );

            }
        );

    }

    catch (error) {

        console.error(
            "Portfolio error:",
            error
        );


        gallery.innerHTML =
            `
            <div class="empty">

                Gagal memuat portfolio:

                ${esc(
                    error.message
                )}

            </div>
            `;

    }

}


// ============================================================
// MENU MOBILE
// ============================================================

function toggleMenu() {

    const nav =
        document.getElementById(
            "navLinks"
        );


    if (nav) {

        nav.classList.toggle(
            "open"
        );

    }

}


window.toggleMenu =
    toggleMenu;


// ============================================================
// START WEBSITE
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadHeroImage();

        loadPortfolio();

    }
);