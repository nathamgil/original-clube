/* =====================================================================
   Peças da vitrine (capa, página do artista e processo) — não depende do motor.
   - cards da equipe (levam para artista.html?a=<slug>)
   - "Pedir orçamento com ..." / "Agendar com ...": abre o pedido já com a pessoa
   - portfólio em grade + foto ampliada com anterior/próxima (setas do teclado)
   - flashes disponíveis por artista ("Quero esse flash" já preenche o pedido)
   - página do artista: foto, ficha, estilos, bio, portfólio, outros da equipe
   Quem não tem foto ganha um avatar tipográfico (iniciais ou a.avatar).
   ===================================================================== */
(function () {
  'use strict';

  var CFG = window.TV;
  function $(s) { return document.querySelector(s); }
  function $$(s) { return Array.prototype.slice.call(document.querySelectorAll(s)); }
  function el(tag, cls, txt) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (txt != null) n.textContent = txt;
    return n;
  }
  function chama(a) { return a.apelido || a.nome; }
  function ehTattoo(a) { return (a.frente || 'tattoo') === 'tattoo'; }
  function linkAgendar(a) { return 'index.html?artista=' + encodeURIComponent(a.slug) + '#agendar'; }
  function linkPagina(a) { return 'artista.html?a=' + encodeURIComponent(a.slug); }
  function rotuloPedir(a) { return ehTattoo(a) ? 'Pedir orçamento com ' + chama(a) : 'Agendar com ' + chama(a); }
  function iniciais(nome) {
    return String(nome || '').trim().split(/\s+/).slice(0, 2).map(function (p) { return p[0]; }).join('').toUpperCase();
  }

  var ano = $('#ano');
  if (ano) ano.textContent = new Date().getFullYear();
  if (CFG.modoDemo && $('#faixa-demo')) $('#faixa-demo').hidden = false;

  /* ---- avatar: foto ou tipográfico ---- */
  function avatar(a, cls) {
    var box = el('span', cls || 'avatar');
    if (a.foto) {
      var im = el('img'); im.src = a.foto; im.alt = 'Foto de ' + a.nome; im.loading = 'lazy';
      box.appendChild(im);
    } else {
      box.classList.add('avatar-tipo');
      var av = a.avatar || {};
      box.appendChild(el('b', null, av.letra || iniciais(a.nome)));
      if (av.simbolo) box.appendChild(el('i', null, av.simbolo));
      box.setAttribute('aria-label', 'Avatar de ' + a.nome + ' (sem foto)');
    }
    return box;
  }

  /* ---- card da equipe ---- */
  function card(a, i) {
    var c = el('article', 'card-art card-' + (a.frente || 'tattoo'));
    var topo = el('a', 'ca-link');
    topo.href = linkPagina(a);
    topo.setAttribute('aria-label', 'Abrir a página de ' + a.nome);
    var capa = el('span', 'ca-capa');
    if (a.capa) {
      var ci = el('img'); ci.src = a.capa; ci.alt = ''; ci.loading = 'lazy';
      capa.appendChild(ci);
    }
    capa.appendChild(avatar(a, 'avatar ca-avatar'));
    topo.appendChild(capa);
    var corpo = el('span', 'ca-corpo');
    var num = CFG.rotuloCard ? CFG.rotuloCard(a, i) : String(i + 1).padStart(2, '0');
    corpo.appendChild(el('span', 'ca-num', num));
    corpo.appendChild(el('span', 'ca-oficio', a.oficio || ''));
    corpo.appendChild(el('h3', 'ca-nome', a.nome));
    corpo.appendChild(el('span', 'ca-linha', a.linha || ''));
    if (a.instagram) corpo.appendChild(el('span', 'ca-arroba', '@' + a.instagram));
    topo.appendChild(corpo);
    c.appendChild(topo);
    var acoes = el('div', 'ca-acoes');
    var p = el('a', 'btn btn-cheio', rotuloPedir(a));
    p.href = linkAgendar(a);
    p.setAttribute('data-embarcar', a.slug);
    acoes.appendChild(p);
    var v = el('a', 'btn btn-linha', ehTattoo(a) ? 'Ver portfólio' : 'Ver página');
    v.href = linkPagina(a);
    acoes.appendChild(v);
    c.appendChild(acoes);
    return c;
  }
  function pintaEquipe(alvo, filtro, exceto) {
    if (!alvo) return;
    var i = 0;
    CFG.artistas.forEach(function (a, idx) {
      if (filtro && (a.frente || 'tattoo') !== filtro) return;
      if (exceto && a.slug === exceto) return;
      alvo.appendChild(card(a, idx));
      i++;
    });
  }
  pintaEquipe($('#lista-equipe'));
  pintaEquipe($('#lista-tattoo'), 'tattoo');
  pintaEquipe($('#lista-barbearia'), 'barbearia');

  /* ---- atalhos para o pedido: na capa, sem recarregar a página ---- */
  document.addEventListener('click', function (ev) {
    var a = ev.target.closest && ev.target.closest('[data-embarcar]');
    if (!a || !$('#agendar-app') || !CFG.agendarCom || !CFG.barbeirosCarregados) return;
    ev.preventDefault();
    CFG.agendarCom(a.getAttribute('data-embarcar'));
    $('#agendar').scrollIntoView({ behavior: 'smooth' });
  });
  document.addEventListener('click', function (ev) {
    var b = ev.target.closest && ev.target.closest('[data-servico]');
    if (!b || !$('#agendar-app') || !CFG.agendarServico || !CFG.barbeirosCarregados) return;
    ev.preventDefault();
    CFG.agendarServico(b.getAttribute('data-servico'));
    $('#agendar').scrollIntoView({ behavior: 'smooth' });
  });

  window.addEventListener('load', function () {
    var alvo = location.hash.length > 1 && document.getElementById(location.hash.slice(1));
    if (alvo) setTimeout(function () { alvo.scrollIntoView(); }, 150);
  });

  /* ---- foto ampliada com anterior / próxima ---- */
  var lupa = null, serie = [], pos = 0;
  function mostra() {
    var f = serie[pos];
    lupa.querySelector('.lupa-leg').textContent = f.alt + (serie.length > 1 ? '  ·  ' + (pos + 1) + '/' + serie.length : '');
    var im = lupa.querySelector('img'); im.src = f.src; im.alt = f.alt;
  }
  function anda(d) { pos = (pos + d + serie.length) % serie.length; mostra(); }
  function amplia(lista, i) {
    if (!lupa) {
      lupa = el('dialog', 'lupa');
      var topo = el('div', 'lupa-topo');
      topo.appendChild(el('span', 'lupa-leg'));
      var x = el('button', 'btn btn-linha mini', 'Fechar');
      x.type = 'button';
      x.addEventListener('click', function () { lupa.close(); });
      topo.appendChild(x);
      lupa.appendChild(topo);
      var palco = el('div', 'lupa-palco');
      var ant = el('button', 'lupa-seta lupa-ant', '‹'); ant.type = 'button'; ant.setAttribute('aria-label', 'Foto anterior');
      var prox = el('button', 'lupa-seta lupa-prox', '›'); prox.type = 'button'; prox.setAttribute('aria-label', 'Próxima foto');
      ant.addEventListener('click', function () { anda(-1); });
      prox.addEventListener('click', function () { anda(1); });
      palco.appendChild(ant); palco.appendChild(el('img')); palco.appendChild(prox);
      lupa.appendChild(palco);
      lupa.addEventListener('click', function (ev) { if (ev.target === lupa) lupa.close(); });
      lupa.addEventListener('keydown', function (ev) {
        if (ev.key === 'ArrowLeft') anda(-1);
        if (ev.key === 'ArrowRight') anda(1);
      });
      document.body.appendChild(lupa);
    }
    serie = lista; pos = i;
    lupa.querySelectorAll('.lupa-seta').forEach(function (s) { s.hidden = lista.length < 2; });
    mostra();
    if (lupa.showModal) lupa.showModal(); else window.open(lista[i].src, '_blank');
  }
  function mural(alvo, fotos) {
    if (!alvo) return;
    fotos.forEach(function (f, i) {
      var fig = el('figure');
      var b = el('button', 'peca');
      b.type = 'button';
      b.setAttribute('aria-label', 'Ampliar: ' + f.alt);
      var im = el('img'); im.src = f.src; im.alt = f.alt; im.loading = 'lazy';
      b.appendChild(im);
      b.addEventListener('click', function () { amplia(fotos, i); });
      fig.appendChild(b);
      var leg = el('figcaption', null, f.alt);
      if (f.autor) leg.appendChild(el('small', null, f.autor));
      fig.appendChild(leg);
      alvo.appendChild(fig);
    });
  }
  CFG.mural = mural;

  // capa: amostra das peças (data-artista limita a uma pessoa)
  $$('[data-mural]').forEach(function (alvo) {
    var so = alvo.getAttribute('data-artista'), max = +alvo.getAttribute('data-max') || 8;
    var todas = [];
    var rodada = CFG.artistas.filter(function (a) { return !so || a.slug === so; })
      .map(function (a) { return (a.fotos || []).map(function (f) { return { src: f.src, alt: f.alt, autor: so ? '' : chama(a) }; }); });
    // intercala as pessoas para a amostra não ficar só de um
    for (var k = 0; todas.length < max && rodada.some(function (r) { return r.length > k; }); k++) {
      rodada.forEach(function (r) { if (r[k] && todas.length < max) todas.push(r[k]); });
    }
    mural(alvo, todas);
  });
  if ($('#galeria-barbearia') && CFG.galeriaBarbearia) mural($('#galeria-barbearia'), CFG.galeriaBarbearia);

  /* ---- flashes disponíveis ---- */
  function pedirFlash(a, f) {
    if ($('#agendar-app') && CFG.agendarCom && CFG.barbeirosCarregados) {
      CFG.agendarCom(a.slug);
      if (CFG.agendarServico) CFG.agendarServico('flash');
      preencheFlash(f.titulo);
      $('#agendar').scrollIntoView({ behavior: 'smooth' });
    } else {
      location.href = 'index.html?artista=' + encodeURIComponent(a.slug) + '&flash=' + encodeURIComponent(f.titulo) + '#agendar';
    }
  }
  function preencheFlash(titulo) {
    var ideia = $('#pj-ideia');
    if (ideia) ideia.value = 'Flash disponível: ' + titulo;
    $$('#pj-estilo .chip').forEach(function (c) {
      c.setAttribute('aria-pressed', /flash/i.test(c.textContent) ? 'true' : 'false');
    });
  }
  document.addEventListener('tv:dados', function () {
    var f = new URLSearchParams(location.search).get('flash');
    if (f && CFG.agendarServico) setTimeout(function () { CFG.agendarServico('flash'); preencheFlash(f); }, 30);
  });
  function flashes(alvo, lista) {
    if (!alvo) return;
    lista.forEach(function (a) {
      var bloco = el('div', 'flash-bloco');
      var cab = el('div', 'flash-cab');
      cab.appendChild(avatar(a, 'avatar mini-av'));
      var t = el('div');
      t.appendChild(el('h3', null, 'Flashes de ' + chama(a)));
      t.appendChild(el('p', null, a.flashesNota || ''));
      cab.appendChild(t);
      bloco.appendChild(cab);
      var grade = el('div', 'flash-grade');
      (a.flashes || []).forEach(function (f, i) {
        var c = el('article', 'flash');
        var b = el('button', 'flash-foto'); b.type = 'button'; b.setAttribute('aria-label', 'Ampliar: ' + f.titulo);
        var im = el('img'); im.src = f.src; im.alt = f.titulo; im.loading = 'lazy';
        b.appendChild(im);
        b.addEventListener('click', function () {
          amplia(a.flashes.map(function (x) { return { src: x.src, alt: x.titulo }; }), i);
        });
        c.appendChild(b);
        c.appendChild(el('span', 'flash-selo', f.selo || 'Disponível'));
        c.appendChild(el('h4', null, f.titulo));
        var q = el('button', 'btn btn-cheio mini', 'Quero esse flash'); q.type = 'button';
        q.addEventListener('click', function () { pedirFlash(a, f); });
        c.appendChild(q);
        grade.appendChild(c);
      });
      // sem flash no site: o destaque do Instagram é a vitrine oficial
      var ver = el('article', 'flash flash-mais');
      ver.appendChild(el('b', null, a.flashesDestaque || 'Mais flashes'));
      ver.appendChild(el('p', null, 'A lista atualizada fica no destaque do Instagram de ' + chama(a) + '.'));
      var l = el('a', 'btn btn-linha mini', 'Abrir @' + a.instagram);
      l.href = 'https://www.instagram.com/' + a.instagram + '/'; l.target = '_blank'; l.rel = 'noopener';
      ver.appendChild(l);
      grade.appendChild(ver);
      bloco.appendChild(grade);
      alvo.appendChild(bloco);
    });
  }
  flashes($('#flashes'), CFG.artistas.filter(function (a) { return a.flashes; }));

  /* ---- FAQ: abre um por vez ---- */
  $$('.faq details').forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) $$('.faq details').forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  /* ---- botão flutuante some quando o pedido já está na tela ---- */
  var flutua = $('.flutua'), agendar = $('#agendar');
  if (flutua) {
    var aVista = {};
    var atualiza = function () {
      flutua.hidden = window.scrollY < window.innerHeight * 0.8 ||
        Object.keys(aVista).some(function (k) { return aVista[k]; });
    };
    if ('IntersectionObserver' in window) {
      var olheiro = new IntersectionObserver(function (es) {
        es.forEach(function (e) { aVista[e.target.id || 'capa'] = e.isIntersecting; });
        atualiza();
      }, { threshold: 0.05 });
      if (agendar) olheiro.observe(agendar);
    }
    window.addEventListener('scroll', atualiza, { passive: true });
    atualiza();
  }

  /* ---- mapa (só com endereço confirmado) ---- */
  var mapa = $('#mapa');
  if (mapa && CFG.endereco && CFG.endereco.embed) {
    var ifr = el('iframe');
    ifr.src = CFG.endereco.embed; ifr.loading = 'lazy'; ifr.title = 'Mapa: ' + CFG.endereco.busca;
    ifr.referrerPolicy = 'no-referrer-when-downgrade';
    mapa.appendChild(ifr);
  }

  /* ---- página do artista ---- */
  var pagina = $('#artista-pagina');
  if (!pagina) return;
  var slug = new URLSearchParams(location.search).get('a');
  var a = slug && CFG.artistaPor(slug);
  if (!a) {
    $('#art-nao-achei').hidden = false;
    return;
  }
  document.title = a.nome + ' · ' + CFG.nome;
  pagina.setAttribute('data-frente', a.frente || 'tattoo');

  $('#art-foto').appendChild(avatar(a, 'avatar art-avatar'));
  if (a.capa) { var fundo = $('#art-fundo'); if (fundo) fundo.style.backgroundImage = 'url("' + a.capa + '")'; }
  $('#art-oficio').textContent = a.oficio || '';
  $('#art-nome').textContent = a.nome;
  var arroba = $('#art-arroba');
  arroba.textContent = '@' + a.instagram;
  arroba.href = 'https://www.instagram.com/' + a.instagram + '/';
  $('#art-linha').textContent = a.linha || '';
  if (a.destaque) { $('#art-destaque').textContent = a.destaque; $('#art-destaque').hidden = false; }
  var est = $('#art-estilos');
  (a.estilos || []).forEach(function (e) { est.appendChild(el('span', null, e)); });
  if (a.bio && a.bio.length) {
    var bio = $('#art-bio');
    a.bio.forEach(function (l) { bio.appendChild(el('li', null, l)); });
  } else $('#art-sobre').hidden = true;

  ['#art-pedir', '#art-pedir-2'].forEach(function (s) {
    var b = $(s); if (!b) return;
    b.textContent = rotuloPedir(a); b.href = linkAgendar(a);
  });
  var fl = $('#art-flutua');
  if (fl) { fl.href = linkAgendar(a); fl.textContent = rotuloPedir(a); }
  if (a.whatsappLink || a.whatsapp) {
    var z = el('a', 'btn btn-zap', 'WhatsApp de ' + chama(a));
    z.href = a.whatsappLink || ('https://wa.me/' + a.whatsapp); z.target = '_blank'; z.rel = 'noopener';
    $('#art-extras').appendChild(z);
  }

  var fotos = (a.fotos || []).slice();
  if (!fotos.length && a.galeriaCasa && CFG.galeriaBarbearia) {
    $('#art-port-titulo').textContent = 'No ' + CFG.nome;
    $('#art-port-nota').textContent = 'Fotos do perfil do clube. O portfólio de ' + chama(a) + ' entra aqui quando chegar.';
    fotos = CFG.galeriaBarbearia;
  } else {
    $('#art-port-titulo').textContent = 'Portfólio de ' + chama(a);
    if (a.portfolioNota) $('#art-port-nota').textContent = a.portfolioNota;
  }
  var mais = $('#art-mais');
  if (fotos.length) {
    mural($('#art-portfolio'), fotos);
    mais.href = 'https://www.instagram.com/' + a.instagram + '/';
    mais.textContent = 'Ver mais no @' + a.instagram;
  } else {
    $('#art-portfolio').hidden = true; mais.hidden = true;
    var vazio = $('#art-sem-fotos');
    vazio.querySelector('p').textContent = 'As peças de ' + chama(a) + ' entram aqui em breve.';
    vazio.hidden = false;
  }

  if (a.flashes && $('#art-flashes')) {
    flashes($('#art-flashes'), [a]);
    $('#art-flashes-sec').hidden = false;
  }

  pintaEquipe($('#lista-outros'), null, a.slug);

  var comp = $('#art-compartilhar'), saida = $('#art-compartilhado');
  comp.addEventListener('click', function () {
    var url = location.origin + location.pathname + '?a=' + a.slug;
    if (navigator.share) {
      navigator.share({ title: a.nome + ' · ' + CFG.nome, url: url }).catch(function () {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(function () { saida.textContent = 'Link copiado.'; },
        function () { saida.textContent = url; });
    } else { saida.textContent = url; }
  });
  pagina.hidden = false;
})();
