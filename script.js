// =========================================================================
// 1. BASE DE DATOS DE PRODUCTOS (Joyas y Ropa según Rúbrica)
// =========================================================================
const products = [
  {
    id: 1,
    name: "Anillo de Compromiso Oro 18k Solitario",
    type: "Joyas",
    gender: "Mujer",
    age: "Adulto",
    use: "Formal",
    price: 1850.00,
    oldPrice: 2200.00,
    img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600",
    desc: "Exclusivo anillo solitario forjado artesanalmente en oro amarillo de 18 kilates. Coronada con una gema facetada de brillo excepcional.",
    benefits: ["Oro de 18k certificado", "Estuche premium de regalo", "Garantía de por vida"]
  },
  {
    id: 2,
    name: "Saco Blazer Ejecutivo Slim Fit Italiano",
    type: "Ropa",
    gender: "Hombre",
    age: "Adulto",
    use: "Formal",
    price: 450.00,
    img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600",
    desc: "Blazer de alta costura con corte Slim Fit de patrón italiano. Ideal para reuniones ejecutivas o eventos de etiqueta.",
    benefits: ["Forro interior premium", "Tejido transpirable antiarrugas", "Ajuste perfecto"]
  },
  {
    id: 3,
    name: "Collar Minimalista Plata de Ley 925",
    type: "Joyas",
    gender: "Mujer",
    age: "Adulto",
    use: "Casual",
    price: 135.00,
    oldPrice: 180.00,
    img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600",
    desc: "Cadena fina elaborada en plata legítima 925 hipoalergénica con un dije geométrico pulido a espejo.",
    benefits: ["Plata 925 pura", "Material hipoalergénico", "Cierre de seguridad"]
  },
  {
    id: 4,
    name: "Vestido de Gala Escote Reina Premium",
    type: "Ropa",
    gender: "Mujer",
    age: "Adulto",
    use: "Formal",
    price: 680.00,
    img: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=600",
    desc: "Espectacular vestido largo de fiesta confeccionado en satén premium con caída fluida.",
    benefits: ["Satén de alta densidad", "Textura ultrasuave al tacto", "Acabados de alta costura"]
  },
  {
    id: 5,
    name: "Casaca Denim Térmica Infantil",
    type: "Ropa",
    gender: "Unisex",
    age: "Niño",
    use: "Casual",
    price: 189.00,
    img: "https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?q=80&w=600",
    desc: "Casaca de mezclilla de alta resistencia diseñada para niños. Cuenta con un forro interior suave para proteger del frío.",
    benefits: ["Costuras dobles reforzadas", "Tejido hipoalergénico", "Resistente a lavados"]
  }
];

let cart = [];
let activeCategory = "todos"; 

// =========================================================================
// 2. RENDERIZADO DINÁMICO DE TARJETAS (MANEJO DEL DOM CON JQUERY)
// =========================================================================
function renderProducts() {
  const $grid = $('#products-grid');
  const $emptyState = $('#empty-state');
  const searchQuery = ($('#search').val() || "").toLowerCase().trim();

  if ($grid.length === 0) {
    setTimeout(renderProducts, 50);
    return;
  }
  
  $grid.empty(); 

  const filtered = products.filter(p => {
    let matchesFilter = false;
    const cat = activeCategory.toLowerCase();

    if (cat === "todos") {
      matchesFilter = true;
    } else if (cat === "ofertas" || cat === "oferta") {
      matchesFilter = !!p.oldPrice;
    } else {
      matchesFilter = p.type.toLowerCase().includes(cat) || 
                      p.gender.toLowerCase().includes(cat) || 
                      p.age.toLowerCase().includes(cat) || 
                      p.use.toLowerCase().includes(cat) ||
                      (cat === "damas" && p.gender.toLowerCase() === "mujer") ||
                      (cat === "caballeros" && p.gender.toLowerCase() === "hombre") ||
                      (cat === "niños" && p.age.toLowerCase() === "niño");
    }
    
    const matchesSearch = p.name.toLowerCase().includes(searchQuery) || 
                          p.desc.toLowerCase().includes(searchQuery) || 
                          p.type.toLowerCase().includes(searchQuery);

    return matchesFilter && matchesSearch;
  });

  if (filtered.length === 0) {
    if ($emptyState.length) $emptyState.fadeIn(200).addClass('show');
    return;
  }
  if ($emptyState.length) $emptyState.fadeOut(100).removeClass('show');

  filtered.forEach(p => {
    const isAdded = cart.some(item => item.id === p.id);
    const hasDiscount = !!p.oldPrice;
    
    let priceBlock = `<span class="price"><sup>S/</sup>${p.price.toFixed(2)}</span>`;
    let badgeHtml = "";

    if (hasDiscount) {
      badgeHtml = `<span class="card-badge discount">Oferta</span>`;
      priceBlock = `
        <div class="catalog-price-block">
          <span class="price-old-crossed">S/ ${p.oldPrice.toFixed(2)}</span>
          <span class="price-sale"><sup>S/</sup>${p.price.toFixed(2)}</span>
        </div>
      `;
    }

    const cardHtml = `
      <div class="card" style="display: none;">
        ${badgeHtml}
        <div class="card-img" onclick="openProductModal(${p.id})">
          <img src="${p.img}" alt="${p.name}">
        </div>
        <div class="card-body">
          <span class="card-cat">${p.type} • ${p.gender} • ${p.use}</span>
          <h3 class="card-name" onclick="openProductModal(${p.id})">${p.name}</h3>
          <p class="card-desc">${p.desc}</p>
          <div class="card-footer">
            ${priceBlock}
            <button class="add-btn ${isAdded ? 'added' : ''}" onclick="event.stopPropagation(); toggleAddToCart(${p.id})">
              ${isAdded ? '✓ Agregado' : 'Llevar'}
            </button>
          </div>
        </div>
      </div>
    `;

    const $card = $(cardHtml);
    $grid.append($card);
    $card.fadeIn(300); 
  });
}

// =========================================================================
// 3. CARRUSEL AUTOMÁTICO DE 5 IMÁGENES CON JQUERY
// =========================================================================
function initCarousel() {
  const $slides = $('.carousel-slide');
  const $dots = $('.carousel-dot');
  let currentSlide = 0;
  let carouselInterval;

  if ($slides.length === 0) return;

  function showSlide(index) {
    $slides.removeClass('active');
    $dots.removeClass('active');
    $slides.eq(index).addClass('active');
    $dots.eq(index).addClass('active');
    currentSlide = index;
  }

  function nextSlide() {
    let next = (currentSlide + 1) % $slides.length;
    showSlide(next);
  }

  $dots.on('click', function() {
    const index = $(this).index();
    showSlide(index);
    clearInterval(carouselInterval);
    carouselInterval = setInterval(nextSlide, 5000);
  });

  carouselInterval = setInterval(nextSlide, 5000);
}

// =========================================================================
// 4. OPERACIONES EN EL CARRITO DE COMPRAS
// =========================================================================
function toggleCart() {
  $('#cart-sidebar').toggleClass('open');
  $('#overlay').toggleClass('open');
}

function toggleAddToCart(id) {
  const prod = products.find(p => p.id === id);
  const index = cart.findIndex(item => item.id === id);

  if (index > -1) {
    cart.splice(index, 1);
    showToast("Producto removido de la bolsa");
  } else {
    cart.push({ ...prod, qty: 1 });
    showToast("¡Añadido con éxito!");
  }

  updateCartUI();
  renderProducts();
}

function changeQty(id, delta) {
  const item = cart.find(p => p.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(p => p.id !== id);
  }
  updateCartUI();
  renderProducts();
}

function updateCartUI() {
  const $container = $('#cart-items-container');
  const $cartCount = $('#cart-count');
  const $subtotalEl = $('#cart-subtotal');
  const $totalEl = $('#cart-total');
  const $formContainer = $('#checkout-form-container');
  const $btnCheckout = $('#checkout-btn');

  if ($container.length === 0) return;

  const totalItems = cart.reduce((acc, p) => acc + p.qty, 0);
  $cartCount.text(totalItems);

  if (cart.length === 0) {
    $container.html(`<div class="cart-empty"><p>Tu bolsa de compras está vacía.</p></div>`);
    $subtotalEl.text("S/ 0.00");
    $totalEl.text("S/ 0.00");
    $formContainer.hide();
    $btnCheckout.text("llenar datos de compra");
    return;
  }

  $container.empty();
  let totalDinero = 0;

  cart.forEach(item => {
    totalDinero += item.price * item.qty;
    const itemHtml = `
      <div class="cart-item">
        <div class="ci-icon"><img src="${item.img}" alt="${item.name}"></div>
        <div class="ci-info">
          <h4 class="ci-name">${item.name}</h4>
          <div class="ci-price">S/ ${(item.price * item.qty).toFixed(2)}</div>
          <div class="ci-qty">
            <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
            <span class="qty-val">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
            <button class="ci-remove" style="margin-left:auto;" onclick="changeQty(${item.id}, -${item.qty})">Eliminar</button>
          </div>
        </div>
      </div>
    `;
    $container.append(itemHtml);
  });

  $subtotalEl.text(`S/ ${totalDinero.toFixed(2)}`);
  $totalEl.text(`S/ ${totalDinero.toFixed(2)}`);
}

// =========================================================================
// 5. VENTANA MODAL CON INFORMACIÓN DETALLADA (CORREGIDO CIERRE)
// =========================================================================
function openProductModal(id) {
  const prod = products.find(p => p.id === id);
  if (!prod) return;

  $('#modal-img').attr('src', prod.img);
  $('#modal-cat').text(`${prod.type} | Para: ${prod.gender} (${prod.age})`);
  $('#modal-name').text(prod.name);

  let benefitsHtml = `<p style="font-size:0.9rem; color:#64748b; margin-bottom:1rem;">${prod.desc}</p><ul style="display:flex; flex-direction:column; gap:6px;">`;
  prod.benefits.forEach(b => {
    benefitsHtml += `<li style="font-size:0.85rem; color:#0f172a; display:flex; align-items:center; gap:6px;">✦ ${b}</li>`;
  });
  benefitsHtml += `</ul>`;
  $('#modal-desc-block').html(benefitsHtml);
  $('#modal-price').text(`S/ ${prod.price.toFixed(2)}`);

  const isAdded = cart.some(item => item.id === prod.id);
  $('#modal-action-block').html(`
    <button class="add-btn ${isAdded ? 'added' : ''}" style="padding:0.8rem 2rem; font-size:1rem;" onclick="toggleAddToCart(${prod.id}); openProductModal(${prod.id});">
      ${isAdded ? 'Remover de la Bolsa' : 'Añadir a la Bolsa'}
    </button>
  `);

  $('#product-modal').addClass('open');
  $('#overlay').addClass('open');
}

function closeProductModal() {
  $('#product-modal').removeClass('open');
  // Solo removemos el fondo si la barra del carrito tampoco está abierta
  if (!$('#cart-sidebar').hasClass('open')) {
    $('#overlay').removeClass('open');
  }
}

// =========================================================================
// 6. FORMULARIO INTERACTIVO Y VALIDACIÓN DE DATOS LOCAL
// =========================================================================
function checkout() {
  const $formContainer = $('#checkout-form-container');
  const $btnCheckout = $('#checkout-btn');

  if (cart.length === 0) {
    showToast("Añade productos antes de procesar.");
    return;
  }

  if ($formContainer.is(':hidden') || $formContainer.css('display') === 'none') {
    $formContainer.slideDown(400); 
    $btnCheckout.text("Confirmar y Finalizar Pedido");
    return;
  }

  const name = $('#cust-name').val().trim();
  const lastname = $('#cust-lastname').val().trim();
  const phone = $('#cust-phone').val().trim();
  const email = $('#cust-email').val().trim();
  const pDate = $('#cust-pickup-date').val();
  const pTime = $('#cust-pickup-time').val();

  if (!name || !lastname || !phone || !email || !pDate || !pTime) {
    showToast("❌ Por favor completa todos tus datos.");
    return;
  }

  alert(`¡Pedido Procesado Exitosamente, ${name}!\nGracias por comprar en nuestra tienda de Ropa & Joyería Premium.\n\nTotal a pagar en sucursal: S/ ${cart.reduce((acc, i) => acc + (i.price * i.qty), 0).toFixed(2)}`);
  
  cart = [];
  updateCartUI();
  toggleCart();
  renderProducts();

  $('#cust-name').val('');
  $('#cust-lastname').val('');
  $('#cust-phone').val('');
  $('#cust-email').val('');
  $('#cust-pickup-date').val('');
  $('#cust-pickup-time').val('');
  $formContainer.slideUp(300);
  $btnCheckout.text("llenar datos de compra");
}

function showToast(msg) {
  const $toast = $('#toast');
  if ($toast.length === 0) return;
  $toast.text(msg).fadeIn(200).addClass('show');
  setTimeout(() => $toast.fadeOut(200).removeClass('show'), 2800);
}

// Ejecución inicial automática
renderProducts();

// =========================================================================
// 7. MANEJO DE EVENTOS CON JQUERY (LISTENERS COMPLETOS)
// =========================================================================
$(function() {
  initCarousel();
  renderProducts();

  $('#cart-trigger').on('click', toggleCart);
  $('#cart-close').on('click', toggleCart);
  
  // SOLUCIÓN AL CIERRE COMPLETO AL HACER CLICK EN EL OVERLAY (FONDO OSCURO)
  $('#overlay').on('click', function() {
    closeProductModal();
    if ($('#cart-sidebar').hasClass('open')) {
      toggleCart();
    }
  });

  $('#checkout-btn').on('click', checkout);
  $('#search').on('input', renderProducts);

  // Escuchar clicks para categorías
  $(document).on('click', '.nav-item[data-cat], .filter-chip[data-cat], [data-cat]', function() {
    const $this = $(this);
    $('.nav-item, .filter-chip').removeClass('active');
    $this.addClass('active');
    activeCategory = $this.attr('data-cat') || "todos";
    renderProducts();
  });
});
