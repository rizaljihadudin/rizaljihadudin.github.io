const IMAGE_BASE = "assets/images/projects";

const PAGE_SIZE = 9;

const SITE = {
    name: "Rizal Jihadudin",
    role: "WEB DEVELOPER",
    tagline: "Building fast, clean, and functional web applications.",
    location: "Depok, Indonesia",
    email: "rizaljihadudin@gmail.com",
    socials: [
        { label: "GitHub", url: "https://github.com/rizaljihadudin" },
        { label: "LinkedIn", url: "https://www.linkedin.com/in/rizaljihadudin" },
        { label: "Email", url: "mailto:rizaljihadudin@gmail.com" }
    ],
    stats: [
        { value: "24", label: "Proyek Rilis" },
        { value: "7", label: "Tahun Ngoding" },
        { value: "12", label: "Klien Puas" }
    ]
};

const media = (slug) => ({
    cover: `${IMAGE_BASE}/${slug}/1.png`,
    gallery: [
        `${IMAGE_BASE}/${slug}/1.png`,
        `${IMAGE_BASE}/${slug}/2.png`,
        `${IMAGE_BASE}/${slug}/3.png`
    ]
});

const PROJECTS = [
    {
        id: "kataba-accounting",
        title: "Katabanet",
        category: "Web App",
        summary: "Sistem akuntansi online untuk UKM dengan fitur pelaporan keuangan maupun asset barang.",
        description: [
            "Kataba Accounting adalah solusi akuntansi online yang dirancang khusus untuk UKM. Sistem ini menyediakan fitur pelaporan keuangan yang lengkap dan mudah digunakan, memungkinkan pengguna untuk memantau arus kas, laba rugi, dan neraca keuangan mereka dengan cepat.",
            "Dengan antarmuka yang sederhana dan mudah digunakan, Kataba Accounting memungkinkan pengguna untuk mengelola transaksi keuangan mereka dengan efisien."
        ],
        stack: ["PHP (Codeigniter)", "Bootstrap", "JavaScript", "MySQL"],
        url: "https://kataba.net/keuangan/login",
        ...media("kataba-accounting")
    },
    {
        id: "mni-kementan-ri",
        title: "MNI Kementan RI",
        category: "Web App",
        summary: "Sistem informasi manajemen dan Display Informasi untuk Masjid Kementerian Pertanian Republik Indonesia.",
        description: [
            "MNI Kementan RI adalah sistem informasi manajemen yang dirancang untuk Masjid Kementerian Pertanian Republik Indonesia. Sistem ini menyediakan fitur manajemen yang efisien untuk mengelola kegiatan dan informasi terkait masjid, termasuk jadwal sholat, pengumuman, dan kegiatan lainnya. Terdapat fitur untuk melakukan infak dan donasi secara online, serta menampilkan informasi penting melalui display informasi yang terintegrasi dengan sistem.",
        ],
        stack: ["PHP (Codeigniter)", "Bootstrap", "JavaScript", "MySQL"],
        url: "https://www.mni-kementanri.com/",
        ...media("mni-kementan-ri")
    },
    {
        id: "sso",
        title: "SSO",
        category: "Web App",
        summary: "Sistem Single Sign-On (SSO) untuk mengelola autentikasi pengguna di berbagai aplikasi internal.",
        description: [
            "SSO adalah sistem untuk mengelola autentikasi pengguna di berbagai aplikasi internal.",
        ],
        stack: ["PHP (Laravel)", "Bootstrap", "JavaScript", "PostgreSQL"],
        url: "-",
        ...media("sso")
    },
    {
        id: "tax-audit-system",
        title: "Tax Audit System",
        category: "Web App",
        summary: "Sistem audit pajak untuk mengelola proses audit.",
        description: [
            "Tax Audit System adalah sistem yang dirancang untuk mengelola proses audit secara efisien dan akurat.",
        ],
        stack: ["React JS", "antd-design", "tailwindcss", "axios", "JavaScript"],
        url: "-",
        ...media("tax-audit-system")
    },
    {
        id: "bmw",
        title: "Warehouse Billing Module System",
        category: "Web App",
        summary: "Sistem untuk mengelola modul billing di gudang.",
        description: [
            "Warehouse Billing Module System adalah sistem yang dirancang untuk mengelola proses billing di gudang secara efisien dan akurat.",
        ],
        stack: ["React JS", "antd-design", "tailwindcss", "axios", "JavaScript"],
        url: "-",
        ...media("bmw")
    },
    {
        id: "kanban-wms",
        title: "Kanban WMS",
        category: "Web App",
        summary: "Sistem untuk memonitoring picking dalam proses pengambilan barang.",
        description: [
            "Kanban WMS adalah sistem yang dirancang untuk memonitoring picking dalam proses pengambilan barang secara efisien dan akurat.",
        ],
        stack: ["React JS", "antd-design", "tailwindcss", "axios", "JavaScript"],
        url: "-",
        ...media("kanban-wms")
    },
    {
        id: "fvs",
        title: "FVS",
        category: "Web App",
        summary: "Sistem untuk melakukan monitoring history perjalanan kendaraan.",
        description: [
            "FVS adalah sistem yang dirancang untuk melakukan monitoring history perjalanan kendaraan secara efisien dan akurat.",
        ],
        stack: ["React JS", "shadcn/ui", "tailwindcss", "axios", "JavaScript"],
        url: "-",
        ...media("fvs")
    },
    {
        id: "fm-cms",
        title: "FM CMS",
        category: "Web App",
        summary: "Sistem untuk melakukan pengelolaan dan monitoring fasilitas se.",
        description: [
            "FM CMS adalah sistem yang dirancang untuk melakukan pengelolaan dan monitoring fasilitas secara efisien dan akurat.",
        ],
        stack: ["PHP (Laravel)", "VueJS", "bootstrap", "axios", "JavaScript", "MySQL"],
        url: "-",
        ...media("fm-cms")
    },
];
