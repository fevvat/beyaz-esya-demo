/**
 * SERVIS MERKEZI - Vanilla JavaScript Etkileşim Motoru (main.js)
 * Bağımlılık (kütüphane) içermez.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. SCROLL DİNLEYİCİSİ (Header Gölgelendirme)
  const siteHeader = document.getElementById('siteHeader');
  const handleScroll = () => {
    if (window.scrollY > 20) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 2. MOBİL MENÜ YÖNETİMİ
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      mainNav.classList.toggle('is-open');
    });

    // Menü bağlantılarına tıklandığında menüyü kapat
    const navLinks = mainNav.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('is-open');
      });
    });
  }

  // 3. HİZMET KARTLARINDAN FORM DOLDURMAYA GEÇİŞ
  const serviceActionLinks = document.querySelectorAll('.card-action-link');
  const deviceSelect = document.getElementById('deviceCategory');
  
  serviceActionLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetDevice = link.getAttribute('data-device');
      if (deviceSelect && targetDevice) {
        deviceSelect.value = targetDevice;
      }
    });
  });

  // 4. ŞEFFAFLIK BİLGİ PANELİ ETKİLEŞİMİ (Tıklanabilir Kartlar)
  const deckCards = document.querySelectorAll('.deck-card');
  deckCards.forEach(card => {
    card.addEventListener('click', () => {
      deckCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });

  // 5. ERİŞİLEBİLİR SSS (FAQ) ACCORDION
  const faqTriggers = document.querySelectorAll('.faq-trigger');

  faqTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      const contentId = trigger.getAttribute('aria-controls');
      const contentPanel = document.getElementById(contentId);

      // Diğer açık olan panelleri kapat (opsiyonel temiz görünüm)
      faqTriggers.forEach(otherTrigger => {
        if (otherTrigger !== trigger) {
          otherTrigger.setAttribute('aria-expanded', 'false');
          const otherContent = document.getElementById(otherTrigger.getAttribute('aria-controls'));
          if (otherContent) otherContent.hidden = true;
        }
      });

      // Seçileni aç veya kapat
      trigger.setAttribute('aria-expanded', !isExpanded);
      if (contentPanel) {
        contentPanel.hidden = isExpanded;
      }
    });
  });

  // 6. SERVİS TALEP FORMU DOĞRULAMA VE DÖNÜŞÜM AKIŞI
  const bookingForm = document.getElementById('serviceBookingForm');
  const formSuccessState = document.getElementById('formSuccessState');
  const submitBtn = document.getElementById('submitBtn');
  const resetFormBtn = document.getElementById('resetFormBtn');

  if (bookingForm) {
    const fields = {
      name: { el: document.getElementById('fullName'), errorEl: document.getElementById('nameError') },
      phone: { el: document.getElementById('phone'), errorEl: document.getElementById('phoneError') },
      district: { el: document.getElementById('district'), errorEl: document.getElementById('districtError') },
      device: { el: document.getElementById('deviceCategory'), errorEl: document.getElementById('deviceError') },
      desc: { el: document.getElementById('problemDescription'), errorEl: document.getElementById('descError') }
    };

    // Hata durumunu temizle
    const clearError = (field) => {
      field.el.closest('.form-group').classList.remove('has-error');
    };

    // Hata göster
    const showError = (field) => {
      field.el.closest('.form-group').classList.add('has-error');
    };

    // Canlı input değişikliklerinde hataları temizle
    Object.values(fields).forEach(field => {
      if (field.el) {
        field.el.addEventListener('input', () => clearError(field));
        field.el.addEventListener('change', () => clearError(field));
      }
    });

    // Telefon doğrulaması için basit mantık
    const isValidPhone = (val) => {
      const cleaned = val.replace(/\D/g, '');
      return cleaned.length >= 10;
    };

    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Ad Soyad Kontrolü
      if (!fields.name.el.value.trim()) {
        showError(fields.name);
        isValid = false;
      }

      // Telefon Kontrolü
      if (!isValidPhone(fields.phone.el.value.trim())) {
        showError(fields.phone);
        isValid = false;
      }

      // İlçe Kontrolü
      if (!fields.district.el.value.trim()) {
        showError(fields.district);
        isValid = false;
      }

      // Cihaz Seçimi Kontrolü
      if (!fields.device.el.value) {
        showError(fields.device);
        isValid = false;
      }

      // Açıklama Kontrolü
      if (!fields.desc.el.value.trim()) {
        showError(fields.desc);
        isValid = false;
      }

      if (!isValid) {
        // İlk hatalı alana odaklan
        const firstError = bookingForm.querySelector('.has-error input, .has-error select, .has-error textarea');
        if (firstError) firstError.focus();
        return;
      }

      // Form geçerli: Yükleme durumuna geç
      submitBtn.disabled = true;
      submitBtn.classList.add('loading');
      submitBtn.querySelector('.btn-text').textContent = 'Talebiniz gönderiliyor...';

      // 900ms simülasyon gecikmesi
      setTimeout(() => {
        bookingForm.hidden = true;
        formSuccessState.hidden = false;
        
        // Başarı durumuna yumuşak odaklanma
        formSuccessState.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 900);
    });

    // Yeni talep gönderme (Formu sıfırla)
    if (resetFormBtn) {
      resetFormBtn.addEventListener('click', () => {
        bookingForm.reset();
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        submitBtn.querySelector('.btn-text').textContent = 'Servis talebi gönder';
        
        formSuccessState.hidden = true;
        bookingForm.hidden = false;
        bookingForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
  }

});