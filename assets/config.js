/* =====================================================================
   Original Clube — configuração
   Único arquivo que precisa ser editado para o site sair do modo de
   demonstração e entrar no ar de verdade.
   Fonte: Instagram @originalclube, @_lb.tattoo e @_lelistattoo (20/10/2026).
   ===================================================================== */

window.TV = {

  /* ---- Casa ---------------------------------------------------------- */
  nome:       'Original Clube',
  slogan:     'Barbearia e tatuagem · Salvador',
  assinatura: 'Altas doses de autoestima',
  instagram:  'originalclube',
  prefixoDemo: 'oc_',   // chaves da demo no navegador (agenda.js e admin.js usam o mesmo prefixo)
  logo:       'fotos/logo.jpg',

  // WhatsApp da casa: desconhecido (A CONFIRMAR). Os tatuadores têm link de
  // mensagem próprio (wa.me/message/...): o resumo é copiado e o link abre a conversa.
  whatsapp:        '',
  whatsappVisivel: '',
  whatsappLink:    '',

  // Agendamento que a barbearia usa hoje (bio do Instagram)
  linkMaapp: 'https://online.maapp.com.br/OriginalClube',

  // Endereço: NÃO ACHADO no Instagram (A CONFIRMAR). Sem endereço, o site não mostra mapa.
  endereco: {
    linha1: '',
    linha2: 'Salvador — BA',
    referencia: '',
    maps:   '',
    embed:  '',
    busca:  'Original Clube, Salvador - BA'
  },
  // A CONFIRMAR: a agenda da demo usa segunda a sábado, 9h às 19h, só para funcionar.
  funcionamento: '',

  supabaseUrl: '',
  supabaseKey: '',

  /* ---- Regras da agenda (espelham o db/schema.sql) ---------------- */
  regras: {
    passoMin:        30,
    antecedenciaMin: 30,
    janelaDias:      30,
    cancelamentoH:   2
  },

  // true mostra "Sem preferência" na escolha (útil na barbearia)
  semPreferencia: false,

  /* ---- Expediente (0 = domingo) — PROVISÓRIO, A CONFIRMAR ---------- */
  expediente: {
    0: { aberto: false },
    1: { aberto: true, abre: '09:00', fecha: '19:00' },
    2: { aberto: true, abre: '09:00', fecha: '19:00' },
    3: { aberto: true, abre: '09:00', fecha: '19:00' },
    4: { aberto: true, abre: '09:00', fecha: '19:00' },
    5: { aberto: true, abre: '09:00', fecha: '19:00' },
    6: { aberto: true, abre: '09:00', fecha: '19:00' }
  },

  // serviços sem projeto (barbearia): o que o campo livre pergunta
  semProjeto: {
    rotulo: 'Algum detalhe do corte?',
    placeholder: 'Ex: degradê baixo, barba desenhada, trazer foto de referência na conversa',
    prefixo: 'Barbearia',
    preco: 'Preço a confirmar'
  },

  // painel: a segunda frente da casa e o cartão de vaga (post "Estamos contratando barbeiro")
  painel: {
    b: 'Barbearia',
    vaga: { titulo: 'Estamos contratando barbeiro', texto: 'O clube divulgou vaga para barbeiro no Instagram. Quem entrar aparece nesta lista com agenda, filtro e link próprios.' }
  },

  /* ---- Equipe (páginas artista.html?a=<slug>) -----------------------
     Só o que está no Instagram. Ordem = ordem em todo o site e no painel.
     frente: 'tattoo' ou 'barbearia'.
  ------------------------------------------------------------------ */
  artistas: [
    {
      slug: 'lb', nome: 'LB Tattoo', apelido: 'LB', instagram: '_lb.tattoo', whatsapp: '',
      whatsappLink: 'https://wa.me/message/3TVQJ3632Z7YE1',
      frente: 'tattoo', foto: 'fotos/lb-perfil.jpg', capa: 'fotos/lb-1.jpg',
      oficio: 'Tatuador',
      linha: 'Realismo preto e cinza & fine line',
      estilos: ['Realismo preto e cinza', 'Fine line', 'Fechamentos', 'Costas inteiras', 'Delicadas'],
      destaque: '13,3 mil seguidores no @_lb.tattoo',
      bio: [
        'Tatuador do Original Clube, em Salvador.',
        'Realismo em preto e cinza e fine line.',
        'Projetos grandes: costas inteiras, fechamento de braço e peito.',
        'Também dá mentorias para tatuadores.'
      ],
      fotos: [
        { src: 'fotos/lb-1.jpg', alt: 'Leão realista nas costas, preto e cinza' },
        { src: 'fotos/lb-5.jpg', alt: 'Tigre realista ocupando as costas' },
        { src: 'fotos/lb-4.jpg', alt: 'Santa Ceia no peito, preto e cinza' },
        { src: 'fotos/lb-2.jpg', alt: 'Medusa com serpente na coxa' },
        { src: 'fotos/lb-3.jpg', alt: 'Fechamento de braço com leão e bússola' },
        { src: 'fotos/lb-9.jpg', alt: 'Onça nas costas, realismo' },
        { src: 'fotos/lb-8.jpg', alt: 'Dragão com flores nas costas' },
        { src: 'fotos/lb-6.jpg', alt: 'Floral fine line descendo pela coluna' },
        { src: 'fotos/lb-7.jpg', alt: 'Lírios em fine line nas costas' }
      ]
    },
    {
      slug: 'lelis', nome: 'Rodrigo Lelis', apelido: 'Lelis', instagram: '_lelistattoo', whatsapp: '',
      whatsappLink: 'https://wa.me/message/EM26RIF5YFAFD1',
      frente: 'tattoo', foto: 'fotos/lelis-perfil.jpg', capa: 'fotos/lelis-2.jpg',
      oficio: 'Tatuador',
      linha: 'Fineline · Realismo · Blackwork',
      estilos: ['Fineline', 'Realismo', 'Blackwork', 'Lettering'],
      destaque: 'Já atendeu em Brasília · workshop',
      bio: [
        'Rodrigo Lelis, tatuador no Original Clube, em Salvador.',
        'Fineline, realismo e blackwork.',
        'Já atendeu em Brasília.',
        'Dá workshop de tatuagem.'
      ],
      fotos: [
        { src: 'fotos/lelis-1.jpg', alt: 'Leão realista no antebraço' },
        { src: 'fotos/lelis-2.jpg', alt: 'Leão com flores no braço' },
        { src: 'fotos/lelis-3.jpg', alt: 'Jesus com coroa de espinhos no ombro' },
        { src: 'fotos/lelis-4.jpg', alt: 'Lobo realista no braço' },
        { src: 'fotos/lelis-5.jpg', alt: 'Retrato com flores em fineline' },
        { src: 'fotos/lelis-6.jpg', alt: 'Antebraço em realismo preto e cinza' },
        { src: 'fotos/lelis-7.jpg', alt: 'Lettering com detalhe em vermelho no antebraço' }
      ]
    },
    {
      // Sem foto de rosto nem bio no material coletado: A CONFIRMAR.
      slug: 'lucas', nome: 'Lucas Marques', apelido: 'Lucas', instagram: 'lucasmarquessss_', whatsapp: '',
      frente: 'barbearia', foto: '', capa: 'fotos/barba-7.jpg',
      oficio: 'Barbeiro',
      linha: 'Barbeiro do Original Clube',
      estilos: ['Corte', 'Barba'],
      bio: ['Barbeiro do Original Clube.'],
      galeriaCasa: true,
      fotos: []
    },
    {
      slug: 'agatha', nome: 'Agatha', apelido: 'Agatha', instagram: 'agatha_barbergirl', whatsapp: '',
      frente: 'barbearia', foto: '', capa: 'fotos/barba-9.jpg',
      oficio: 'Barbeira',
      linha: 'Barbeira do Original Clube',
      estilos: ['Corte', 'Barba'],
      bio: ['Barbeira do Original Clube.'],
      galeriaCasa: true,
      fotos: []
    }
  ],

  // Fotos do perfil do clube (barbearia). Não dá para saber quem fez cada corte.
  galeriaBarbearia: [
    { src: 'fotos/barba-1.jpg', alt: 'Cliente sorrindo depois do corte' },
    { src: 'fotos/barba-2.jpg', alt: 'Acabamento na máquina' },
    { src: 'fotos/barba-3.jpg', alt: 'Degradê em cabelo crespo' },
    { src: 'fotos/barba-4.jpg', alt: 'Barba desenhada na máquina' },
    { src: 'fotos/barba-5.jpg', alt: 'Escova no acabamento do degradê' },
    { src: 'fotos/barba-6.jpg', alt: 'Barba na navalha' },
    { src: 'fotos/barba-7.jpg', alt: 'Corte no clube' },
    { src: 'fotos/barba-8.jpg', alt: 'Barbeiro e cliente no clube' },
    { src: 'fotos/barba-9.jpg', alt: 'Corte na tesoura' },
    { src: 'fotos/barba-trancas.jpg', alt: 'Tranças, com a parede "Altas doses de autoestima" ao fundo' }
  ],

  // Tatuagem: sempre sob orçamento. Barbearia: preço A CONFIRMAR (preco 0 = "preço a confirmar").
  // Durações A CONFIRMAR: servem só para reservar o tempo na agenda.
  servicosDemo: [
    { id:'orcamento',      nome:'Conversa de orçamento', descricao:'30 min para ver a ideia, o local e o tamanho, e fechar valor e data.', preco_centavos:0, a_partir_de:false, duracao_min:30,  categoria:'Tatuagem', apenas_barbeiros:['lb','lelis'] },
    { id:'sessao-pequena', nome:'Sessão pequena',        descricao:'Peças menores e delicadas, até uns 10 cm.',                           preco_centavos:0, a_partir_de:false, duracao_min:120, categoria:'Tatuagem', apenas_barbeiros:['lb','lelis'] },
    { id:'sessao-media',   nome:'Sessão média',          descricao:'Antebraço, panturrilha, ombro: peças com mais detalhe.',              preco_centavos:0, a_partir_de:false, duracao_min:240, categoria:'Tatuagem', apenas_barbeiros:['lb','lelis'] },
    { id:'sessao-longa',   nome:'Sessão longa',          descricao:'Boa parte do dia para fechamentos, costas e peito.',                  preco_centavos:0, a_partir_de:false, duracao_min:360, categoria:'Tatuagem', apenas_barbeiros:['lb','lelis'] },
    { id:'retoque',        nome:'Retoque',               descricao:'Para tattoo já cicatrizada que precisa de reforço.',                  preco_centavos:0, a_partir_de:false, duracao_min:60,  categoria:'Tatuagem', apenas_barbeiros:['lb','lelis'] },
    { id:'corte',          nome:'Corte',                 descricao:'Corte na máquina e na tesoura.',                                      preco_centavos:0, a_partir_de:false, duracao_min:40,  categoria:'Barbearia', apenas_barbeiros:['lucas','agatha'], sem_projeto:true },
    { id:'barba',          nome:'Barba',                 descricao:'Barba desenhada e acabamento.',                                       preco_centavos:0, a_partir_de:false, duracao_min:30,  categoria:'Barbearia', apenas_barbeiros:['lucas','agatha'], sem_projeto:true },
    { id:'corte-barba',    nome:'Corte + barba',         descricao:'Os dois no mesmo horário.',                                           preco_centavos:0, a_partir_de:false, duracao_min:60,  categoria:'Barbearia', apenas_barbeiros:['lucas','agatha'], sem_projeto:true }
  ],

  /* ---- Estilos do pedido de tatuagem (bios do LB e do Lelis) ------- */
  estilos: ['Realismo preto e cinza', 'Fine line', 'Blackwork', 'Lettering', 'Fechamento', 'Trago meu desenho', 'Ainda não sei']
};

window.TV.barbeirosDemo = window.TV.artistas.map(function (a) {
  return { id: a.slug, slug: a.slug, nome: a.nome, foto: a.foto, instagram: a.instagram,
           whatsapp: a.whatsapp, cargo: a.linha };
});
window.TV.artistaPor = function (chave) {
  return window.TV.artistas.filter(function (a) {
    return a.slug === chave || a.nome === chave || a.instagram === chave;
  })[0] || null;
};
window.TV.modoDemo = !(window.TV.supabaseUrl && window.TV.supabaseKey);
