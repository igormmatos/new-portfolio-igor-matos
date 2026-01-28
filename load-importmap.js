(function() {
  // 1. Remove ImportMaps injetados automaticamente pelo ambiente (ex: React 19 do Google AI Studio)
  const existingMap = document.querySelector('script[type="importmap"]');
  if (existingMap) {
    console.warn('🔧 Importmap existente detectado e removido para garantir versões corretas.');
    existingMap.remove();
  }

  // 2. Busca e injeta o nosso ImportMap oficial (React 18)
  fetch('/importmap.json')
    .then(r => r.json())
    .then(mapData => {
      const script = document.createElement('script');
      script.type = 'importmap';
      script.textContent = JSON.stringify(mapData, null, 2);

      // 3. Insere como PRIMEIRO elemento do head para garantir prioridade
      if (document.head.firstChild) {
        document.head.insertBefore(script, document.head.firstChild);
      } else {
        document.head.appendChild(script);
      }

      console.log('✅ Importmap customizado (React 18) carregado com sucesso:', mapData);
    })
    .catch(err => {
      console.error('❌ Erro crítico ao carregar importmap.json:', err);
    });
})();