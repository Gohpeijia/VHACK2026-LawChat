import { createContext, useContext, ReactNode } from 'react';

export type LanguageCode = 'en' | 'ms' | 'id' | 'tl' | 'kel' | 'swk';

export interface TranslationContextType {
  t: (key: string) => string;
  language: LanguageCode;
}

const LocalizationContext = createContext<TranslationContextType | undefined>(undefined);

// Semantic Translation Registry
// Organized by UI Concept rather than just a flat list
const REGISTRY: Record<string, Record<LanguageCode, string>> = {
  // App Level
  'app.initializing': {
    en: 'Initializing LawChat...',
    ms: 'Memulakan LawChat...',
    id: 'Menyiapkan LawChat...',
    tl: 'Sinisimulan ang LawChat...',
    kel: 'Tengah mulo LawChat...',
    swk: 'Tengah mula LawChat...'
  },
  'app.error.title': {
    en: 'Application Error',
    ms: 'Ralat Aplikasi',
    id: 'Kesalahan Aplikasi',
    tl: 'Error sa Application',
    kel: 'Masalah Aplikasi',
    swk: 'Masalah Aplikasi'
  },
  'app.error.reload': {
    en: 'Reload Application',
    ms: 'Muat Semula Aplikasi',
    id: 'Muat Ulang Aplikasi',
    tl: 'I-reload ang Application',
    kel: 'Muat Semulo',
    swk: 'Reload Balit'
  },

  // Sidebar & Navigation
  'nav.docs': {
    en: 'Document Explainer',
    ms: 'Penerang Dokumen',
    id: 'Penjelasan Dokumen',
    tl: 'Tagapaliwanag ng Dokumento',
    kel: 'Penere Dokume',
    swk: 'Penerang Dokumen'
  },
  'nav.lawchat': {
    en: 'LawChat',
    ms: 'LawChat',
    id: 'LawChat',
    tl: 'LawChat',
    kel: 'LawChat',
    swk: 'LawChat'
  },
  'nav.history': {
    en: 'History',
    ms: 'Sejarah',
    id: 'Riwayat',
    tl: 'Kasaysayan',
    kel: 'Sejarah',
    swk: 'Sejarah'
  },
  'nav.language': {
    en: 'Language',
    ms: 'Bahasa',
    id: 'Bahasa',
    tl: 'Wika',
    kel: 'Bahaso',
    swk: 'Bahasa'
  },
  'nav.theme.light': {
    en: 'Light Mode',
    ms: 'Mod Terang',
    id: 'Mode Terang',
    tl: 'Light Mode',
    kel: 'Mod Terang',
    swk: 'Mod Terang'
  },
  'nav.theme.dark': {
    en: 'Dark Mode',
    ms: 'Mod Gelap',
    id: 'Mode Gelap',
    tl: 'Dark Mode',
    kel: 'Mod Gelap',
    swk: 'Mod Gelap'
  },
  'nav.login': {
    en: 'Login / Sign Up',
    ms: 'Log Masuk / Daftar',
    id: 'Masuk / Daftar',
    tl: 'Mag-login / Mag-sign Up',
    kel: 'Masuk / Daftar',
    swk: 'Log Masuk / Daftar'
  },
  'nav.logout': {
    en: 'Logout',
    ms: 'Log Keluar',
    id: 'Keluar',
    tl: 'Mag-logout',
    kel: 'Keluar',
    swk: 'Log Keluar'
  },
  'nav.grounded': {
    en: 'RAG Grounded',
    ms: 'Berasaskan RAG',
    id: 'Berbasis RAG',
    tl: 'RAG Grounded',
    kel: 'Berasaskan RAG',
    swk: 'Berasaskan RAG'
  },

  // LawChat Interface
  'law.title': {
    en: 'LawChat',
    ms: 'LawChat',
    id: 'LawChat',
    tl: 'LawChat',
    kel: 'LawChat',
    swk: 'LawChat'
  },
  'law.subtitle': {
    en: 'Know your rights in plain language.',
    ms: 'Fahami hak anda dalam bahasa mudah.',
    id: 'Pahami hak Anda dalam bahasa sederhana.',
    tl: 'Alamin ang iyong mga karapatan sa simpleng pananalita.',
    kel: 'Pehe hak awok dale bahaso mudoh.',
    swk: 'Paham hak kitak dalam bahasa mudah.'
  },
  'law.quick_topics': {
    en: 'Quick Topics',
    ms: 'Topik Pantas',
    id: 'Topik Cepat',
    tl: 'Mabilis na Paksa',
    kel: 'Topik Pataih',
    swk: 'Topik Laju'
  },
  'law.tools': {
    en: 'Tools',
    ms: 'Alatan',
    id: 'Alat',
    tl: 'Mga Kasangkapan',
    kel: 'Alate',
    swk: 'Alat'
  },
  'law.snap_contract': {
    en: 'Snap Contract',
    ms: 'Imbas Kontrak',
    id: 'Pindai Kontrak',
    tl: 'Kunan ang Kontrata',
    kel: 'Tangkap Gambar Kontrak',
    swk: 'Snap Kontrak'
  },
  'law.new_chat': {
    en: 'New Chat',
    ms: 'Sembang Baru',
    id: 'Obrolan Baru',
    tl: 'Bagong Chat',
    kel: 'Kecek Baru',
    swk: 'Sembang Baru'
  },
  'law.placeholder': {
    en: 'Type your question...',
    ms: 'Taip soalan anda...',
    id: 'Ketik pertanyaan Anda...',
    tl: 'I-type ang iyong tanong...',
    kel: 'Tulis soale demo...',
    swk: 'Taip soalan kitak...'
  },
  'law.thinking': {
    en: 'LawChat is thinking...',
    ms: 'LawChat sedang berfikir...',
    id: 'LawChat sedang berpikir...',
    tl: 'Nag-iisip ang LawChat...',
    kel: 'LawChat tengah miki...',
    swk: 'LawChat tengah mikir...'
  },
  'law.welcome.title': {
    en: "Apa khabar? I'm LawChat.",
    ms: "Apa khabar? Saya LawChat.",
    id: "Apa kabar? Saya LawChat.",
    tl: "Kumusta? Ako si LawChat.",
    kel: "Gano demo? Ambo LawChat.",
    swk: "Apa khabar? Kamek LawChat."
  },
  'law.welcome.desc': {
    en: 'Select a topic on the left or ask me anything about national law.',
    ms: 'Pilih topik di kiri atau tanya saya apa-apa tentang undang-undang negara.',
    id: 'Pilih topik di kiri atau tanya saya apa saja tentang hukum nasional.',
    tl: 'Pumili ng paksa sa kaliwa o magtanong tungkol sa batas ng bansa.',
    kel: 'Pilih topik kat kiri tu atau tanyo ambo gapo-gapo pasal ude-ude negaro.',
    swk: 'Pilih topik kat kiba ya atau tanya kamek apa-apa pasal undang-undang negara.'
  },
  'law.welcome.example': {
    en: '"Can my landlord evict me in 3 days?"',
    ms: '"Bolehkah tuan rumah halau saya dalam 3 hari?"',
    id: '"Bisakah pemilik rumah mengusir saya dalam 3 hari?"',
    tl: '"Maaari ba akong paalisin ng aking landlord sa loob ng 3 araw?"',
    kel: '"Boleh ko tuan ghumah halau ambo dale 3 hari?"',
    swk: '"Boleh kah tuan rumah halau kamek dalam 3 hari?"'
  },
  'law.contractAnalysis': {
    en: 'Contract Analysis',
    ms: 'Analisis Kontrak',
    id: 'Analisis Kontrak',
    tl: 'Pagsusuri ng Kontrata',
    kel: 'Analisis Kontrak',
    swk: 'Analisis Kontrak'
  },
  'law.illegalClause': {
    en: 'Illegal Clause',
    ms: 'Klausa Haram/Tidak Sah',
    id: 'Klausul Ilegal',
    tl: 'Ilegal na Sugnay',
    kel: 'Klausa Tak Sah',
    swk: 'Klausa Haram'
  },
  'law.unfairClause': {
    en: 'Unfair Clause',
    ms: 'Klausa Tidak Adil',
    id: 'Klausul Tidak Adil',
    tl: 'Hindi Patas na Sugnay',
    kel: 'Klausa Tak Adil',
    swk: 'Klausa Sik Adil'
  },
  'law.knowYourRights': {
    en: 'Know Your Rights',
    ms: 'Ketahui Hak Anda',
    id: 'Ketahui Hak Anda',
    tl: 'Alamin ang Iyong mga Karapatan',
    kel: 'Tahu Hak Demo',
    swk: 'Tauk Hak Kitak'
  },
  'law.source': {
    en: 'Source: National Statutes & Case Law',
    ms: 'Sumber: Statut Kebangsaan & Undang-undang Kes',
    id: 'Sumber: Statuta Nasional & Hukum Kasus',
    tl: 'Pinagmulan: Mga Pambansang Batas at Case Law',
    kel: 'Sumber: Ude-ude Negaro & Kes Mahkamah',
    swk: 'Sumber: Undang-undang Negara & Kes Mahkamah'
  },
  'law.analyzeAnother': {
    en: 'Analyze another contract',
    ms: 'Analisis kontrak lain',
    id: 'Analisis kontrak lain',
    tl: 'Suriin ang isa pang kontrata',
    kel: 'Analisis kontrak lain pulok',
    swk: 'Analisis kontrak lain gik'
  },

  // Categories
  'cat.tenancy': {
    en: 'Tenancy',
    ms: 'Sewa Kediaman',
    id: 'Sewa Rumah',
    tl: 'Pag-upa',
    kel: 'Sewa Ghumah',
    swk: 'Sewa Rumah'
  },
  'cat.tenancy.desc': {
    en: 'Rent, deposits, eviction',
    ms: 'Sewa, deposit, pengusiran',
    id: 'Sewa, deposit, pengusiran',
    tl: 'Upa, deposito, pagpapaalis',
    kel: 'Sewa, deposit, halau',
    swk: 'Sewa, deposit, halau'
  },
  'cat.employment': {
    en: 'Employment',
    ms: 'Pekerjaan',
    id: 'Pekerjaan',
    tl: 'Trabaho',
    kel: 'Keje',
    swk: 'Kerja'
  },
  'cat.employment.desc': {
    en: 'Salary, EPF, termination',
    ms: 'Gaji, KWSP, penamatan',
    id: 'Gaji, BPJS, pemutusan hubungan kerja',
    tl: 'Sahod, SSS, pagtatapos ng trabaho',
    kel: 'Gaji, KWSP, kene pecat',
    swk: 'Gaji, KWSP, kene pecat'
  },
  'cat.consumer': {
    en: 'Consumer',
    ms: 'Pengguna',
    id: 'Konsumen',
    tl: 'Mamimili',
    kel: 'Pembeli',
    swk: 'Pembeli'
  },
  'cat.consumer.desc': {
    en: 'Refunds, scams, warranties',
    ms: 'Bayaran balik, penipuan, waranti',
    id: 'Pengembalian dana, penipuan, garansi',
    tl: 'Refund, scam, warranty',
    kel: 'Duit kelik, kene tipu, waranti',
    swk: 'Duit balit, kene tipu, waranti'
  },
  'cat.family': {
    en: 'Family',
    ms: 'Keluarga',
    id: 'Keluarga',
    tl: 'Pamilya',
    kel: 'Anak Beranak',
    swk: 'Keluarga'
  },
  'cat.family.desc': {
    en: 'Marriage, divorce, custody',
    ms: 'Perkahwinan, perceraian, hak penjagaan',
    id: 'Pernikahan, perceraian, hak asuh',
    tl: 'Kasal, diborsyo, kustodiya',
    kel: 'Nikah, cerai, jago anak',
    swk: 'Nikah, cerai, jaga anak'
  },
  'cat.accidents': {
    en: 'Road Accidents',
    ms: 'Kemalangan Jalan Raya',
    id: 'Kecelakaan Jalan Raya',
    tl: 'Aksidente sa Daan',
    kel: 'Eksiden Jale',
    swk: 'Eksiden Jalan'
  },
  'cat.accidents.desc': {
    en: 'Insurance, claims, police',
    ms: 'Insurans, tuntutan, polis',
    id: 'Asuransi, klaim, polisi',
    tl: 'Seguro, claim, pulis',
    kel: 'Insurans, tuntute, polis',
    swk: 'Insurans, tuntutan, polis'
  },
  'cat.welfare': {
    en: 'Welfare Rights',
    ms: 'Hak Kebajikan',
    id: 'Hak Kesejahteraan',
    tl: 'Karapatan sa Kagalingan',
    kel: 'Hak Kebajike',
    swk: 'Hak Kebajikan'
  },
  'cat.welfare.desc': {
    en: 'JKM, subsidies, aid',
    ms: 'JKM, subsidi, bantuan',
    id: 'Bantuan sosial, subsidi, bantuan',
    tl: 'Ayuda, subsidiya, tulong',
    kel: 'JKM, subsidi, bantue',
    swk: 'JKM, subsidi, bantuan'
  },

  // Document Explainer
  'docs.title': {
    en: 'Document Explainer',
    ms: 'Penerang Dokumen',
    id: 'Penjelasan Dokumen',
    tl: 'Tagapaliwanag ng Dokumento',
    kel: 'Penere Dokume',
    swk: 'Penerang Dokumen'
  },
  'docs.subtitle': {
    en: 'Upload any legal document for a plain-English breakdown.',
    ms: 'Muat naik sebarang dokumen undang-undang untuk penjelasan bahasa mudah.',
    id: 'Unggah dokumen hukum apa pun untuk penjelasan bahasa sederhana.',
    tl: 'Mag-upload ng anumang legal na dokumento para sa simpleng paliwanag.',
    kel: 'Upload dokume ude-ude nak pehe dale bahaso mudoh.',
    swk: 'Upload apa-apa dokumen undang-undang untuk penerangan bahasa mudah.'
  },
  'docs.snapPhoto': {
    en: 'Snap a Photo',
    ms: 'Ambil Gambar',
    id: 'Ambil Foto',
    tl: 'Kumuha ng Larawan',
    kel: 'Tangkap Gambar',
    swk: 'Ambil Gambar'
  },
  'docs.snapPhotoDesc': {
    en: 'Use your camera to scan a letter',
    ms: 'Gunakan kamera untuk imbas surat',
    id: 'Gunakan kamera untuk memindai surat',
    tl: 'Gamitin ang iyong camera para i-scan ang sulat',
    kel: 'Guno kamera nak imbas surat',
    swk: 'Pake kamera nak scan surat'
  },
  'docs.uploadFile': {
    en: 'Upload File',
    ms: 'Muat Naik Fail',
    id: 'Unggah Berkas',
    tl: 'Mag-upload ng File',
    kel: 'Upload Fail',
    swk: 'Upload Fail'
  },
  'docs.uploadFileDesc': {
    en: 'PDF or images from your device',
    ms: 'PDF atau imej dari peranti anda',
    id: 'PDF atau gambar dari perangkat Anda',
    tl: 'PDF o mga larawan mula sa iyong device',
    kel: 'PDF ko imej dari telefon demo',
    swk: 'PDF o imej dari peranti kitak'
  },
  'docs.loading.1': {
    en: 'Extracting key terms...',
    ms: 'Mengekstrak terma utama...',
    id: 'Mengekstrak istilah kunci...',
    tl: 'Kinukuha ang mga pangunahing termino...',
    kel: 'Tengah ambik terma utamo...',
    swk: 'Tengah ngambik terma utama...'
  },
  'docs.loading.2': {
    en: 'Analyzing content deeply...',
    ms: 'Menganalisis kandungan secara mendalam...',
    id: 'Menganalisis konten secara mendalam...',
    tl: 'Malalimang sinusuri ang nilalaman...',
    kel: 'Tengah analisis dale-dale...',
    swk: 'Tengah analisis dalam-dalam...'
  },
  'docs.loading.3': {
    en: 'Generating action suggestions...',
    ms: 'Menjana cadangan tindakan...',
    id: 'Menghasilkan saran tindakan...',
    tl: 'Gumagawa ng mga mungkahi sa pagkilos...',
    kel: 'Tengah buat cadange...',
    swk: 'Tengah polok cadangan...'
  },
  'docs.loading.4': {
    en: 'Simplifying legal terminology...',
    ms: 'Memudahkan istilah undang-undang...',
    id: 'Menyederhanakan istilah hukum...',
    tl: 'Pinapayak ang mga legal na termino...',
    kel: 'Tengah mudohke istilah ude-ude...',
    swk: 'Tengah mudahkan istilah undang-undang...'
  },
  'docs.loadingTime': {
    en: 'This usually takes 10-15 seconds...',
    ms: 'Ini biasanya mengambil masa 10-15 saat...',
    id: 'Ini biasanya memakan waktu 10-15 detik...',
    tl: 'Karaniwang tumatagal ito ng 10-15 segundo...',
    kel: 'Biaso lamo 10-15 saat jah...',
    swk: 'Biasanya ambik masa 10-15 saat...'
  },
  'docs.errorTitle': {
    en: 'Connection Error',
    ms: 'Ralat Sambungan',
    id: 'Kesalahan Koneksi',
    tl: 'Error sa Koneksyon',
    kel: 'Masalah Sambunge',
    swk: 'Masalah Sambungan'
  },
  'docs.reportTitle': {
    en: 'Deep Analysis Report',
    ms: 'Laporan Analisis Mendalam',
    id: 'Laporan Analisis Mendalam',
    tl: 'Ulat ng Malalimang Pagsusuri',
    kel: 'Lapor Analisis Dale',
    swk: 'Laporan Analisis Dalam'
  },
  'docs.disclaimer': {
    en: 'Disclaimer: This analysis is for reference only and does not constitute legal advice. Please consult a professional lawyer if needed.',
    ms: 'Penafian: Analisis ini adalah untuk rujukan sahaja dan bukan nasihat undang-undang. Sila rujuk peguam profesional jika perlu.',
    id: 'Penafian: Analisis ini hanya untuk referensi dan bukan saran hukum. Silakan berkonsultasi dengan pengacara profesional jika perlu.',
    tl: 'Disclaimer: Ang pagsusuring ito ay para sa sanggunian lamang at hindi bumubuo ng legal na payo. Mangyaring kumunsulta sa isang propesyonal na abogado kung kinakailangan.',
    kel: 'Penafe: Analisis ni untuk rujukan jah, buke nasihat ude-ude. Tolong tanyo loyar kalu perlu.',
    swk: 'Penafian: Analisis tok untuk rujukan jak, sik bawak maksud nasihat undang-undang. Sila tanya peguam profesional mun perlu.'
  },
  'docs.followUp': {
    en: 'Follow-up Chat',
    ms: 'Sembang Susulan',
    id: 'Obrolan Lanjutan',
    tl: 'Follow-up Chat',
    kel: 'Kecek Lanjut',
    swk: 'Sembang Lanjut'
  },
  'docs.followUpDesc': {
    en: 'Have questions about the report? Ask our AI expert here.',
    ms: 'Ada soalan tentang laporan? Tanya pakar AI kami di sini.',
    id: 'Ada pertanyaan tentang laporan? Tanya pakar AI kami di sini.',
    tl: 'May mga tanong tungkol sa ulat? Magtanong sa aming AI expert dito.',
    kel: 'Ado soale pasal lapor ni? Tanyo pakar AI kito kat sini.',
    swk: 'Ada soalan pasal laporan tok? Tanya pakar AI kamek orang kat sitok.'
  },
  'docs.thinking': {
    en: 'Thinking...',
    ms: 'Berfikir...',
    id: 'Berpikir...',
    tl: 'Nag-iisip...',
    kel: 'Tengah miki...',
    swk: 'Tengah mikir...'
  },
  'docs.placeholder': {
    en: 'Type your question...',
    ms: 'Taip soalan anda...',
    id: 'Ketik pertanyaan Anda...',
    tl: 'I-type ang iyong tanong...',
    kel: 'Tulis soale demo...',
    swk: 'Taip soalan kitak...'
  },

  // History
  'history.title': {
    en: 'History',
    ms: 'Sejarah',
    id: 'Riwayat',
    tl: 'Kasaysayan',
    kel: 'Sejarah',
    swk: 'Sejarah'
  },
  'history.subtitle': {
    en: 'Your simplified documents and LawChat Q&As saved to your account.',
    ms: 'Dokumen mudah dan soal jawab LawChat anda disimpan ke akaun anda.',
    id: 'Dokumen sederhana dan tanya jawab LawChat Anda disimpan ke akun Anda.',
    tl: 'Ang iyong mga pinasimpleng dokumento at LawChat Q&A ay naka-save sa iyong account.',
    kel: 'Dokume mudoh nget nge soal jawab LawChat demo simpe dale akaun.',
    swk: 'Dokumen mudah ngan soal jawab LawChat kitak disimpan dalam akaun kitak.'
  },
  'history.empty': {
    en: 'No history found yet. Start by asking LawChat a question or scanning a document.',
    ms: 'Tiada sejarah dijumpai. Mula dengan bertanya LawChat atau imbas dokumen.',
    id: 'Belum ada riwayat. Mulailah dengan bertanya pada LawChat atau memindai dokumen.',
    tl: 'Wala pang nahanap na kasaysayan. Magsimula sa pamamagitan ng pagtatanong sa LawChat o pag-scan ng dokumento.',
    kel: 'Takdok sejarah lagi. Mulo nge tanyo LawChat ko imbas dokume.',
    swk: 'Sikda sejarah gik. Mula dengan nanya LawChat atau scan dokumen.'
  },
  'history.login_required': {
    en: 'Login Required',
    ms: 'Log Masuk Diperlukan',
    id: 'Diperlukan Masuk',
    tl: 'Kailangan ng Login',
    kel: 'Kene Masuk Dulu',
    swk: 'Kena Log Masuk Dulu'
  },
  'history.login_desc': {
    en: 'Please sign in to view your interaction history and saved documents.',
    ms: 'Sila log masuk untuk melihat sejarah interaksi dan dokumen yang disimpan.',
    id: 'Silakan masuk untuk melihat riwayat interaksi dan dokumen yang disimpan.',
    tl: 'Mangyaring mag-sign in upang makita ang iyong kasaysayan ng pakikipag-ugnayan at mga naka-save na dokumento.',
    kel: 'Silo masuk dulu nak tengok sejarah awok.',
    swk: 'Sila log masuk dulu maok nengok sejarah kitak.'
  },
  'history.sign_in_btn': {
    en: 'Sign In Now',
    ms: 'Log Masuk Sekarang',
    id: 'Masuk Sekarang',
    tl: 'Mag-sign In Ngayon',
    kel: 'Masuk Selaluh',
    swk: 'Log Masuk Kelak'
  },

  // Auth
  'auth.welcome': {
    en: 'Welcome to LawChat',
    ms: 'Selamat Datang ke LawChat',
    id: 'Selamat Datang di LawChat',
    tl: 'Maligayang Pagdating sa LawChat',
    kel: 'Selamat Date ke LawChat',
    swk: 'Selamat Datang ke LawChat'
  },
  'auth.loginTitle': {
    en: 'Welcome back to your legal assistant',
    ms: 'Selamat kembali ke pembantu undang-undang anda',
    id: 'Selamat datang kembali di asisten hukum Anda',
    tl: 'Maligayang pagbabalik sa iyong legal na assistant',
    kel: 'Slamat kelik ko pembantu ude-ude demo',
    swk: 'Selamat datang balit ke pembantu undang-undang kitak'
  },
  'auth.signupTitle': {
    en: 'Join the inclusive legal revolution',
    ms: 'Sertai revolusi undang-undang inklusif',
    id: 'Bergabunglah dengan revolusi hukum inklusif',
    tl: 'Sumali sa inklusibong legal na rebolusyon',
    kel: 'Jom join revolusi ude-ude inklusif',
    swk: 'Jom join revolusi undang-undang inklusif'
  },
  'auth.fullName': {
    en: 'Full Name',
    ms: 'Nama Penuh',
    id: 'Nama Lengkap',
    tl: 'Buong Pangalan',
    kel: 'Namo Penuh',
    swk: 'Nama Penuh'
  },
  'auth.email': {
    en: 'Email Address',
    ms: 'Alamat Emel',
    id: 'Alamat Email',
    tl: 'Email Address',
    kel: 'Alamat Emel',
    swk: 'Alamat Emel'
  },
  'auth.password': {
    en: 'Password',
    ms: 'Kata Laluan',
    id: 'Kata Sandi',
    tl: 'Password',
    kel: 'Kato Lalue',
    swk: 'Kata Laluan'
  },
  'auth.signIn': {
    en: 'Sign In',
    ms: 'Log Masuk',
    id: 'Masuk',
    tl: 'Mag-sign In',
    kel: 'Masuk',
    swk: 'Log Masuk'
  },
  'auth.signUp': {
    en: 'Create Account',
    ms: 'Daftar Akaun',
    id: 'Buat Akun',
    tl: 'Gumawa ng Account',
    kel: 'Buat Akaun',
    swk: 'Daftar Akaun'
  },
  'auth.processing': {
    en: 'Processing...',
    ms: 'Memproses...',
    id: 'Memproses...',
    tl: 'Pinoproseso...',
    kel: 'Tengah proses...',
    swk: 'Tengah proses...'
  },
  'auth.orContinue': {
    en: 'Or continue with',
    ms: 'Atau teruskan dengan',
    id: 'Atau lanjutkan dengan',
    tl: 'O magpatuloy sa',
    kel: 'Ko terus nge',
    swk: 'Atau terus ngan'
  },
  'auth.google': {
    en: 'Google Account',
    ms: 'Akaun Google',
    id: 'Akun Google',
    tl: 'Google Account',
    kel: 'Akaun Google',
    swk: 'Akaun Google'
  },
  'auth.noAccount': {
    en: "Don't have an account? Sign Up",
    ms: "Tiada akaun? Daftar Sekarang",
    id: "Belum punya akun? Daftar",
    tl: "Wala pang account? Mag-sign Up",
    kel: "Takdok akaun? Daftar la",
    swk: "Sikda akaun? Daftar kinek"
  },
  'auth.hasAccount': {
    en: 'Already have an account? Sign In',
    ms: 'Sudah ada akaun? Log Masuk',
    id: 'Sudah punya akun? Masuk',
    tl: 'May account na? Mag-sign In',
    kel: 'Doh ado akaun? Masuk la',
    swk: 'Dah ada akaun? Log Masuk'
  },
  'auth.forgotPassword': {
    en: 'Forgot Password?',
    ms: 'Lupa Kata Laluan?',
    id: 'Lupa Kata Sandi?',
    tl: 'Nakalimutan ang Password?',
    kel: 'Lupo Kato Lalue?',
    swk: 'Lupa Kata Laluan?'
  },
  'auth.continueGuest': {
    en: 'Continue as Guest',
    ms: 'Teruskan sebagai Tetamu',
    id: 'Lanjutkan sebagai Tamu',
    tl: 'Magpatuloy bilang Guest',
    kel: 'Terus sebage Tetamu',
    swk: 'Terus sebagai Tetamu'
  },
  'auth.resetEmailSent': {
    en: 'Password reset email sent! Check your inbox.',
    ms: 'Emel tetapan semula kata laluan dihantar! Semak peti masuk anda.',
    id: 'Email pengaturan ulang kata sandi terkirim! Periksa kotak masuk Anda.',
    tl: 'Naipadala na ang password reset email! Suriin ang iyong inbox.',
    kel: 'Emel tuko kato lalue doh hantar! Tengok inbox deh.',
    swk: 'Emel reset kata laluan dah hantar! Check inbox kitak.'
  },

  // Footer
  'footer.disclaimer': {
    en: 'LawChat provides general information based on official statutes. Not legal advice.',
    ms: 'LawChat menyediakan maklumat am berdasarkan statut rasmi. Bukan nasihat undang-undang.',
    id: 'LawChat menyediakan informasi umum berdasarkan undang-undang resmi. Bukan saran hukum.',
    tl: 'Ang LawChat ay nagbibigay ng pangkalahatang impormasyon batay sa mga opisyal na batas. Hindi legal na payo.',
    kel: 'LawChat bagi maklumat biaso jah. Bukan nasihat guamale.',
    swk: 'LawChat nyedia maklumat am jak. Bukan nasihat undang-undang.'
  }
};

export const LocalizationProvider = ({ children, language }: { children: ReactNode, language: LanguageCode }) => {
  const t = (key: string): string => {
    const entry = REGISTRY[key];
    if (!entry) return key;
    return entry[language] || entry['en'] || key;
  };

  return (
    <LocalizationContext.Provider value={{ t, language }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};
