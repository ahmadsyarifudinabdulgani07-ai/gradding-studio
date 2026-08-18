// ============================================================
// GRADDING STUDIO - ADMIN.JS FINAL
// Login + Booking + Portfolio Folder + Hero Website
// ============================================================

const SUPABASE_URL = "https://pepmipkozeclxzoezedn.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlcG1pcGtvemVjbHh6b2V6ZWRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3MjQ5MjMsImV4cCI6MjEwMjMwMDkyM30.N84rVUnRjGxZ89GpQ9X4Qn3AOX2czjWMaNs0x4uicZ8";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );

const BUCKET = "portfolio";

const PORTFOLIO_FOLDERS = [
    "wisuda",
    "kelulusan",
    "grup",
    "lainnya"
];

const HERO_FOLDER = "website/hero";
const HERO_FILE = "hero.jpg";
const HERO_PATH =
    `${HERO_FOLDER}/${HERO_FILE}`;

let allBookings = [];


// ============================================================
// ELEMENT HTML
// ============================================================

const loginSection =
    document.getElementById("loginSection");

const dashboard =
    document.getElementById("dashboard");

const loginForm =
    document.getElementById("loginForm");

const loginMessage =
    document.getElementById("loginMessage");

const adminEmail =
    document.getElementById("adminEmail");

const logoutBtn =
    document.getElementById("logoutBtn");


// PORTFOLIO

const portfolioFile =
    document.getElementById("portfolioFile");

const portfolioCategory =
    document.getElementById(
        "portfolioCategory"
    );

const preview =
    document.getElementById("preview");

const uploadBtn =
    document.getElementById("uploadBtn");

const resetFileBtn =
    document.getElementById("resetFileBtn");

const uploadMessage =
    document.getElementById(
        "uploadMessage"
    );

const refreshPortfolioBtn =
    document.getElementById(
        "refreshPortfolioBtn"
    );

const portfolioGrid =
    document.getElementById(
        "portfolioGrid"
    );


// HERO

const heroFile =
    document.getElementById("heroFile");

const heroPreview =
    document.getElementById(
        "heroPreview"
    );

const heroCurrentImage =
    document.getElementById(
        "heroCurrentImage"
    );

const uploadHeroBtn =
    document.getElementById(
        "uploadHeroBtn"
    );

const resetHeroBtn =
    document.getElementById(
        "resetHeroBtn"
    );

const refreshHeroBtn =
    document.getElementById(
        "refreshHeroBtn"
    );

const heroMessage =
    document.getElementById(
        "heroMessage"
    );


// BOOKING

const bookingList =
    document.getElementById(
        "bookingList"
    );

const searchBooking =
    document.getElementById(
        "searchBooking"
    );

const filterStatus =
    document.getElementById(
        "filterStatus"
    );

const sortBooking =
    document.getElementById(
        "sortBooking"
    );

const clearBookingsBtn =
    document.getElementById(
        "clearBookingsBtn"
    );


// STAT

const statTotal =
    document.getElementById(
        "statTotal"
    );

const statPending =
    document.getElementById(
        "statPending"
    );

const statConfirmed =
    document.getElementById(
        "statConfirmed"
    );

const statPortfolio =
    document.getElementById(
        "statPortfolio"
    );


// MODAL

const bookingModal =
    document.getElementById(
        "bookingModal"
    );

const bookingDetail =
    document.getElementById(
        "bookingDetail"
    );

const closeModalBtn =
    document.getElementById(
        "closeModalBtn"
    );


// ============================================================
// HELPER
// ============================================================

function escapeHtml(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function setMessage(
    element,
    text,
    type = ""
) {

    if (!element) return;

    element.textContent =
        text;

    element.className =
        "msg " + type;
}


function validImage(file) {

    if (!file) {

        return "Pilih foto terlebih dahulu.";

    }


    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];


    if (
        !allowedTypes.includes(
            file.type
        )
    ) {

        return "Format harus JPG, PNG, atau WEBP.";

    }


    if (
        file.size >
        10 * 1024 * 1024
    ) {

        return "Ukuran foto maksimal 10 MB.";

    }


    return "";
}


function go(id) {

    document
        .getElementById(id)
        ?.scrollIntoView({
            behavior: "smooth"
        });

}


window.go = go;


// ============================================================
// LOGIN
// ============================================================

function showLogin() {

    loginSection?.classList.remove(
        "hidden"
    );

    dashboard?.classList.remove(
        "active"
    );


    if (adminEmail) {

        adminEmail.textContent =
            "Belum login";

    }

}


function showDashboard(user) {

    loginSection?.classList.add(
        "hidden"
    );

    dashboard?.classList.add(
        "active"
    );


    if (adminEmail) {

        adminEmail.textContent =
            user?.email ||
            "Admin";

    }


    loadHero();

    loadPortfolio();

    loadBookings();

}


async function checkSession() {

    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .auth
                .getSession();


        if (error) {

            throw error;

        }


        if (
            data.session &&
            data.session.user
        ) {

            showDashboard(
                data.session.user
            );

        }

        else {

            showLogin();

        }

    }

    catch (error) {

        console.error(
            "Session error:",
            error
        );

        showLogin();

    }

}


// ============================================================
// LOGIN ADMIN
// ============================================================

loginForm?.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const email =
            document
                .getElementById(
                    "email"
                )
                .value
                .trim();


        const password =
            document
                .getElementById(
                    "password"
                )
                .value;


        setMessage(
            loginMessage,
            "Sedang login..."
        );


        try {

            const {
                data,
                error
            } =
                await supabaseClient
                    .auth
                    .signInWithPassword({

                        email:
                            email,

                        password:
                            password

                    });


            if (error) {

                throw error;

            }


            setMessage(
                loginMessage,
                "Login berhasil.",
                "success"
            );


            showDashboard(
                data.user
            );

        }

        catch (error) {

            console.error(
                "Login gagal:",
                error
            );


            setMessage(
                loginMessage,
                "Login gagal: " +
                error.message,
                "error"
            );

        }

    }
);


// ============================================================
// LOGOUT
// ============================================================

logoutBtn?.addEventListener(
    "click",
    async function () {

        try {

            const {
                error
            } =
                await supabaseClient
                    .auth
                    .signOut();


            if (error) {

                throw error;

            }


            showLogin();

        }

        catch (error) {

            alert(
                "Logout gagal: " +
                error.message
            );

        }

    }
);


// ============================================================
// HERO WEBSITE
// ============================================================

heroFile?.addEventListener(
    "change",
    function () {

        const file =
            heroFile.files[0];


        const validation =
            validImage(file);


        if (validation) {

            alert(validation);

            heroFile.value = "";

            return;

        }


        heroPreview.src =
            URL.createObjectURL(
                file
            );


        heroPreview.style.display =
            "block";

    }
);


resetHeroBtn?.addEventListener(
    "click",
    function () {

        heroFile.value = "";

        heroPreview.src = "";

        heroPreview.style.display =
            "none";


        setMessage(
            heroMessage,
            ""
        );

    }
);


refreshHeroBtn?.addEventListener(
    "click",
    loadHero
);


async function loadHero() {

    if (!heroCurrentImage) {

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


        if (!exists) {

            heroCurrentImage
                .removeAttribute(
                    "src"
                );

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


        heroCurrentImage.src =
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
// UPLOAD HERO
// ============================================================

uploadHeroBtn?.addEventListener(
    "click",
    async function () {

        const file =
            heroFile?.files[0];


        const validation =
            validImage(file);


        if (validation) {

            setMessage(
                heroMessage,
                validation,
                "error"
            );

            return;

        }


        uploadHeroBtn.disabled =
            true;


        setMessage(
            heroMessage,
            "Mengupload foto utama..."
        );


        try {

            const {
                error
            } =
                await supabaseClient
                    .storage
                    .from(BUCKET)
                    .upload(
                        HERO_PATH,
                        file,
                        {

                            upsert:
                                true,

                            cacheControl:
                                "60",

                            contentType:
                                file.type

                        }
                    );


            if (error) {

                throw error;

            }


            setMessage(
                heroMessage,
                "Foto utama berhasil diganti.",
                "success"
            );


            heroFile.value = "";

            heroPreview.src = "";

            heroPreview.style.display =
                "none";


            await loadHero();

        }

        catch (error) {

            console.error(
                "Hero upload:",
                error
            );


            setMessage(
                heroMessage,
                "Upload gagal: " +
                error.message,
                "error"
            );

        }

        finally {

            uploadHeroBtn.disabled =
                false;

        }

    }
);


// ============================================================
// PORTFOLIO PREVIEW
// ============================================================

portfolioFile?.addEventListener(
    "change",
    function () {

        const file =
            portfolioFile.files[0];


        if (!file) {

            preview.style.display =
                "none";

            return;

        }


        const validation =
            validImage(file);


        if (validation) {

            alert(validation);

            portfolioFile.value = "";

            return;

        }


        preview.src =
            URL.createObjectURL(
                file
            );


        preview.style.display =
            "block";

    }
);


// ============================================================
// RESET PORTFOLIO
// ============================================================

resetFileBtn?.addEventListener(
    "click",
    function () {

        portfolioFile.value = "";

        preview.src = "";

        preview.style.display =
            "none";


        setMessage(
            uploadMessage,
            ""
        );

    }
);


// ============================================================
// NAMA FILE
// ============================================================

function createFileName(
    file,
    index
) {

    const extension =
        (
            file.name
                .split(".")
                .pop() ||
            "jpg"
        )
            .toLowerCase();


    return (
        Date.now() +
        "-" +
        index +
        "-" +
        Math.random()
            .toString(36)
            .slice(2, 8) +
        "." +
        extension
    );

}


// ============================================================
// UPLOAD PORTFOLIO
// ============================================================

uploadBtn?.addEventListener(
    "click",
    async function () {

        const files =
            portfolioFile
                ? [
                    ...portfolioFile.files
                ]
                : [];


        if (!files.length) {

            setMessage(
                uploadMessage,
                "Pilih foto terlebih dahulu.",
                "error"
            );

            return;

        }


        let category =
            portfolioCategory?.value ||
            "lainnya";


        if (
            !PORTFOLIO_FOLDERS
                .includes(category)
        ) {

            category =
                "lainnya";

        }


        uploadBtn.disabled =
            true;


        setMessage(
            uploadMessage,
            "Mengupload foto..."
        );


        try {

            for (
                let i = 0;
                i < files.length;
                i++
            ) {

                const file =
                    files[i];


                const validation =
                    validImage(file);


                if (validation) {

                    throw new Error(
                        validation
                    );

                }


                const fileName =
                    createFileName(
                        file,
                        i
                    );


                const filePath =
                    category +
                    "/" +
                    fileName;


                const {
                    error
                } =
                    await supabaseClient
                        .storage
                        .from(BUCKET)
                        .upload(
                            filePath,
                            file,
                            {

                                cacheControl:
                                    "3600",

                                upsert:
                                    false,

                                contentType:
                                    file.type

                            }
                        );


                if (error) {

                    throw error;

                }

            }


            setMessage(
                uploadMessage,
                files.length +
                " foto berhasil diupload.",
                "success"
            );


            portfolioFile.value =
                "";


            preview.src = "";

            preview.style.display =
                "none";


            await loadPortfolio();

        }

        catch (error) {

            console.error(
                "Upload portfolio:",
                error
            );


            setMessage(
                uploadMessage,
                "Upload gagal: " +
                error.message,
                "error"
            );

        }

        finally {

            uploadBtn.disabled =
                false;

        }

    }
);


// ============================================================
// REFRESH PORTFOLIO
// ============================================================

refreshPortfolioBtn
    ?.addEventListener(
        "click",
        loadPortfolio
    );


// ============================================================
// AMBIL FILE FOLDER
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

                    folder:
                        folder,

                    path:
                        folder +
                        "/" +
                        file.name

                };

            }
        );

}


// ============================================================
// FILE ROOT LAMA
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
                        200
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

                    folder:
                        "lama",

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

    if (!portfolioGrid) {

        return;

    }


    portfolioGrid.innerHTML =
        `
        <div class="empty">
            Memuat portfolio...
        </div>
        `;


    try {

        let allPhotos = [];


        // Foto lama root

        const rootFiles =
            await getRootFiles();


        allPhotos.push(
            ...rootFiles
        );


        // Foto folder kategori

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


        allPhotos.sort(
            function (a, b) {

                return (
                    new Date(
                        b.created_at ||
                        0
                    ) -
                    new Date(
                        a.created_at ||
                        0
                    )
                );

            }
        );


        if (statPortfolio) {

            statPortfolio.textContent =
                allPhotos.length;

        }


        if (
            allPhotos.length ===
            0
        ) {

            portfolioGrid.innerHTML =
                `
                <div class="empty">
                    Belum ada foto portfolio.
                </div>
                `;

            return;

        }


        portfolioGrid.innerHTML =
            "";


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


                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "photo";


                const image =
                    document.createElement(
                        "img"
                    );


                image.src =
                    publicData.publicUrl;


                image.loading =
                    "lazy";


                image.alt =
                    "Portfolio Gradding Studio";


                const category =
                    document.createElement(
                        "span"
                    );


                category.className =
                    "photo-category";


                category.textContent =
                    file.folder;


                const deleteButton =
                    document.createElement(
                        "button"
                    );


                deleteButton.type =
                    "button";


                deleteButton.className =
                    "btn btn-danger";


                deleteButton.textContent =
                    "Hapus";


                deleteButton.addEventListener(
                    "click",
                    function () {

                        deletePhoto(
                            file.path
                        );

                    }
                );


                card.appendChild(
                    image
                );


                card.appendChild(
                    category
                );


                card.appendChild(
                    deleteButton
                );


                portfolioGrid.appendChild(
                    card
                );

            }
        );

    }

    catch (error) {

        console.error(
            "Portfolio error:",
            error
        );


        portfolioGrid.innerHTML =
            `
            <div class="empty">
                Gagal memuat portfolio:
                ${escapeHtml(
                    error.message
                )}
            </div>
            `;

    }

}


// ============================================================
// HAPUS FOTO
// ============================================================

async function deletePhoto(
    filePath
) {

    if (
        !confirm(
            "Yakin ingin menghapus foto ini?"
        )
    ) {

        return;

    }


    try {

        const {
            error
        } =
            await supabaseClient
                .storage
                .from(BUCKET)
                .remove([
                    filePath
                ]);


        if (error) {

            throw error;

        }


        await loadPortfolio();

    }

    catch (error) {

        alert(
            "Gagal menghapus foto: " +
            error.message
        );

    }

}


// ============================================================
// LOAD BOOKING
// ============================================================

async function loadBookings() {

    if (!bookingList) {

        return;

    }


    bookingList.innerHTML =
        `
        <div class="empty">
            Memuat booking...
        </div>
        `;


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("bookings")
                .select("*")
                .order(
                    "created_at",
                    {
                        ascending:
                            false
                    }
                );


        if (error) {

            throw error;

        }


        allBookings =
            data || [];


        updateStats();

        renderBookings();

    }

    catch (error) {

        console.error(
            "Booking error:",
            error
        );


        bookingList.innerHTML =
            `
            <div class="empty">
                Gagal mengambil booking:
                ${escapeHtml(
                    error.message
                )}
            </div>
            `;

    }

}


// ============================================================
// STATISTIK
// ============================================================

function updateStats() {

    if (statTotal) {

        statTotal.textContent =
            allBookings.length;

    }


    if (statPending) {

        statPending.textContent =
            allBookings.filter(
                function (booking) {

                    return (
                        booking.status ===
                        "Menunggu"
                    );

                }
            ).length;

    }


    if (statConfirmed) {

        statConfirmed.textContent =
            allBookings.filter(
                function (booking) {

                    return (
                        booking.status ===
                        "Dikonfirmasi"
                    );

                }
            ).length;

    }

}


// ============================================================
// FILTER BOOKING
// ============================================================

function getFilteredBookings() {

    const search =
        searchBooking
            ?.value
            .trim()
            .toLowerCase() ||
        "";


    const status =
        filterStatus
            ?.value ||
        "";


    const sort =
        sortBooking
            ?.value ||
        "newest";


    let result =
        allBookings.filter(
            function (booking) {

                const textMatch =

                    !search ||

                    String(
                        booking.booking_code ||
                        ""
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        booking.name ||
                        ""
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        booking.phone ||
                        ""
                    )
                        .toLowerCase()
                        .includes(search);


                const statusMatch =

                    !status ||

                    booking.status ===
                    status;


                return (
                    textMatch &&
                    statusMatch
                );

            }
        );


    result.sort(
        function (a, b) {

            const dateA =
                new Date(
                    a.created_at
                );


            const dateB =
                new Date(
                    b.created_at
                );


            return (
                sort === "oldest"
                    ? dateA -
                    dateB

                    : dateB -
                    dateA
            );

        }
    );


    return result;

}


// ============================================================
// RENDER BOOKING
// ============================================================

function renderBookings() {

    if (!bookingList) {

        return;

    }


    const data =
        getFilteredBookings();


    if (
        data.length ===
        0
    ) {

        bookingList.innerHTML =
            `
            <div class="empty">
                Tidak ada booking.
            </div>
            `;

        return;

    }


    bookingList.innerHTML =
        data.map(
            function (booking) {

                return `

                <div class="booking">

                    <div class="booking-top">

                        <strong>
                            ${escapeHtml(
                                booking.booking_code
                            )}
                        </strong>

                        <span class="status">
                            ${escapeHtml(
                                booking.status ||
                                "Menunggu"
                            )}
                        </span>

                    </div>


                    <div class="meta">

                        <div>
                            <b>Nama:</b>
                            ${escapeHtml(
                                booking.name
                            )}
                        </div>

                        <div>
                            <b>WhatsApp:</b>
                            ${escapeHtml(
                                booking.phone
                            )}
                        </div>

                        <div>
                            <b>Jadwal:</b>
                            ${escapeHtml(
                                booking.booking_date
                            )}

                            ${escapeHtml(
                                booking.booking_time
                            )}
                        </div>

                        <div>
                            <b>Layanan:</b>
                            ${escapeHtml(
                                booking.service
                            )}
                        </div>

                        <div>
                            <b>Paket:</b>
                            ${escapeHtml(
                                booking.package_name
                            )}
                        </div>

                        <div>
                            <b>Lokasi:</b>
                            ${escapeHtml(
                                booking.location
                            )}
                        </div>

                    </div>


                    <div class="actions">

                        <select
                            class="booking-status"
                            data-id="${booking.id}"
                        >

                            <option
                                value="Menunggu"
                                ${
                                    booking.status ===
                                    "Menunggu"
                                        ? "selected"
                                        : ""
                                }
                            >
                                Menunggu
                            </option>

                            <option
                                value="Dikonfirmasi"
                                ${
                                    booking.status ===
                                    "Dikonfirmasi"
                                        ? "selected"
                                        : ""
                                }
                            >
                                Dikonfirmasi
                            </option>

                            <option
                                value="Selesai"
                                ${
                                    booking.status ===
                                    "Selesai"
                                        ? "selected"
                                        : ""
                                }
                            >
                                Selesai
                            </option>

                            <option
                                value="Dibatalkan"
                                ${
                                    booking.status ===
                                    "Dibatalkan"
                                        ? "selected"
                                        : ""
                                }
                            >
                                Dibatalkan
                            </option>

                        </select>


                        <button
                            class="btn btn-primary save-status"
                            data-id="${booking.id}"
                        >
                            Simpan Status
                        </button>


                        <button
                            class="btn btn-light detail-booking"
                            data-id="${booking.id}"
                        >
                            Detail
                        </button>


                        <button
                            class="btn btn-danger delete-booking"
                            data-id="${booking.id}"
                        >
                            Hapus
                        </button>

                    </div>

                </div>

                `;

            }
        )
        .join("");


    setupBookingButtons();

}


// ============================================================
// BUTTON BOOKING
// ============================================================

function setupBookingButtons() {

    document
        .querySelectorAll(
            ".save-status"
        )
        .forEach(
            function (button) {

                button.onclick =
                    async function () {

                        const id =
                            Number(
                                button.dataset.id
                            );


                        const select =
                            document.querySelector(
                                `.booking-status[data-id="${id}"]`
                            );


                        await updateStatus(
                            id,
                            select.value
                        );

                    };

            }
        );


    document
        .querySelectorAll(
            ".delete-booking"
        )
        .forEach(
            function (button) {

                button.onclick =
                    function () {

                        deleteBooking(
                            Number(
                                button.dataset.id
                            )
                        );

                    };

            }
        );


    document
        .querySelectorAll(
            ".detail-booking"
        )
        .forEach(
            function (button) {

                button.onclick =
                    function () {

                        openBookingDetail(
                            Number(
                                button.dataset.id
                            )
                        );

                    };

            }
        );

}


// ============================================================
// UPDATE STATUS
// ============================================================

async function updateStatus(
    id,
    status
) {

    try {

        const {
            error
        } =
            await supabaseClient
                .from("bookings")
                .update({
                    status:
                        status
                })
                .eq(
                    "id",
                    id
                );


        if (error) {

            throw error;

        }


        const booking =
            allBookings.find(
                function (item) {

                    return (
                        item.id ===
                        id
                    );

                }
            );


        if (booking) {

            booking.status =
                status;

        }


        updateStats();

        renderBookings();

    }

    catch (error) {

        alert(
            "Gagal update status: " +
            error.message
        );

    }

}


// ============================================================
// DELETE BOOKING
// ============================================================

async function deleteBooking(
    id
) {

    if (
        !confirm(
            "Hapus booking ini?"
        )
    ) {

        return;

    }


    try {

        const {
            error
        } =
            await supabaseClient
                .from("bookings")
                .delete()
                .eq(
                    "id",
                    id
                );


        if (error) {

            throw error;

        }


        allBookings =
            allBookings.filter(
                function (booking) {

                    return (
                        booking.id !==
                        id
                    );

                }
            );


        updateStats();

        renderBookings();

    }

    catch (error) {

        alert(
            "Gagal menghapus booking: " +
            error.message
        );

    }

}


// ============================================================
// HAPUS SEMUA BOOKING
// ============================================================

clearBookingsBtn
    ?.addEventListener(
        "click",
        async function () {

            if (
                !confirm(
                    "Yakin ingin menghapus SEMUA booking?"
                )
            ) {

                return;

            }


            try {

                const {
                    error
                } =
                    await supabaseClient
                        .from("bookings")
                        .delete()
                        .not(
                            "id",
                            "is",
                            null
                        );


                if (error) {

                    throw error;

                }


                allBookings = [];


                updateStats();

                renderBookings();

            }

            catch (error) {

                alert(
                    "Gagal menghapus booking: " +
                    error.message
                );

            }

        }
    );


// ============================================================
// SEARCH / FILTER
// ============================================================

searchBooking
    ?.addEventListener(
        "input",
        renderBookings
    );


filterStatus
    ?.addEventListener(
        "change",
        renderBookings
    );


sortBooking
    ?.addEventListener(
        "change",
        renderBookings
    );


// ============================================================
// DETAIL BOOKING
// ============================================================

function openBookingDetail(
    id
) {

    const booking =
        allBookings.find(
            function (item) {

                return (
                    item.id ===
                    id
                );

            }
        );


    if (
        !booking ||
        !bookingModal ||
        !bookingDetail
    ) {

        return;

    }


    bookingDetail.innerHTML =
        `

        <div class="detail">

            <div>
                <small>Kode Booking</small>
                <br>
                <strong>
                    ${escapeHtml(
                        booking.booking_code
                    )}
                </strong>
            </div>


            <div>
                <small>Status</small>
                <br>
                <strong>
                    ${escapeHtml(
                        booking.status
                    )}
                </strong>
            </div>


            <div>
                <small>Nama</small>
                <br>
                <strong>
                    ${escapeHtml(
                        booking.name
                    )}
                </strong>
            </div>


            <div>
                <small>WhatsApp</small>
                <br>
                <strong>
                    ${escapeHtml(
                        booking.phone
                    )}
                </strong>
            </div>


            <div>
                <small>Jadwal</small>
                <br>
                <strong>
                    ${escapeHtml(
                        booking.booking_date
                    )}

                    ${escapeHtml(
                        booking.booking_time
                    )}
                </strong>
            </div>


            <div>
                <small>Layanan</small>
                <br>
                <strong>
                    ${escapeHtml(
                        booking.service
                    )}
                </strong>
            </div>


            <div>
                <small>Paket</small>
                <br>
                <strong>
                    ${escapeHtml(
                        booking.package_name
                    )}
                </strong>
            </div>


            <div>
                <small>Lokasi</small>
                <br>
                <strong>
                    ${escapeHtml(
                        booking.location
                    )}
                </strong>
            </div>


            <div
                style="
                    grid-column:1/-1
                "
            >

                <small>
                    Catatan
                </small>

                <br>

                <strong>
                    ${escapeHtml(
                        booking.notes ||
                        "-"
                    )}
                </strong>

            </div>

        </div>

        `;


    bookingModal.classList.add(
        "active"
    );

}


// ============================================================
// MODAL
// ============================================================

closeModalBtn
    ?.addEventListener(
        "click",
        function () {

            bookingModal
                .classList
                .remove(
                    "active"
                );

        }
    );


bookingModal
    ?.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                bookingModal
            ) {

                bookingModal
                    .classList
                    .remove(
                        "active"
                    );

            }

        }
    );


// ============================================================
// START
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    checkSession
);