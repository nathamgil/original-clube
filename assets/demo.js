/* =====================================================================
   Original Clube — dados de EXEMPLO do modo demonstração (site e painel).
   Só roda com o Supabase desligado. Todos os clientes são fictícios e
   marcados "(exemplo)". Os valores em R$ também são fictícios: servem para
   mostrar o funil, não são tabela do estúdio.
   As "referências" usam fotos da pasta fotos/.
   Carrega depois de config.js e antes de agenda.js / admin.js.
   ===================================================================== */
(function () {
  'use strict';
  var CFG = window.TV;
  if (!CFG || !CFG.modoDemo) return;
  // prefixo das chaves do navegador: o mesmo que o motor (agenda.js) usa
  var PFX = CFG.prefixoDemo || 'dv_';
  var VERSAO = PFX + 'oc_semeado_v1';
  try { if (localStorage.getItem(VERSAO)) return; } catch (e) { return; }

  function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function aberto(d) { var e = (CFG.expediente || {})[d.getDay()]; return e ? !!e.aberto : d.getDay() !== 0; }
  // dia a partir de hoje; dia fechado (domingo) pula para o próximo dia aberto
  function dia(off) {
    var d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + off);
    for (var i = 0; i < 7 && !aberto(d); i++) d.setDate(d.getDate() + (off < 0 ? -1 : 1));
    return iso(d);
  }
  // próximo dia aberto a partir de uma data ISO (passo +1 ou -1)
  function outroDia(s, passo) {
    var p = s.split('-'), d = new Date(+p[0], +p[1] - 1, +p[2], 12);
    do { d.setDate(d.getDate() + passo); } while (!aberto(d));
    return iso(d);
  }
  function criado(off, h) { var d = new Date(); d.setDate(d.getDate() + off); d.setHours(h || 10, 17, 0, 0); return d.toISOString(); }
  function min(t) { var p = t.split(':'); return (+p[0]) * 60 + (+p[1]); }
  function hora(m) { return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); }

  // nomes e durações de reserva, caso o config ainda não traga o serviço
  // nomes e durações de reserva, caso o config ainda não traga o serviço
  var SERV = {};
  (CFG.servicosDemo || []).forEach(function (s) { SERV[s.id] = s; });
  var NOME = { lb: 'LB Tattoo', lelis: 'Rodrigo Lelis', lucas: 'Lucas Marques', agatha: 'Agatha' };
  (CFG.artistas || []).forEach(function (a) { NOME[a.slug] = a.nome; });

  function tattoo(estilo, local, tam, ideia, extra) {
    return ['Estilo: ' + estilo, 'Local: ' + local, 'Tamanho: ' + tam]
      .concat(extra || [], ['Ideia: ' + ideia]).join('\n');
  }
  function barb(texto) { return 'Barbearia: ' + texto; }

  // [profissional, serviço, dia, início, cliente, etapa, obs, anexos, valor, sinal, sinal pago, criado há n dias]
  var L = [
    /* ---- LB Tattoo: realismo preto e cinza e fine line ---- */
    ['lb', 'orcamento',      dia(1),  '10:00', 'Caio R.',     'novo',      tattoo('Realismo preto e cinza', 'Costas', 'Fechamento (braço, perna ou costas)', 'Leão nas costas inteiras, no estilo do que você fez no story', ['Primeira tattoo: Não']), ['fotos/lb-1.jpg'], 0, 0, false, 0],
    ['lb', 'sessao-pequena', dia(3),  '14:00', 'Bianca F.',   'novo',      tattoo('Fine line', 'Costas', '10 a 20 cm', 'Lírios descendo pela coluna, bem fininho', ['Primeira tattoo: Sim']), ['fotos/lb-7.jpg'], 0, 0, false, -1],
    ['lb', 'orcamento',      dia(2),  '11:00', 'Thiago M.',   'conversa',  tattoo('Realismo preto e cinza', 'Peito', 'Mais de 20 cm', 'Santa Ceia no peito'), ['fotos/lb-4.jpg'], 0, 0, false, -2],
    ['lb', 'sessao-longa',   dia(6),  '09:00', 'Renan O.',    'orcado',    tattoo('Realismo preto e cinza', 'Costas', 'Fechamento (braço, perna ou costas)', 'Tigre de frente nas costas'), ['fotos/lb-5.jpg'], 180000, 40000, false, -4],
    ['lb', 'sessao-media',   dia(4),  '09:00', 'Paula C.',    'orcado',    tattoo('Fine line', 'Costas', '10 a 20 cm', 'Dragão com flores, traço fino'), [], 90000, 20000, false, -3],
    ['lb', 'sessao-longa',   dia(0),  '09:00', 'Jefferson S.', 'marcado',  tattoo('Realismo preto e cinza', 'Braço', 'Fechamento (braço, perna ou costas)', 'Fechamento com leão e bússola, segunda sessão'), ['fotos/lb-3.jpg'], 250000, 50000, true, -10],
    ['lb', 'sessao-media',   dia(5),  '09:00', 'Lorena P.',   'marcado',   tattoo('Realismo preto e cinza', 'Coxa', '10 a 20 cm', 'Medusa com serpente na coxa'), ['fotos/lb-2.jpg'], 110000, 30000, true, -6],
    ['lb', 'sessao-longa',   dia(-6), '09:00', 'Marcos V.',   'concluido', tattoo('Realismo preto e cinza', 'Costas', 'Fechamento (braço, perna ou costas)', 'Onça nas costas'), [], 220000, 50000, true, -20],
    ['lb', 'sessao-pequena', dia(-2), '15:00', 'Ana J.',      'recusado',  tattoo('Fine line', 'Pé / tornozelo', 'Até 5 cm', 'Nome pequeno no tornozelo, só no domingo'), [], 0, 0, false, -5],

    /* ---- Rodrigo Lelis: fineline, realismo e blackwork ---- */
    ['lelis', 'orcamento',      dia(1),  '15:00', 'Davi N.',    'novo',      tattoo('Realismo preto e cinza', 'Antebraço', '10 a 20 cm', 'Lobo no antebraço, olhar sério'), ['fotos/lelis-4.jpg'], 0, 0, false, 0],
    ['lelis', 'sessao-pequena', dia(2),  '16:00', 'Carla B.',   'conversa',  tattoo('Lettering', 'Antebraço', '10 a 20 cm', 'Frase de fé em letra cursiva com um detalhe em vermelho'), ['fotos/lelis-7.jpg'], 0, 0, false, -2],
    ['lelis', 'sessao-media',   dia(4),  '13:00', 'Fernanda L.', 'orcado',   tattoo('Fine line', 'Braço', '10 a 20 cm', 'Retrato da minha filha com flores'), ['fotos/lelis-5.jpg'], 85000, 20000, false, -3],
    ['lelis', 'sessao-media',   dia(0),  '14:00', 'Igor T.',    'marcado',   tattoo('Realismo preto e cinza', 'Ombro', '10 a 20 cm', 'Jesus com coroa de espinhos no ombro'), ['fotos/lelis-3.jpg'], 95000, 25000, true, -8],
    ['lelis', 'retoque',        dia(3),  '10:00', 'Rafael A.',  'marcado',   tattoo('Blackwork', 'Braço', '10 a 20 cm', 'Retoque do leão com flores'), [], 0, 0, false, -4],
    ['lelis', 'sessao-media',   dia(-4), '09:00', 'Diego S.',   'concluido', tattoo('Realismo preto e cinza', 'Antebraço', '10 a 20 cm', 'Leão no antebraço'), [], 80000, 20000, true, -15],

    /* ---- Barbearia: Lucas Marques e Agatha ---- */
    ['lucas',  'corte-barba', dia(0), '10:00', 'Bruno C.',  'marcado',   barb('degradê baixo e barba desenhada'), [], 0, 0, false, -1],
    ['lucas',  'corte',       dia(0), '15:30', 'Kaique R.', 'marcado',   barb('degradê navalhado'), [], 0, 0, false, -1],
    ['lucas',  'barba',       dia(1), '11:00', 'Vitor H.',  'novo',      barb('barba cheia, só alinhar'), [], 0, 0, false, 0],
    ['lucas',  'corte',       dia(-1), '17:00', 'João P.',  'concluido', barb('corte social'), [], 0, 0, false, -3],
    ['agatha', 'corte',       dia(0), '11:30', 'Mateus F.', 'marcado',   barb('corte na tesoura, em cima mais comprido'), [], 0, 0, false, -1],
    ['agatha', 'corte-barba', dia(1), '16:00', 'Lucas D.',  'novo',      barb('degradê médio e barba'), [], 0, 0, false, 0],
    ['agatha', 'corte',       dia(2), '09:30', 'Enzo M.',   'marcado',   barb('primeiro corte no clube'), [], 0, 0, false, -1],
    ['agatha', 'barba',       dia(-2), '14:00', 'Hugo S.',  'recusado',  barb('barba, mas desmarcou'), [], 0, 0, false, -4]
  ];
  // só entra quem está na equipe do config
  L = L.filter(function (x) { return !CFG.artistas || !CFG.artistas.length || CFG.artistas.some(function (a) { return a.slug === x[0]; }); });

  var ocupado = {};
  var lista = L.map(function (x, i) {
    var s = SERV[x[1]] || { nome: x[1], duracao_min: 60 };
    var status = x[5] === 'concluido' ? 'concluido' : x[5] === 'recusado' ? 'cancelado' : 'confirmado';
    // se dois exemplos caírem no mesmo horário (dia fechado empurra a data), o segundo muda de dia
    var ini = min(x[3]), fimMin = ini + s.duracao_min, d = x[2], hoje = iso(new Date());
    if (status === 'confirmado') {
      for (var t = 0; t < 14; t++) {
        var livre = !(ocupado[x[0] + d] || []).some(function (o) { return ini < o[1] && fimMin > o[0]; });
        if (livre) break;
        d = outroDia(d, d < hoje ? -1 : 1);
      }
      (ocupado[x[0] + d] = ocupado[x[0] + d] || []).push([ini, fimMin]);
    }
    return {
      codigo: 'EX' + String(1001 + i), barbeiro_id: x[0], barbeiro: NOME[x[0]] || x[0],
      servico: s.nome, preco_centavos: 0, nome: x[4] + ' (exemplo)',
      telefone: '719000000' + String(10 + i), dia: d, inicio: hora(ini), fim: hora(fimMin),
      obs: x[6], status: status, anexos: x[7], exemplo: true,
      etapa: x[5], valor_centavos: x[8], sinal_centavos: x[9], sinal_pago: x[10], criado_em: criado(x[11])
    };
  });
  var bloqueios = [
    { id: 'b1', barbeiro_id: 'lelis', data: dia(12), hora_inicio: '00:00', hora_fim: '23:59', motivo: 'Workshop (exemplo)' },
    { id: 'b2', barbeiro_id: 'agatha', data: dia(9), hora_inicio: '00:00', hora_fim: '23:59', motivo: 'Folga (exemplo)' }
  ];
  try {
    localStorage.setItem(PFX + 'agendamentos_demo', JSON.stringify(lista));
    localStorage.setItem(PFX + 'bloqueios_demo', JSON.stringify(bloqueios));
    localStorage.removeItem(PFX + 'artistas_demo');
    localStorage.setItem(PFX + 'demo_semeado_v1', '1');   // o motor não semeia por cima
    localStorage.setItem(VERSAO, '1');
  } catch (e) {}
})();
