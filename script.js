const COLORS = [
    { id:'p1',  name:'Cinza',         img:'assets/cinza.jpg'  },
    { id:'p2',  name:'Branco',        img:'assets/branco.jpg'  },
    { id:'p3',  name:'Bordô',         img:'assets/bordo.jpg'  },
    { id:'p4',  name:'Azul Turquesa', img:'assets/azul-turquesa.jpg'  },
    { id:'p5',  name:'Vermelho',      img:'assets/vermelho.jpg'  },
    { id:'p6',  name:'Rosa Claro',    img:'assets/rosa-claro.jpg'  },
    { id:'p7',  name:'Azul Marinho',  img:'assets/azul-marinho.jpg'  },
    { id:'p8',  name:'Rosa Choque',   img:'assets/rosa-choque.jpg'  },
    { id:'p9',  name:'Preto',         img:'assets/preto.jpg'  },
    { id:'p10', name:'Bege',          img:'assets/bege.jpg' },
  ];

  // Fotos reais das peças com a marca "Gola a cutar" impressa.
  // Não há foto de marca para cada cor — mostramos a foto real do
  // tipo escolhido (regata ou t-shirt) quando "Com marca" está ativo.
  const BRANDED_PHOTOS = {
    'T-shirt': 'assets/com-marca-tshirt.jpg',
    'Regata':  'assets/com-marca-regata.jpg',
  };

  let state = {
    type: 'T-shirt',
    brand: 'sem',
    price: 5000,
    colorIdx: 0,
    size: 'M',
    qty: 1,
  };
  let cart = [];

  const previewImg = document.getElementById('previewImg');
  const previewTag = document.getElementById('previewTag');
  const previewNote = document.getElementById('previewNote');
  const colorNameEl = document.getElementById('colorName');
  const colorGrid = document.getElementById('colorGrid');
  const itemTotalEl = document.getElementById('itemTotal');
  const qtyValEl = document.getElementById('qtyVal');

  function fmt(n){ return n.toLocaleString('pt-PT') + ' Kz'; }

  function renderColorGrid(){
    colorGrid.innerHTML = '';
    COLORS.forEach((c, i) => {
      const div = document.createElement('div');
      div.className = 'color-swatch' + (i === state.colorIdx ? ' active' : '');
      div.innerHTML = `<img src="${c.img}" alt="${c.name}"><span class="cname">${c.name}</span>`;
      div.addEventListener('click', () => { state.colorIdx = i; update(); });
      colorGrid.appendChild(div);
    });
  }

  function update(){
    const color = COLORS[state.colorIdx];
    colorNameEl.textContent = color.name;

    if(state.brand === 'com'){
      // Com marca: mostra a foto real do produto (regata ou t-shirt)
      previewImg.src = BRANDED_PHOTOS[state.type];
      previewTag.textContent = `Com marca · ${state.type}`;
      previewNote.style.display = 'block';
      previewNote.textContent = 'Foto real do produto — cor pode variar conforme stock';
    } else {
      previewImg.src = color.img;
      previewTag.textContent = `${color.name} · ${state.type}`;
      previewNote.style.display = 'none';
    }

    itemTotalEl.textContent = fmt(state.price * state.qty);
    qtyValEl.textContent = state.qty;
    [...colorGrid.children].forEach((el, i) => el.classList.toggle('active', i === state.colorIdx));
  }

  document.getElementById('typeRow').addEventListener('click', (e) => {
    const btn = e.target.closest('.toggle-btn');
    if(!btn) return;
    document.querySelectorAll('#typeRow .toggle-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.type = btn.dataset.type;
    update();
  });

  document.getElementById('brandRow').addEventListener('click', (e) => {
    const btn = e.target.closest('.toggle-btn');
    if(!btn) return;
    document.querySelectorAll('#brandRow .toggle-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.brand = btn.dataset.brand;
    state.price = parseInt(btn.dataset.price, 10);
    update();
  });

  document.getElementById('sizeRow').addEventListener('click', (e) => {
    const btn = e.target.closest('.size-btn');
    if(!btn) return;
    document.querySelectorAll('#sizeRow .size-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.size = btn.dataset.size;
  });

  document.getElementById('qtyMinus').addEventListener('click', () => {
    if(state.qty > 1) state.qty--;
    update();
  });
  document.getElementById('qtyPlus').addEventListener('click', () => {
    if(state.qty < 20) state.qty++;
    update();
  });

  const toast = document.getElementById('toast');
  function showToast(msg){
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 1800);
  }

  document.getElementById('addCartBtn').addEventListener('click', () => {
    const color = COLORS[state.colorIdx];
    cart.push({
      type: state.type,
      brand: state.brand === 'com' ? 'Com marca' : 'Sem marca',
      color: color.name,
      img: state.brand === 'com' ? BRANDED_PHOTOS[state.type] : color.img,
      size: state.size,
      qty: state.qty,
      price: state.price,
    });
    renderCart();
    showToast('Adicionado ao carrinho!');
  });

  const cartCountEl = document.getElementById('cartCount');
  const drawerBody = document.getElementById('drawerBody');
  const drawerTotalEl = document.getElementById('drawerTotal');

  function renderCart(){
    cartCountEl.textContent = cart.reduce((s,i)=>s+i.qty,0);
    if(cart.length === 0){
      drawerBody.innerHTML = '<div class="empty-cart">O carrinho está vazio. Adiciona uma peça para começar.</div>';
      drawerTotalEl.textContent = fmt(0);
      return;
    }
    drawerBody.innerHTML = cart.map((item, idx) => `
      <div class="cart-item">
        <img src="${item.img}" alt="${item.color}">
        <div class="ci-info">
          <b>${item.type} — ${item.color}</b>
          <span>${item.brand} · Tam ${item.size} · Qtd ${item.qty}</span><br>
          <span>${fmt(item.price * item.qty)}</span>
        </div>
        <button class="ci-remove" data-idx="${idx}">remover</button>
      </div>
    `).join('');
    const total = cart.reduce((s,i) => s + i.price * i.qty, 0);
    drawerTotalEl.textContent = fmt(total);
    drawerBody.querySelectorAll('.ci-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        cart.splice(parseInt(btn.dataset.idx,10), 1);
        renderCart();
      });
    });
  }

  const drawer = document.getElementById('cartDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  function openDrawer(){ drawer.classList.add('open'); drawerOverlay.classList.add('open'); }
  function closeDrawer(){ drawer.classList.remove('open'); drawerOverlay.classList.remove('open'); }
  document.getElementById('cartToggle').addEventListener('click', openDrawer);
  document.getElementById('drawerClose').addEventListener('click', closeDrawer);
  drawerOverlay.addEventListener('click', closeDrawer);

  document.getElementById('checkoutBtn').addEventListener('click', () => {
    if(cart.length === 0){ showToast('O carrinho está vazio.'); return; }
    let msg = 'Olá! Gostaria de encomendar:%0A%0A';
    cart.forEach((item, i) => {
      msg += `${i+1}. ${item.type} ${item.brand} — Cor: ${item.color} — Tam: ${item.size} — Qtd: ${item.qty} — ${fmt(item.price*item.qty)}%0A`;
    });
    const total = cart.reduce((s,i) => s + i.price * i.qty, 0);
    msg += `%0ATotal: ${fmt(total)}`;
    window.open(`https://wa.me/244973519805?text=${msg}`, '_blank');
  });

  renderColorGrid();
  update();
  renderCart();