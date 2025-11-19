
async function openPortfolioModal(projectId) {
  const project = window.portfolioProjects.find(p => p.id === projectId);
  if (!project) {
    console.error(`Project with id "${projectId}" not found.`);
    return;
  }

  try {
    const response = await fetch('portfolio-details/details.html');
    if (!response.ok) throw new Error('Failed to load modal template');

    const templateHtml = await response.text();

    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal fade';
    modalContainer.id = 'portfolioModal';
    modalContainer.setAttribute('tabindex', '-1');
    modalContainer.setAttribute('aria-hidden', 'true');
    modalContainer.innerHTML = templateHtml;

    document.body.appendChild(modalContainer);

    const currentModal = new bootstrap.Modal(modalContainer);

    fillModalWithData(modalContainer, project);

    currentModal.show();

    setTimeout(() => {
      initSwiperInModal(modalContainer);
    }, 100);

    modalContainer.addEventListener('hidden.bs.modal', () => {
      modalContainer.remove();
    });

  } catch (error) {
    console.error('Error loading modal:', error);
  }
}

function fillModalWithData(modalElement, project) {
  const titleEl = modalElement.querySelector('h4');
  if (titleEl) titleEl.textContent = project.title;

  const descEl = modalElement.querySelector('.portfolio-description-text');
  if (descEl) descEl.textContent = project.description;

  const infoList = modalElement.querySelector('.portfolio-info-list');
  if (infoList) {
    infoList.innerHTML = `
      <li><strong>Kategori : </strong> ${project.category}</li>
      <li><strong>Tim Kerja Sama : </strong> ${project.client}</li>
      <li><strong>Tanggal : </strong> ${project.date}</li>
      <li>
        <strong>URL:</strong>
        <a href="${project.url}" target="_blank" class="text-decoration-underline">${project.url}</a>
      </li>
    `;
  }

  const swiperWrapper = modalElement.querySelector('.swiper-wrapper');
  swiperWrapper.innerHTML = '';
  project.images.forEach(imgSrc => {
    const slide = document.createElement('div');
    slide.className = 'swiper-slide';
    slide.innerHTML = `<img src="${imgSrc}" alt="" style="width: 100%; height: 100%; object-fit: cover;">`;
    swiperWrapper.appendChild(slide);
  });

  const waLink = modalElement.querySelector('a');
  if (waLink) {
    waLink.href = "https://wa.me/6285148951464?text=Halo%2C%20saya%20tertarik%20dengan%20proyek%20${encodeURIComponent(project.title)}%20bisakah%20saya%20mengetahui%20lebih%20detailnya%20?";
  }
}

function initSwiperInModal(modalElement) {
  const swiperContainer = modalElement.querySelector('.portfolio-details-slider');
  if (!swiperContainer) return;

  if (swiperContainer.swiper) {
    swiperContainer.swiper.destroy(true, true);
  }

  const configScript = swiperContainer.querySelector('.swiper-config');
  const config = configScript ? JSON.parse(configScript.textContent) : {
    loop: true,
    speed: 600,
    autoplay: { delay: 1500 },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  };

  new Swiper(swiperContainer, config);
}