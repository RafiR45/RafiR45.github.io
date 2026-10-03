/* External on purpose (no inline JS), so a CSP can drop 'unsafe-inline'.

   1. Language (ID default, EN optional). The HTML is written in Indonesian,
      so the page reads fine without JS. On load the Indonesian text is read
      back from every [data-i18n] element, so only English lives here.
   2. Project drawer: a native <dialog> opened as a modal side panel. The
      browser gives focus trapping, Esc and an inert page for free.
   3. Reveal on scroll and a gentle parallax on the hero shapes (both off
      under reduced motion).

   Every text is set with textContent / createElement: nothing is parsed as
   HTML, so the data below can never inject markup. */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =====================================================================
     Content
     ===================================================================== */

  var LANG_KEY = 'rafi-lang';

  // Every call to action opens an email with its subject already filled in, in
  // the page language. The HTML holds the Indonesian subject (data-mail-text)
  // so the links still work without JS.
  var MAIL_BASE = 'mailto:mrafirafi36@gmail.com?subject=';

  // English for everything marked [data-i18n] / [data-i18n-aria] in the HTML.
  var EN = {
    'meta.title': 'Muhammad Rafi — Web developer for small businesses',
    'meta.desc': 'Muhammad Rafi builds simple, fast websites and apps for small Indonesian businesses.',
    'nav.label': 'Sections',
    'nav.about': 'About',
    'nav.services': 'Services',
    'nav.pricing': 'Pricing',
    'nav.contact': 'Say hi',
    'lang.label': 'Language',
    'hero.tagline': 'Web developer helping small Indonesian businesses grow with websites and apps that are simple, fast and easy to use.',
    'hero.cta.work': 'See my work',
    'hero.cta.talk': "Let's talk",
    'hero.proof': 'Worked with warungs, coffee shops, caterers and a batik maker.',
    'hero.art': 'A playful arrangement of circles, blocks and lines',
    'benefits.title': 'A website really pays off!',
    'benefits.lead': "It doesn't have to be expensive or complicated. Here is what your business gets straight away:",
    'benefits.1.title': 'Open 24 hours',
    'benefits.1.text': 'Customers can still see your products, prices and opening hours after the shop has closed.',
    'benefits.2.title': 'Easy to find',
    'benefits.2.text': 'Your business shows up when people search on Google or Google Maps, not just in a social media feed.',
    'benefits.3.title': 'Looks more trustworthy',
    'benefits.3.text': 'Your own website address reassures buyers, especially those who have never visited in person.',
    'benefits.4.title': 'Tidier orders',
    'benefits.4.text': 'Orders arrive complete and clear in WhatsApp, instead of getting lost among hundreds of chats.',
    'about.title.a': 'A bit',
    'about.title.b': 'about me',
    'about.text': "Hi, I'm Rafi — M. Rafi Rifki Aldi in full. I build websites and small apps, mostly with PHP and plain JavaScript. My favourite moment is when a shop owner can run the thing on their own, without calling me every day. Off the clock I bake bread, and it doesn't always turn out great.",
    'services.title': 'How I can help',
    'services.lead': 'The three services small businesses ask for most. I do all of it myself, from our first chat until your site is live.',
    'services.cta': 'Free consultation',
    'services.cta.mail': 'Free consultation about my website needs',
    'services.includes': 'What you get',
    'services.ask': 'Ask about this',
    'services.1.title': 'Business website',
    'services.1.text': 'A tidy, fast page so customers can find your business and trust it.',
    'services.1.point.1': 'Looks right on phones and computers',
    'services.1.point.2': 'Linked to Google Maps and WhatsApp',
    'services.1.point.3': 'Product or menu pages you can edit yourself',
    'services.1.time': 'About 1–2 weeks',
    'services.1.mail': 'Question about a business website',
    'services.2.title': 'Catalogue + WhatsApp orders',
    'services.2.text': 'Customers pick products and the order lands in your WhatsApp. No extra app to install.',
    'services.2.point.1': 'A product catalogue with photos and prices',
    'services.2.point.2': 'A cart that adds up the total for you',
    'services.2.point.3': 'Tidy order summaries straight to WhatsApp',
    'services.2.time': 'About 2–3 weeks',
    'services.2.mail': 'Question about an online catalogue with WhatsApp orders',
    'services.3.title': 'Point of sale & stock app',
    'services.3.text': 'Record sales and stock from your phone, with a reminder before anything runs out.',
    'services.3.point.1': 'Record sales from a phone or tablet',
    'services.3.point.2': 'Low-stock reminders on WhatsApp',
    'services.3.point.3': 'Daily and monthly sales reports',
    'services.3.time': 'About 3–5 weeks',
    'services.3.mail': 'Question about a point of sale and stock app',
    'services.promise.1': 'Helped all the way to live, domain and hosting included',
    'services.promise.2': 'You can edit it yourself, with a short guide',
    'services.promise.3': '30-day fix guarantee after launch',
    'pricing.title': 'What does it cost?',
    'pricing.note': 'I put the prices up front, so you can work out the budget before you contact me.',
    'pricing.once': 'one-off',
    'pricing.choose': 'Choose this package',
    'pricing.excl': 'Another domain name costs extra',
    'pricing.1.tag': '1 page',
    'pricing.1.title': 'Landing page',
    'pricing.1.price': 'Rp 150,000',
    'pricing.1.text': 'One page to introduce your business: a short profile, what you offer, and how to reach you.',
    'pricing.1.point.1': 'One page, straight to the point',
    'pricing.1.point.2': 'Free domain & hosting for the first month',
    'pricing.1.point.3': 'A .my.id domain of your choice',
    'pricing.1.mail': 'Interested in the landing page package',
    'pricing.2.tag': 'Up to 5 pages',
    'pricing.2.title': 'Company profile',
    'pricing.2.price': 'Rp 250,000',
    'pricing.2.text': 'A fuller company profile. The content is fixed, so any change goes through me.',
    'pricing.2.point.1': 'Up to 5 pages!',
    'pricing.2.point.2': 'Free domain & hosting for the first month',
    'pricing.2.point.3': 'A .my.id domain of your choice',
    'pricing.2.mail': 'Interested in the company profile package',
    'pricing.3.tag': 'Unlimited pages + admin',
    'pricing.3.title': 'Company profile + blog',
    'pricing.3.price': 'Rp 500,000',
    'pricing.3.text': 'The company profile package plus an admin page, so you can post articles or news yourself.',
    'pricing.3.point.1': 'As many pages as you need!',
    'pricing.3.point.2': 'Free domain & hosting for the first month',
    'pricing.3.point.3': 'A .my.id domain of your choice',
    'pricing.3.mail': 'Interested in the company profile + blog package',
    'pricing.custom.title': 'Custom web app',
    'pricing.custom.price': 'From Rp 5 million',
    'pricing.custom.text': 'Built around the way your business works. The final price depends on the features, so we talk it through first.',
    'pricing.custom.cta': 'Tell me what you need',
    'pricing.custom.mail': 'Question about a custom web app',
    'pricing.care.title': 'Maintenance',
    'pricing.care.price': 'Rp 125,000',
    'pricing.care.unit': 'per month',
    'pricing.care.text': 'A monthly package that keeps the site running: updates, backups and small fixes.',
    'pricing.care.cta': 'Ask about maintenance',
    'pricing.care.mail': 'Question about the monthly maintenance package',
    'pricing.foot': 'Every website package includes a .my.id domain and hosting for the first month. Another domain name, and renewals after that month, are counted separately.',
    'nav.showcase': 'Showcase',
    'showcase.title': 'Show-off project',
    'showcase.hint': 'Grouped into three kinds of work. Pick one to see the projects in it.',
    'showcase.count': 'projects',
    'showcase.open': 'See the list',
    'showcase.1.name': 'Company profile',
    'showcase.1.blurb': 'A profile site: who you are, what you do, and how to reach you.',
    'showcase.2.name': 'Event Organizer',
    'showcase.2.blurb': 'An event page: the rundown, the venue and sign-ups in one place.',
    'showcase.3.name': 'Web app',
    'showcase.3.blurb': 'The systems a business runs on: factory ERPs, schools, clinics, attendance, point of sale and task management.',
    'category.back': 'Back',
    'category.kicker': 'Show-off project',
    'contact.title': "Let's talk",
    'contact.text': 'Have a business that needs a website or a small app? Tell me about it; the first chat is free.',
    'contact.email': 'Send an email',
    'webapp.note': "The systems below run inside their clients' own operations. Their data is confidential, so there are no screenshots and no public demo here — what I can tell you is what each system does.",
    'footer.left': '© 2026 Muhammad Rafi',
    'footer.right': 'Shapes drawn by hand in SVG and CSS.'
  };

  // Labels used only inside the drawer, which JS builds.
  var UI = {
    id: {
      counter: 'Proyek {n} dari {total}',
      year: 'Tahun',
      duration: 'Durasi',
      problem: 'Masalahnya',
      solution: 'Solusinya',
      features: 'Fitur utama',
      result: 'Hasilnya',
      team: 'Tim yang mengerjakan',
      tech: 'Teknologi',
      live: 'Lihat website',
      code: 'Lihat kode',
      prev: 'Proyek sebelumnya',
      next: 'Proyek berikutnya',
      close: 'Tutup detail proyek',
      site: 'Muhammad Rafi',
      more: 'Lihat detail',
      shotAlt: 'Tampilan website {name}',
      shotEmpty: 'Screenshot belum ada',
      shotPrivate: 'Sistem internal',
      shotPrivateNote: 'Tampilan dan datanya milik klien, jadi tidak ditampilkan di sini.',
      total: '{n} proyek di kategori ini',
      empty: 'Belum ada proyek di kategori ini.'
    },
    en: {
      counter: 'Project {n} of {total}',
      year: 'Year',
      duration: 'Duration',
      problem: 'The problem',
      solution: 'What I built',
      features: 'Key features',
      result: 'The result',
      team: 'Who worked on it',
      tech: 'Tech',
      live: 'Visit website',
      code: 'View code',
      prev: 'Previous project',
      next: 'Next project',
      close: 'Close project details',
      site: 'Muhammad Rafi',
      more: 'See details',
      shotAlt: 'Screenshot of the {name} website',
      shotEmpty: 'No screenshot yet',
      shotPrivate: 'Internal system',
      shotPrivateNote: 'The screens and the data belong to the client, so they are not shown here.',
      total: '{n} projects in this category',
      empty: 'No projects in this category yet.'
    }
  };

  // Lucide icon paths (ISC), drawn with createElementNS.
  var ICONS = {
    x: ['M18 6 6 18', 'm6 6 12 12'],
    prev: ['m15 18-6-6 6-6'],
    next: ['m9 18 6-6-6-6'],
    check: ['M20 6 9 17l-5-5'],
    globe: ['M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20', 'M2 12h20', 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0'],
    code: ['m16 18 6-6-6-6', 'm8 6-6 6 6 6'],
    calendar: ['M8 2v3', 'M16 2v3', 'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z', 'M3 9h18'],
    clock: ['M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0', 'M12 6v6l4 2'],
    lock: ['M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z', 'M7 11V7a5 5 0 0 1 10 0v4']
  };

  /* =====================================================================
     Helpers
     ===================================================================== */

  function storageGet(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }

  function storageSet(key, value) {
    try { window.localStorage.setItem(key, value); } catch (e) { /* harmless */ }
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function icon(name) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('class', 'icon');
    svg.setAttribute('aria-hidden', 'true');
    ICONS[name].forEach(function (d) {
      var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', d);
      svg.appendChild(path);
    });
    return svg;
  }

  function each(selector, fn) {
    Array.prototype.forEach.call(document.querySelectorAll(selector), fn);
  }

  /**
   * The projects, per category and in alphabetical order.
   *
   * `summary` is the one-line description shown on the card and at the top of
   * the panel; it says what the client does, taken from their own site.
   * `problem`, `solution`, `features` and `result` are the story of the work
   * itself — they are left empty on purpose, and the panel simply leaves those
   * sections out until they are written. `year`, `duration` and `tags` behave
   * the same way.
   *
   * Shape of one entry:
   *   {
   *     accent: 'coral' | 'butter' | 'teal',
   *     year: '2025', tags: ['PHP'], code: null, live: 'https://…',
   *     image: 'img/<category>/<file>',
   *     id: { name, client, duration, summary, team: [{ name, role }], problem,
   *           solution, features: [], result },
   *     en: { … the same in English … }
   *   }
   */
  var SHOWCASE = [
    {
      slug: 'company-profile', key: 'showcase.1',
      projects: [
        {
          accent: 'coral', year: '', tags: [], code: null,
          live: 'https://anugerahcaroserie.co.id',
          image: 'img/company-profile/anugerahcaroserie.co.id.png',
          id: {
            name: 'Anugerah Caroserie', client: 'Karoseri kendaraan khusus', duration: '',
            summary: 'Karoseri kendaraan khusus: mobil pemadam kebakaran, kendaraan bandara, ambulans, dan kendaraan operasional, baik unit baru maupun rekondisi.',
            team: [
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: '', features: [], result: ''
          },
          en: {
            name: 'Anugerah Caroserie', client: 'Special vehicle bodywork', duration: '',
            summary: 'Custom vehicle bodywork: fire trucks, airport crash tenders, ambulances and utility vehicles, both new units and reconditioning.',
            team: [
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: '', features: [], result: ''
          }
        },
        {
          accent: 'butter', year: '', tags: [], code: null,
          live: 'https://dandelion.id',
          image: 'img/company-profile/dandelion.id.png',
          id: {
            name: 'Dandelion', client: 'Salon kecantikan', duration: '',
            summary: 'Salon perawatan waxing, nail, dan eyelash extension yang berdiri sejak 2014, dengan cabang di Jakarta dan Surabaya.',
            team: [
              { name: 'Dandelion Team', role: 'UI/UX Designer' },
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: '', features: [], result: ''
          },
          en: {
            name: 'Dandelion', client: 'Beauty salon', duration: '',
            summary: 'A waxing, nail and lash extension salon founded in 2014, with branches in Jakarta and Surabaya.',
            team: [
              { name: 'Dandelion Team', role: 'UI/UX Designer' },
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: '', features: [], result: ''
          }
        },
        {
          accent: 'teal', year: '', tags: [], code: null,
          live: 'https://genco.id',
          image: 'img/company-profile/genco.id.png',
          id: {
            name: 'Genco Energi Nusantara', client: 'Distribusi bahan bakar industri', duration: '',
            summary: 'Perusahaan pemasaran dan distribusi bahan bakar industri yang berdiri sejak 2020, melayani kebutuhan usaha sampai ke daerah terpencil.',
            team: [
              { name: 'Suka Studio Team', role: 'UI/UX Designer' },
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: '', features: [], result: ''
          },
          en: {
            name: 'Genco Energi Nusantara', client: 'Industrial fuel distribution', duration: '',
            summary: 'A marketing and distribution company for industrial fuels, founded in 2020, supplying businesses across Indonesia including remote areas.',
            team: [
              { name: 'Suka Studio Team', role: 'UI/UX Designer' },
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: '', features: [], result: ''
          }
        },
        {
          accent: 'coral', year: '', tags: [], code: null, live: null,
          image: 'img/company-profile/gereja%20immanuel%20jakarta.jpg',
          id: {
            name: 'GPIB Immanuel Jakarta', client: 'Gereja', duration: '',
            summary: 'Profil dan sejarah gereja GPIB Immanuel Jakarta beserta bagian wisatanya, dalam dua bahasa. Websitenya sudah tidak aktif.',
            team: [
              { name: 'Suka Studio Team', role: 'UI/UX Designer' },
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: '', features: [], result: ''
          },
          en: {
            name: 'GPIB Immanuel Jakarta', client: 'Church', duration: '',
            summary: 'The profile and history of the GPIB Immanuel Jakarta church with a tourism section, in two languages. The site is no longer online.',
            team: [
              { name: 'Suka Studio Team', role: 'UI/UX Designer' },
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: '', features: [], result: ''
          }
        },
        {
          accent: 'butter', year: '', tags: [], code: null,
          live: 'https://herell.id',
          image: 'img/company-profile/herell-id.png',
          id: {
            name: 'Herell', client: 'Brand fashion', duration: '',
            summary: 'Brand fashion lokal dengan toko online sendiri: kaos, jogger, dan atasan kasual, lengkap dengan info pengiriman dan pengembalian.',
            team: [
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: '', features: [], result: ''
          },
          en: {
            name: 'Herell', client: 'Fashion brand', duration: '',
            summary: 'An Indonesian fashion brand with its own online shop: shirts, joggers and casual tops, with shipping and return details.',
            team: [
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: '', features: [], result: ''
          }
        },
        {
          accent: 'teal', year: '', tags: [], code: null,
          live: 'https://highscope.or.id',
          image: 'img/company-profile/highscope.or.id.png',
          id: {
            name: 'HighScope Indonesia', client: 'Jaringan sekolah', duration: '',
            summary: 'Jaringan sekolah internasional di berbagai kota di Indonesia, dari jenjang usia dini sampai SMA.',
            team: [
              { name: 'Vasco Journal Team', role: 'UI/UX Designer' },
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: '', features: [], result: ''
          },
          en: {
            name: 'HighScope Indonesia', client: 'School network', duration: '',
            summary: 'A network of international schools across Indonesia, from early childhood through high school.',
            team: [
              { name: 'Vasco Journal Team', role: 'UI/UX Designer' },
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: '', features: [], result: ''
          }
        },
        {
          accent: 'coral', year: '', tags: [], code: null,
          live: 'https://ichiyuumi.id',
          image: 'img/company-profile/ichiyuumi.id.png',
          id: {
            name: 'Ichi Yuumi', client: 'Produsen makanan beku', duration: '',
            summary: 'Produsen egg chicken roll beku berbahan telur dan daging paha ayam, dikemas sebagai lauk siap masak untuk keluarga.',
            team: [
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: '', features: [], result: ''
          },
          en: {
            name: 'Ichi Yuumi', client: 'Frozen food maker', duration: '',
            summary: 'A food maker producing frozen egg chicken rolls from eggs and chicken thigh meat, sold as a ready-to-cook family dish.',
            team: [
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: '', features: [], result: ''
          }
        },
        {
          accent: 'butter', year: '', tags: [], code: null,
          live: 'https://ikyk-shop.com',
          image: 'img/company-profile/ikyk-shop.com.png',
          id: {
            name: 'IKYK', client: 'Brand fashion wanita', duration: '',
            summary: 'Toko online label fashion wanita: outerwear, bawahan, dress, atasan, rok, dan set, ditata per koleksi musiman.',
            team: [
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: '', features: [], result: ''
          },
          en: {
            name: 'IKYK', client: 'Womenswear label', duration: '',
            summary: 'The online shop of a womenswear label: outerwear, bottoms, dresses, tops, skirts and sets, arranged by seasonal collection.',
            team: [
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: '', features: [], result: ''
          }
        },
        {
          accent: 'teal', year: '', tags: [], code: null,
          live: 'https://kailimang-ponto.com',
          image: 'img/company-profile/kailimang-ponto.com.png',
          id: {
            name: 'Kailimang + Ponto', client: 'Firma hukum', duration: '',
            summary: 'Firma hukum yang menangani litigasi dan penyelesaian sengketa, ditambah pendampingan korporat serta urusan lintas negara.',
            team: [
              { name: 'Suka Studio Team', role: 'UI/UX Designer' },
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: '', features: [], result: ''
          },
          en: {
            name: 'Kailimang + Ponto', client: 'Law firm', duration: '',
            summary: 'A law firm handling litigation and dispute resolution, plus corporate advisory and cross-border matters.',
            team: [
              { name: 'Suka Studio Team', role: 'UI/UX Designer' },
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: '', features: [], result: ''
          }
        },
        {
          accent: 'coral', year: '', tags: [], code: null,
          live: 'https://augustesoesastro.com',
          image: 'img/company-profile/augustesoesastro.com.png',
          id: {
            name: 'KRATON by Auguste Soesastro', client: 'Rumah mode', duration: '',
            summary: 'Rumah mode yang berdiri sejak 2008 dan menjual busana, alas kaki, aksesori, barang vintage, serta karya seni.',
            team: [
              { name: 'Otro Design', role: 'UI/UX Designer' },
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: '', features: [], result: ''
          },
          en: {
            name: 'KRATON by Auguste Soesastro', client: 'Fashion house', duration: '',
            summary: 'A fashion house established in 2008, selling clothing, footwear, accessories, vintage pieces and artwork.',
            team: [
              { name: 'Otro Design', role: 'UI/UX Designer' },
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: '', features: [], result: ''
          }
        },
        {
          accent: 'butter', year: '', tags: [], code: null,
          live: 'https://redea-institute.or.id',
          image: 'img/company-profile/httpsredea-institute.or.id.png',
          id: {
            name: 'Redea Institute', client: 'Lembaga pendidikan', duration: '',
            summary: 'Lembaga riset dan pengembangan pendidikan: menyusun kurikulum, melatih guru, memantau mutu, dan menaungi jaringan sekolah.',
            team: [
              { name: 'Vasco Journal Team', role: 'UI/UX Designer' },
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: '', features: [], result: ''
          },
          en: {
            name: 'Redea Institute', client: 'Education institute', duration: '',
            summary: 'An education think tank: curriculum development, teacher training, quality monitoring and a network of schools.',
            team: [
              { name: 'Vasco Journal Team', role: 'UI/UX Designer' },
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: '', features: [], result: ''
          }
        },
        {
          accent: 'teal', year: '', tags: [], code: null,
          live: 'https://sukastudio.id',
          image: 'img/company-profile/sukastudio.id.png',
          id: {
            name: 'Suka Studio', client: 'Studio desain & animasi', duration: '',
            summary: 'Studio desain dan animasi yang menuangkan cerita sebuah merek lewat karya yang berani, lengkap dengan halaman karya, karier, dan lini produk DOSE-nya.',
            team: [
              { name: 'Suka Studio Team', role: 'UI/UX Designer' },
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: '', features: [], result: ''
          },
          en: {
            name: 'Suka Studio', client: 'Design & animation studio', duration: '',
            summary: 'A design and animation studio that tells each brand\'s story through bold work, with sections for its portfolio, careers and its own DOSE product line.',
            team: [
              { name: 'Suka Studio Team', role: 'UI/UX Designer' },
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: '', features: [], result: ''
          }
        }
      ]
    },
    {
      slug: 'event-organizer', key: 'showcase.2',
      projects: [
        {
          accent: 'coral', year: '', tags: [], code: null,
          live: 'https://inagrimat.com',
          image: 'img/event-organizer/inagrimat.com.png',
          id: {
            name: 'AGRIMAT', client: 'Pameran mesin pertanian', duration: '',
            summary: 'Pameran mesin, aksesori, dan alat pertanian di Grand City Convex Surabaya, berbarengan dengan pameran peternakan.',
            team: [
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: '', features: [], result: ''
          },
          en: {
            name: 'AGRIMAT', client: 'Agricultural machinery expo', duration: '',
            summary: 'An expo for agricultural machinery, accessories and tools at Grand City Convex Surabaya, held alongside a livestock event.',
            team: [
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: '', features: [], result: ''
          }
        },
        {
          accent: 'butter', year: '', tags: [], code: null,
          live: 'https://buildinteriorfurnish.com',
          image: 'img/event-organizer/buildinteriorfurnish.com.png',
          id: {
            name: 'Building, Interiors & Furnish Expo', client: 'Pameran material bangunan', duration: '',
            summary: 'Pameran lantai, pintu, jendela, solusi kaca, dekorasi, dan material bangunan di NICE PIK2.',
            team: [
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: '', features: [], result: ''
          },
          en: {
            name: 'Building, Interiors & Furnish Expo', client: 'Building materials expo', duration: '',
            summary: 'An expo for flooring, doors, windows, glass solutions, décor and construction materials at NICE PIK2.',
            team: [
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: '', features: [], result: ''
          }
        },
        {
          accent: 'teal', year: '', tags: [], code: null,
          live: 'https://cleanroom-expo.com',
          image: 'img/event-organizer/cleanroom-expo.com.png',
          id: {
            name: 'Cleanroom Indonesia Expo', client: 'Pameran teknologi cleanroom', duration: '',
            summary: 'Pameran teknologi cleanroom dan pengendalian kontaminasi untuk industri semikonduktor, farmasi, bioteknologi, alat kesehatan, dan pengolahan pangan.',
            team: [
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: '', features: [], result: ''
          },
          en: {
            name: 'Cleanroom Indonesia Expo', client: 'Cleanroom technology expo', duration: '',
            summary: 'An expo for cleanroom technology and contamination control across semiconductors, pharmaceuticals, biotech, medical devices and food processing.',
            team: [
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: '', features: [], result: ''
          }
        },
        {
          accent: 'coral', year: '', tags: [], code: null,
          live: 'https://foodbeverageindonesia.com',
          image: 'img/event-organizer/foodbeverageindonesia.com.png',
          id: {
            name: 'Food + Beverage Indonesia', client: 'Pameran makanan & minuman', duration: '',
            summary: 'Pameran industri makanan dan minuman di Jakarta yang diselenggarakan PT Wahana Kemalaniaga Makmur.',
            team: [
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: '', features: [], result: ''
          },
          en: {
            name: 'Food + Beverage Indonesia', client: 'Food and beverage expo', duration: '',
            summary: 'A food and beverage industry exhibition in Jakarta, organised by PT Wahana Kemalaniaga Makmur.',
            team: [
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: '', features: [], result: ''
          }
        },
        {
          accent: 'butter', year: '', tags: [], code: null,
          live: 'https://globalprintpackexpo.com',
          image: 'img/event-organizer/globalprintpackexpo.com.png',
          id: {
            name: 'Global Printing & Packaging Expo', client: 'Pameran cetak & kemasan', duration: '',
            summary: 'Pameran mesin dan teknologi percetakan serta kemasan, digelar di dua kota: Surabaya dan Jakarta.',
            team: [
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: '', features: [], result: ''
          },
          en: {
            name: 'Global Printing & Packaging Expo', client: 'Printing and packaging expo', duration: '',
            summary: 'An expo for printing and packaging machinery and technology, held in two cities: Surabaya and Jakarta.',
            team: [
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: '', features: [], result: ''
          }
        },
        {
          accent: 'teal', year: '', tags: [], code: null,
          live: 'https://iffinaindonesia.com',
          image: 'img/event-organizer/iffinaindonesia.com.png',
          id: {
            name: 'IFFINA+', client: 'Pameran furnitur & desain', duration: '',
            summary: 'Pameran furnitur, desain, dan kriya bersama sektor pendukungnya — material, komponen, hardware, dan mesin kayu — di NICE PIK 2 Jakarta.',
            team: [
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: '', features: [], result: ''
          },
          en: {
            name: 'IFFINA+', client: 'Furniture and design expo', duration: '',
            summary: 'A furniture, design and craft expo with its supporting sectors — materials, components, hardware and woodworking machinery — at NICE PIK 2 Jakarta.',
            team: [
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: '', features: [], result: ''
          }
        },
        {
          accent: 'coral', year: '', tags: [], code: null,
          live: 'https://ifmac.net',
          image: 'img/event-organizer/ifmac.net.png',
          id: {
            name: 'IFMAC WOODMAC', client: 'Pameran mesin furnitur', duration: '',
            summary: 'Pameran mesin kayu dan teknologi produksi furnitur di JIExpo Kemayoran, Jakarta.',
            team: [
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: '', features: [], result: ''
          },
          en: {
            name: 'IFMAC WOODMAC', client: 'Furniture machinery expo', duration: '',
            summary: 'An expo for woodworking machinery and furniture production technology at JIExpo Kemayoran, Jakarta.',
            team: [
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: '', features: [], result: ''
          }
        },
        {
          accent: 'butter', year: '', tags: [], code: null,
          live: 'https://iism-expo.com',
          image: 'img/event-organizer/iism-expo.com.png',
          id: {
            name: 'IISM & Indonesia Cold Chain Expo', client: 'Pameran rantai pasok', duration: '',
            summary: 'Pameran rantai pasok terpadu: cold chain, refrigerasi, pergudangan, logistik, dan otomasi, di NICE Jakarta.',
            team: [
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: '', features: [], result: ''
          },
          en: {
            name: 'IISM & Indonesia Cold Chain Expo', client: 'Supply chain expo', duration: '',
            summary: 'An integrated supply chain expo: cold chain, refrigeration, warehousing, logistics and automation, at NICE Jakarta.',
            team: [
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: '', features: [], result: ''
          }
        },
        {
          accent: 'teal', year: '', tags: [], code: null,
          live: 'https://immf-connect.com',
          image: 'img/event-organizer/immf-connect.com.png',
          id: {
            name: 'IMMF Connect', client: 'Gabungan empat pameran', duration: '',
            summary: 'Payung bersama empat pameran industri — material, manufaktur, mesin, hardware, dan furnitur — yang digelar serentak di NICE PIK 2 dan JIExpo Kemayoran.',
            team: [
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: '', features: [], result: ''
          },
          en: {
            name: 'IMMF Connect', client: 'Four expos in one', duration: '',
            summary: 'The umbrella for four industrial expos — materials, manufacturing, machinery, hardware and furniture — running together at NICE PIK 2 and JIExpo Kemayoran.',
            team: [
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: '', features: [], result: ''
          }
        },
        {
          accent: 'coral', year: '', tags: [], code: null,
          live: 'https://refrigeration-hvacindonesia.com',
          image: 'img/event-organizer/httprefrigeration-hvacindonesia.com.png',
          id: {
            name: 'RHVAC Indonesia', client: 'Pameran refrigerasi & HVAC', duration: '',
            summary: 'Pameran refrigerasi, HVAC, cleanroom, dan cold chain di NICE PIK 2.',
            team: [
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: '', features: [], result: ''
          },
          en: {
            name: 'RHVAC Indonesia', client: 'Refrigeration and HVAC expo', duration: '',
            summary: 'An expo for refrigeration, HVAC, cleanroom and cold chain at NICE PIK 2.',
            team: [
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: '', features: [], result: ''
          }
        },
        {
          accent: 'butter', year: '', tags: [], code: null,
          live: 'https://safeworkindonesia.com',
          image: 'img/event-organizer/safeworkindonesia.com.png',
          id: {
            name: 'Safe Work Indonesia', client: 'Pameran keselamatan kerja', duration: '',
            summary: 'Pameran keselamatan dan kesehatan kerja (K3) di NICE PIK 2, mempertemukan praktisi K3 dengan penyedia produk dan teknologinya.',
            team: [
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: '', features: [], result: ''
          },
          en: {
            name: 'Safe Work Indonesia', client: 'Workplace safety expo', duration: '',
            summary: 'An occupational safety and health expo at NICE PIK 2, bringing OSH practitioners together with product and technology suppliers.',
            team: [
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: '', features: [], result: ''
          }
        }
      ]
    },
    {
      // These nine run inside their clients' own operations, so there is no
      // screenshot and no public demo for any of them: `confidential: true`
      // puts a written panel in the drawer where the screenshot would be.
      // They are listed in the order the user gave, not alphabetically.
      slug: 'web-app', key: 'showcase.3',
      projects: [
        {
          accent: 'coral', year: '', tags: [], code: null, live: null,
          // No screenshot on purpose: the data inside belongs to the client.
          image: '', confidential: true,
          id: {
            name: 'ERP Pabrik Keramik', client: 'Pabrik keramik', duration: '',
            summary: 'Sistem ERP pabrik keramik yang berfokus pada pencatatan penjualan dan pergerakan stok, dari barang masuk sampai keluar gudang.',
            team: [
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: 'Penjualan dan seluruh mutasi stok dicatat di satu tempat, sehingga posisi barang dan angka penjualan dibaca dari data yang sama.',
            features: [
              'Pencatatan penjualan pabrik',
              'Mutasi stok masuk dan keluar gudang',
              'Riwayat pergerakan untuk setiap barang',
              'Posisi stok terkini per barang'
            ],
            result: ''
          },
          en: {
            name: 'Ceramics Factory ERP', client: 'Ceramics factory', duration: '',
            summary: 'A factory ERP built around two things: recording sales, and recording every stock movement from goods in to goods out.',
            team: [
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: 'Sales and every stock movement are recorded in one place, so stock positions and sales figures are read from the same data.',
            features: [
              'Factory sales records',
              'Stock movements in and out of the warehouse',
              'A movement history for every item',
              'Current stock position per item'
            ],
            result: ''
          }
        },
        {
          accent: 'butter', year: '', tags: [], code: null, live: null,
          // No screenshot on purpose: the data inside belongs to the client.
          image: '', confidential: true,
          id: {
            name: 'ERP Pabrik Benang', client: 'Pabrik benang', duration: '',
            summary: 'Sistem ERP pabrik benang dengan alur yang lebih kompleks, tetap berpusat pada pencatatan penjualan dan pergerakan stok.',
            team: [
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: 'Dibangun di atas pola yang sama seperti ERP keramik, dengan alur stok yang lebih bercabang mengikuti proses pabriknya.',
            features: [
              'Pencatatan penjualan pabrik',
              'Mutasi stok dengan alur yang lebih bercabang',
              'Riwayat pergerakan untuk setiap barang',
              'Posisi stok terkini per barang'
            ],
            result: ''
          },
          en: {
            name: 'Yarn Mill ERP', client: 'Yarn mill', duration: '',
            summary: 'A yarn mill ERP with a more involved flow, still centred on recording sales and stock movements.',
            team: [
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: 'Built on the same pattern as the ceramics ERP, with a stock flow that branches further to match the mill’s process.',
            features: [
              'Mill sales records',
              'Stock movements along a more branching flow',
              'A movement history for every item',
              'Current stock position per item'
            ],
            result: ''
          }
        },
        {
          accent: 'teal', year: '', tags: [], code: null, live: null,
          // No screenshot on purpose: the data inside belongs to the client.
          image: '', confidential: true,
          id: {
            name: 'Manajemen Sekolah Makassar', client: 'Sekolah SD, SMP, dan SMA di Makassar', duration: '',
            summary: 'Sistem manajemen sekolah untuk jenjang SD, SMP, dan SMA: nilai siswa dicatat satu kali, lalu langsung menjadi raport sesuai template sekolahnya.',
            team: [
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: 'Dibuat custom untuk sekolah-sekolah tersebut, sehingga satu sistem melayani beberapa jenjang dengan format raport yang berbeda-beda.',
            features: [
              'Pencatatan nilai siswa untuk SD, SMP, dan SMA',
              'Raport digenerate langsung dari nilai yang sudah masuk',
              'Template raport mengikuti format masing-masing sekolah',
              'Satu sistem dipakai lintas jenjang'
            ],
            result: ''
          },
          en: {
            name: 'School Management, Makassar', client: 'Primary and secondary schools in Makassar', duration: '',
            summary: 'A school management system for primary and secondary levels: marks are entered once, then become a report card in each school’s own template.',
            team: [
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: 'Built to order for these schools, so one system serves several levels while each keeps its own report-card format.',
            features: [
              'Student marks for primary, junior and senior levels',
              'Report cards generated straight from the marks already entered',
              'Report-card templates follow each school’s own format',
              'One system across the levels'
            ],
            result: ''
          }
        },
        {
          accent: 'coral', year: '', tags: [], code: null, live: null,
          // No screenshot on purpose: the data inside belongs to the client.
          image: '', confidential: true,
          id: {
            name: 'ERP Pertanian Desa', client: 'Pertanian desa', duration: '',
            summary: 'Sistem ERP yang lebih sederhana, dipakai di desa untuk mencatat kebutuhan barang-barang panen para petani.',
            team: [
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: 'Dibuat sesederhana mungkin: cukup mencatat kebutuhan tiap petani untuk satu masa panen, tanpa langkah yang tidak dipakai di lapangan.',
            features: [
              'Pencatatan kebutuhan barang per petani',
              'Daftar kebutuhan untuk satu masa panen',
              'Alur yang sengaja dibuat singkat supaya mudah dipakai'
            ],
            result: ''
          },
          en: {
            name: 'Village Farming ERP', client: 'Village farming', duration: '',
            summary: 'A simpler ERP, used in a village to record the goods farmers need for the harvest.',
            team: [
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: 'Kept as plain as it could be: it records what each farmer needs for a harvest, with no steps that would go unused in the field.',
            features: [
              'What each farmer needs, recorded per person',
              'The list of needs for one harvest',
              'A deliberately short flow, so it is easy to use'
            ],
            result: ''
          }
        },
        {
          accent: 'butter', year: '', tags: [], code: null, live: null,
          // No screenshot on purpose: the data inside belongs to the client.
          image: '', confidential: true,
          id: {
            name: 'Absensi Perusahaan', client: 'Perusahaan', duration: '',
            summary: 'Absensi karyawan yang bisa dilakukan dari mana saja, sejauh masih di dalam radius yang ditentukan, lengkap dengan uang makan dan surat izin.',
            team: [
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: 'Absen, uang makan, dan izin tidak masuk berada dalam satu catatan, dan lokasi absen dibatasi radius yang sudah ditetapkan perusahaan.',
            features: [
              'Absen dari mana saja di dalam radius yang ditentukan',
              'Pencatatan uang makan mengikuti kehadiran',
              'Pengajuan surat izin tidak masuk',
              'Riwayat kehadiran tiap karyawan'
            ],
            result: ''
          },
          en: {
            name: 'Company Attendance', client: 'Company', duration: '',
            summary: 'Staff attendance that can be filed from anywhere, as long as it is inside a set radius, together with meal allowance and leave requests.',
            team: [
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: 'Attendance, meal allowance and leave notes sit in one record, and where someone may clock in is limited to the radius the company sets.',
            features: [
              'Clock in from anywhere inside the set radius',
              'Meal allowance recorded from attendance',
              'Leave requests filed in the same place',
              'An attendance history per employee'
            ],
            result: ''
          }
        },
        {
          accent: 'teal', year: '', tags: [], code: null, live: null,
          // No screenshot on purpose: the data inside belongs to the client.
          image: '', confidential: true,
          id: {
            name: 'Sistem POS', client: 'UMKM dan retail', duration: '',
            summary: 'Aplikasi kasir untuk mencatat penjualan beserta laporannya, dibuat pas untuk skala UMKM.',
            team: [
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: 'Pencatatan di kasir dan laporan penjualannya berada dalam satu aplikasi, sehingga pemilik usaha tidak perlu merekap ulang.',
            features: [
              'Pencatatan penjualan di kasir',
              'Laporan penjualan',
              'Ringan dan sederhana, cocok untuk UMKM'
            ],
            result: ''
          },
          en: {
            name: 'Point of Sale', client: 'Small businesses and retail', duration: '',
            summary: 'A till application that records sales and reports on them, sized for a small business.',
            team: [
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: 'The till and its sales reports live in one application, so the owner has nothing to re-enter afterwards.',
            features: [
              'Sales recorded at the till',
              'Sales reports',
              'Light and simple, sized for a small business'
            ],
            result: ''
          }
        },
        {
          accent: 'coral', year: '', tags: [], code: null, live: null,
          // No screenshot on purpose: the data inside belongs to the client.
          image: '', confidential: true,
          id: {
            name: 'Sistem Klinik', client: 'Klinik', duration: '',
            summary: 'Pencatatan medical record pasien yang bisa diakses oleh dokter dan tenaga kesehatan yang menangani.',
            team: [
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: 'Riwayat medis tiap pasien tersimpan dalam satu catatan yang dibuka oleh dokter dan tenaga kesehatan yang berwenang.',
            features: [
              'Medical record pasien dalam satu riwayat',
              'Diakses oleh dokter dan tenaga kesehatan',
              'Catatan menyusul tiap kunjungan pasien'
            ],
            result: ''
          },
          en: {
            name: 'Clinic System', client: 'Clinic', duration: '',
            summary: 'Patient medical records, open to the doctors and health workers treating them.',
            team: [
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: 'Each patient’s history is kept as one record, opened by the doctors and health workers who are authorised to see it.',
            features: [
              'A patient’s medical record as one history',
              'Opened by doctors and health workers',
              'The record follows each visit'
            ],
            result: ''
          }
        },
        {
          accent: 'butter', year: '', tags: [], code: null, live: null,
          // No screenshot on purpose: the data inside belongs to the client.
          image: '', confidential: true,
          id: {
            name: 'Task Management', client: 'Tim pengembang perangkat lunak', duration: '',
            summary: 'Pencatatan project per klien beserta lama pengerjaannya, dengan laporan task harian yang siap diekspor.',
            team: [
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: 'Dibuat untuk cara kerja programmer: tiap project dipisah per klien, waktu pengerjaannya tercatat, dan laporan hariannya tinggal diekspor.',
            features: [
              'Project dipisah per klien',
              'Lama pengerjaan tiap task tercatat',
              'Laporan task harian',
              'Laporan siap diekspor'
            ],
            result: ''
          },
          en: {
            name: 'Task Management', client: 'Software team', duration: '',
            summary: 'Projects recorded per client with the time each one takes, and a daily task report that is ready to export.',
            team: [
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: 'Built around how programmers actually work: projects are kept per client, time on each task is recorded, and the daily report is one export away.',
            features: [
              'Projects kept per client',
              'Time recorded against each task',
              'A daily task report',
              'Reports ready to export'
            ],
            result: ''
          }
        },
        {
          accent: 'teal', year: '', tags: [], code: null, live: null,
          // No screenshot on purpose: the data inside belongs to the client.
          image: '', confidential: true,
          id: {
            name: 'Sistem Provider Internet', client: 'Penyedia layanan internet', duration: '',
            summary: 'Aplikasi sekaligus sistem: pengguna mencari harga provider internet termurah di area terdekat, dan komplain yang masuk diteruskan ke provider yang menanganinya.',
            team: [
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: 'Sisi penggunanya mencari dan membandingkan harga per area, sisi providernya menerima komplain yang sudah diarahkan ke pihak yang tepat.',
            features: [
              'Pencarian harga provider di area terdekat',
              'Perbandingan harga antar provider',
              'Kanal komplain dari pengguna',
              'Komplain diteruskan ke provider yang menangani'
            ],
            result: ''
          },
          en: {
            name: 'Internet Provider System', client: 'Internet service provider', duration: '',
            summary: 'An app and a system in one: people look up the cheapest internet provider in their area, and the complaints they file reach the provider that handles them.',
            team: [
              { name: 'M. Rafi Rifki Aldi', role: 'Frontend Web Developer' },
              { name: 'Fandi Febrianto', role: 'Backend Web Developer' },
              { name: 'Mustaqim Afif', role: 'QC/QA/Pentester' },
              { name: 'Yupi Sugianto', role: 'Technical Director' }
            ],
            problem: '', solution: 'The public side searches and compares prices per area; the provider side receives complaints already routed to the right party.',
            features: [
              'Provider prices for the nearest area',
              'Prices compared across providers',
              'A complaint channel for users',
              'Complaints routed to the provider that handles them'
            ],
            result: ''
          }
        }
      ]
    }
  ];

  /* =====================================================================
     Language
     ===================================================================== */

  var lang = 'id';
  var ID = {}; // filled from the HTML itself, so Indonesian is never duplicated
  var metaDesc = document.querySelector('meta[name="description"]');

  function captureIndonesian() {
    each('[data-i18n]', function (node) { ID[node.getAttribute('data-i18n')] = node.textContent; });
    each('[data-i18n-aria]', function (node) { ID[node.getAttribute('data-i18n-aria')] = node.getAttribute('aria-label'); });
    each('[data-i18n-mail]', function (node) { ID[node.getAttribute('data-i18n-mail')] = node.getAttribute('data-mail-text'); });
    ID['meta.title'] = document.title;
    ID['meta.desc'] = metaDesc ? metaDesc.getAttribute('content') : '';
  }

  function t(key) {
    if (lang === 'en' && EN.hasOwnProperty(key)) return EN[key];
    return ID.hasOwnProperty(key) ? ID[key] : '';
  }

  function ui(key) {
    return UI[lang][key];
  }

  function applyLanguage() {
    root.setAttribute('lang', lang);
    each('[data-i18n]', function (node) { node.textContent = t(node.getAttribute('data-i18n')); });
    each('[data-i18n-aria]', function (node) { node.setAttribute('aria-label', t(node.getAttribute('data-i18n-aria'))); });
    each('[data-i18n-mail]', function (node) {
      node.setAttribute('href', MAIL_BASE + encodeURIComponent(t(node.getAttribute('data-i18n-mail'))));
    });
    if (activeCategory) {
      // A category page names itself; the shared meta.* keys describe the
      // landing page, so they would be wrong here.
      document.title = categoryText(activeCategory, 'name') + ' — ' + ui('site');
      if (metaDesc) metaDesc.setAttribute('content', categoryText(activeCategory, 'blurb'));
    } else {
      document.title = t('meta.title');
      if (metaDesc) metaDesc.setAttribute('content', t('meta.desc'));
    }
    each('[data-lang]', function (button) {
      button.setAttribute('aria-pressed', String(button.getAttribute('data-lang') === lang));
    });
    if (drawer && drawer.open) renderDrawer();
    if (activeCategory) renderCategoryPage(); // its total and cards are built by JS
  }

  function setLanguage(next) {
    lang = next === 'en' ? 'en' : 'id';
    storageSet(LANG_KEY, lang);
    applyLanguage();
  }

  /* =====================================================================
     Project drawer

     Its markup is built here instead of sitting in every page: it is the
     same everywhere and does nothing without JS, so no HTML file carries a
     copy of it.
     ===================================================================== */

  var drawer = null;
  var d = null;              // the drawer's parts, filled by buildDrawer()
  var activeList = [];       // the projects it is paging through
  var activeScope = null;    // where their cards live, for focus on close
  var current = -1;
  var trigger = null;
  var closing = false;

  function buildDrawer() {
    drawer = el('dialog', 'drawer');
    drawer.id = 'projectDrawer';
    drawer.setAttribute('aria-labelledby', 'drawerTitle');

    var panel = el('div', 'drawer-panel');

    var close = el('button', 'drawer-close');
    close.type = 'button';
    close.setAttribute('data-drawer-close', '');
    close.setAttribute('autofocus', '');
    close.appendChild(icon('x'));
    panel.appendChild(close);

    var scroll = el('div', 'drawer-scroll');

    // The hero is the screenshot of the real site, with the title under it.
    var hero = el('div', 'drawer-hero');
    hero.setAttribute('data-drawer-hero', '');
    hero.setAttribute('data-accent', 'coral');

    var shot = el('figure', 'drawer-shot');
    shot.setAttribute('data-drawer-shot', '');
    var shotImg = el('img');
    shotImg.setAttribute('data-drawer-shot-img', '');
    shotImg.alt = '';
    shotImg.loading = 'lazy';
    shotImg.decoding = 'async';
    shotImg.hidden = true;
    var shotEmpty = el('figcaption', 'drawer-shot-empty');
    shotEmpty.setAttribute('data-drawer-shot-empty', '');
    shotEmpty.hidden = true;
    shot.appendChild(shotImg);
    shot.appendChild(shotEmpty);
    hero.appendChild(shot);

    var heroText = el('div', 'drawer-hero-text');
    var counter = el('p', 'drawer-counter');
    counter.setAttribute('data-drawer-counter', '');
    var title = el('h2');
    title.id = 'drawerTitle';
    title.setAttribute('data-drawer-title', '');
    var client = el('p', 'drawer-client');
    client.setAttribute('data-drawer-client', '');
    heroText.appendChild(counter);
    heroText.appendChild(title);
    heroText.appendChild(client);
    hero.appendChild(heroText);

    var body = el('div', 'drawer-body');
    body.setAttribute('data-drawer-body', '');
    scroll.setAttribute('data-drawer-scroll', '');
    scroll.appendChild(hero);
    scroll.appendChild(body);
    panel.appendChild(scroll);

    var nav = el('div', 'drawer-nav');
    var prev = el('button');
    prev.type = 'button';
    prev.setAttribute('data-drawer-prev', '');
    prev.appendChild(icon('prev'));
    var prevLabel = el('span');
    prev.appendChild(prevLabel);
    var next = el('button');
    next.type = 'button';
    next.setAttribute('data-drawer-next', '');
    var nextLabel = el('span');
    next.appendChild(nextLabel);
    next.appendChild(icon('next'));
    nav.appendChild(prev);
    nav.appendChild(next);
    panel.appendChild(nav);

    drawer.appendChild(panel);
    document.body.appendChild(drawer);

    d = {
      hero: hero, counter: counter, title: title, client: client,
      body: body, scroller: scroll, close: close,
      shot: shot, shotImg: shotImg, shotEmpty: shotEmpty,
      prev: prev, next: next, prevLabel: prevLabel, nextLabel: nextLabel
    };
  }

  /** Someone else's site opens in its own tab, so this page stays put. */
  function openInNewTab(link) {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }

  function section(title, content) {
    var wrap = el('section', 'drawer-section');
    wrap.appendChild(el('h3', 'drawer-heading', title));
    wrap.appendChild(content);
    return wrap;
  }

  /**
   * The hero is a screenshot of the real site; a written panel when the
   * project is one the client runs internally; and the waiting slot when a
   * screenshot simply has not been taken yet. The three cases look different
   * on purpose: "we cannot show this" is a fact about the work, while "no
   * screenshot yet" is a gap in this page.
   */
  function renderShot(project, name) {
    d.shot.classList.remove('is-private');
    if (project.image) {
      d.shotImg.alt = ui('shotAlt').replace('{name}', name);
      d.shotImg.setAttribute('src', project.image);
      d.shotImg.hidden = false;
      d.shotEmpty.hidden = true;
      return;
    }
    if (project.confidential) {
      showPrivateShot();
      return;
    }
    showEmptyShot();
  }

  function showEmptyShot() {
    d.shotImg.hidden = true;
    d.shotImg.removeAttribute('src');
    d.shotEmpty.textContent = ui('shotEmpty');
    d.shotEmpty.hidden = false;
  }

  function showPrivateShot() {
    d.shotImg.hidden = true;
    d.shotImg.removeAttribute('src');
    d.shotEmpty.textContent = '';
    d.shotEmpty.appendChild(icon('lock'));
    d.shotEmpty.appendChild(el('strong', 'shot-private-title', ui('shotPrivate')));
    d.shotEmpty.appendChild(el('span', 'shot-private-note', ui('shotPrivateNote')));
    d.shotEmpty.hidden = false;
    d.shot.classList.add('is-private');
  }

  function renderDrawer() {
    var project = activeList[current];
    var copy = project[lang];

    d.hero.setAttribute('data-accent', project.accent);
    renderShot(project, copy.name);
    d.counter.textContent = ui('counter').replace('{n}', current + 1).replace('{total}', activeList.length);
    d.title.textContent = copy.name;
    d.client.textContent = copy.client;
    d.close.setAttribute('aria-label', ui('close'));
    d.close.title = ui('close');
    d.prevLabel.textContent = ui('prev');
    d.nextLabel.textContent = ui('next');

    var body = d.body;
    body.textContent = '';

    // What the client does, in one line. Everything below it is the story of
    // the work, which is written per project and left out while it is empty.
    if (copy.summary) body.appendChild(el('p', 'drawer-lead', copy.summary));

    var facts = el('ul', 'drawer-facts');
    [['calendar', ui('year'), project.year], ['clock', ui('duration'), copy.duration]].forEach(function (fact) {
      if (!fact[2]) return;
      var item = el('li', 'drawer-fact');
      item.appendChild(icon(fact[0]));
      item.appendChild(el('span', 'drawer-fact-label', fact[1]));
      item.appendChild(el('strong', null, fact[2]));
      facts.appendChild(item);
    });
    if (facts.children.length) body.appendChild(facts);

    if (copy.problem) body.appendChild(section(ui('problem'), el('p', null, copy.problem)));
    if (copy.solution) body.appendChild(section(ui('solution'), el('p', null, copy.solution)));

    if (copy.features.length) {
      var list = el('ul', 'drawer-features');
      copy.features.forEach(function (feature) {
        var item = el('li');
        item.appendChild(icon('check'));
        item.appendChild(el('span', null, feature));
        list.appendChild(item);
      });
      body.appendChild(section(ui('features'), list));
    }

    if (copy.result) {
      var result = el('div', 'drawer-result');
      result.appendChild(el('p', null, copy.result));
      body.appendChild(section(ui('result'), result));
    }

    // Who worked on it. No photos on purpose: the names carry it, and an empty
    // list simply leaves the section out, like every other one here.
    if (copy.team && copy.team.length) {
      var team = el('ul', 'drawer-team');
      copy.team.forEach(function (member) {
        if (!member || !member.name) return;
        var row = el('li', 'team-member');
        row.appendChild(el('span', 'team-name', member.name));
        if (member.role) row.appendChild(el('span', 'team-role', member.role));
        team.appendChild(row);
      });
      if (team.children.length) body.appendChild(section(ui('team'), team));
    }

    if (project.tags.length) {
      var tags = el('ul', 'tags');
      project.tags.forEach(function (tag) { tags.appendChild(el('li', null, tag)); });
      body.appendChild(section(ui('tech'), tags));
    }

    var actions = el('div', 'drawer-actions');
    if (project.live) {
      var live = el('a', 'btn btn-small');
      live.href = project.live;
      openInNewTab(live);
      live.appendChild(icon('globe'));
      live.appendChild(el('span', null, ui('live')));
      actions.appendChild(live);
    }
    if (project.code) {
      var code = el('a', 'btn btn-small btn-outline');
      code.href = project.code;
      openInNewTab(code);
      code.appendChild(icon('code'));
      code.appendChild(el('span', null, ui('code')));
      actions.appendChild(code);
    }
    // A placeholder project has no links yet, so the row is left out.
    if (actions.children.length) body.appendChild(actions);

    d.scroller.scrollTop = 0;
  }

  function openDrawer(index, from, list, scope) {
    if (list) {
      activeList = list;
      activeScope = scope || null;
    }
    current = (index + activeList.length) % activeList.length;
    if (from) trigger = from;
    renderDrawer();
    if (drawer.open) return;

    closing = false;
    drawer.showModal();
    root.classList.add('has-drawer');
    // Force a style/layout pass on the closed position first; otherwise the
    // browser never sees a start state and the slide-in does not animate.
    void drawer.offsetWidth;
    drawer.classList.add('is-open');
  }

  function closeDrawer() {
    if (!drawer.open || closing) return;
    closing = true;
    drawer.classList.remove('is-open');
    root.classList.remove('has-drawer');

    var done = false;
    function finish() {
      if (done) return;
      done = true;
      closing = false;
      if (drawer.open) drawer.close();
      // Back to the card that opened it (the matching one, if the user paged).
      var card = (activeScope || document).querySelector('[data-index="' + current + '"]');
      (card || trigger || document.body).focus();
    }
    if (reduce) {
      finish();
    } else {
      drawer.addEventListener('transitionend', function onEnd(e) {
        if (e.target !== drawer) return;
        drawer.removeEventListener('transitionend', onEnd);
        finish();
      });
      setTimeout(finish, 450); // if transitionend never fires
    }
  }

  function bindDrawer() {
    buildDrawer();
    if (typeof drawer.showModal !== 'function') return;

    // A path that does not resolve should read as "no screenshot yet",
    // not as a broken image.
    d.shotImg.addEventListener('error', function () {
      if (d.shotImg.getAttribute('src')) showEmptyShot();
    });

    d.close.addEventListener('click', closeDrawer);
    d.prev.addEventListener('click', function () { openDrawer(current - 1); });
    d.next.addEventListener('click', function () { openDrawer(current + 1); });

    // Esc: animate out instead of the browser's instant close.
    drawer.addEventListener('cancel', function (e) {
      e.preventDefault();
      closeDrawer();
    });

    // The panel fills the dialog, so a click whose target is the dialog
    // itself can only be on the backdrop.
    drawer.addEventListener('click', function (e) {
      if (e.target === drawer) closeDrawer();
    });

    // Arrow keys page through projects (they do nothing else in the panel,
    // which only scrolls vertically).
    drawer.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') openDrawer(current - 1);
      if (e.key === 'ArrowRight') openDrawer(current + 1);
    });
  }

  /* =====================================================================
     Show-off project

     index.html lists the three categories with their totals. Each category
     is a real page of its own (company-profile.html and friends) sharing
     this script and style.css; <body data-category="…"> says which one, and
     the project cards are built from SHOWCASE below.
     ===================================================================== */

  var showcaseTotal = document.getElementById('categoryTotal');
  var showcaseGrid = document.getElementById('categoryGrid');
  var activeCategory = null;

  function findCategory(slug) {
    for (var i = 0; i < SHOWCASE.length; i++) {
      if (SHOWCASE[i].slug === slug) return SHOWCASE[i];
    }
    return null;
  }

  function categoryText(category, part) {
    return t(category.key + '.' + part);
  }

  /** The "5" on each category card comes from the data, never from the HTML. */
  function syncCategoryCounts() {
    SHOWCASE.forEach(function (category) {
      each('[data-count-for="' + category.slug + '"]', function (node) {
        node.textContent = String(category.projects.length);
      });
    });
  }

  function buildProjectCard(project, index) {
    var copy = project[lang];

    var item = el('li', 'project');
    var heading = el('h3');
    var button = el('button', 'project-open', copy.name);
    button.type = 'button';
    button.setAttribute('data-index', String(index));
    button.setAttribute('aria-haspopup', 'dialog');
    button.setAttribute('aria-controls', 'projectDrawer');
    heading.appendChild(button);
    item.appendChild(heading);

    item.appendChild(el('p', null, copy.summary));

    if (project.tags.length) {
      var tags = el('ul', 'tags');
      tags.setAttribute('aria-label', ui('tech'));
      project.tags.forEach(function (tag) { tags.appendChild(el('li', null, tag)); });
      item.appendChild(tags);
    }

    var more = el('span', 'project-more');
    more.setAttribute('aria-hidden', 'true');
    more.appendChild(el('span', null, ui('more')));
    more.appendChild(icon('next'));
    item.appendChild(more);

    return item;
  }

  /** Only the list and the total are built here; the rest of the page is HTML. */
  function renderCategoryPage() {
    if (!activeCategory || !showcaseGrid) return;
    var projects = activeCategory.projects;

    showcaseTotal.textContent = ui('total').replace('{n}', String(projects.length));

    showcaseGrid.textContent = '';
    if (!projects.length) {
      showcaseGrid.appendChild(el('li', 'category-empty', ui('empty')));
      return;
    }
    projects.forEach(function (project, index) {
      showcaseGrid.appendChild(buildProjectCard(project, index));
    });
  }

  function initShowcase() {
    if (!activeCategory) {
      syncCategoryCounts(); // the landing page
      return;
    }
    if (!showcaseGrid) return;
    // The list itself was built by the applyLanguage() call in init().

    // The cards are rebuilt whenever the language changes, so this is delegated.
    showcaseGrid.addEventListener('click', function (e) {
      var button = e.target.closest ? e.target.closest('[data-index]') : null;
      if (!button) return;
      openDrawer(Number(button.getAttribute('data-index')), button, activeCategory.projects, showcaseGrid);
    });
  }

  /* =====================================================================
     Motion: reveal + parallax (skipped under reduced motion)
     ===================================================================== */

  function reveal() {
    var items = document.querySelectorAll('[data-reveal]');
    if (!items.length || !('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove('is-hidden');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px' });

    var fold = window.innerHeight;
    Array.prototype.forEach.call(items, function (node) {
      if (node.getBoundingClientRect().top < fold) return; // already on screen
      node.classList.add('is-hidden');
      observer.observe(node);
    });
  }

  function parallax() {
    var layers = document.querySelectorAll('[data-depth]');
    if (!layers.length) return;
    var ticking = false;

    function update() {
      ticking = false;
      var y = window.scrollY;
      if (y > window.innerHeight * 1.5) return; // hero is off screen
      Array.prototype.forEach.call(layers, function (layer) {
        var depth = parseFloat(layer.getAttribute('data-depth')) || 0;
        layer.style.translate = '0 ' + (y * depth).toFixed(1) + 'px';
      });
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }, { passive: true });
  }

  /* =====================================================================
     Start
     ===================================================================== */

  function init() {
    captureIndonesian();

    // Which page is this? A category page names itself on <body>, and the
    // answer is needed before applyLanguage() sets the title.
    activeCategory = findCategory(document.body.getAttribute('data-category') || '');

    each('[data-lang]', function (button) {
      button.addEventListener('click', function () { setLanguage(button.getAttribute('data-lang')); });
    });

    var saved = storageGet(LANG_KEY);
    lang = saved === 'en' ? 'en' : 'id';
    applyLanguage();

    bindDrawer();
    initShowcase();

    if (!reduce) {
      reveal();
      parallax();
    }
  }

  init();
})();
