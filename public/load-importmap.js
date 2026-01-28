(async function() {
  // Remove qualquer importmap existente
  document.querySelectorAll('script[type="importmap"]').forEach(s => s.remove());

  try {
    // Carrega o importmap correto
    const response = await fetch('/importmap.json');
    const importMap = await response.json();

    const script = document.createElement('script');
    script.type = 'importmap';
    script.textContent = JSON.stringify(importMap, null, 2);
    script.setAttribute('data-custom', 'true');

    document.head.insertBefore(script, document.head.firstChild);
    console.log('✅ Importmap customizado (React 18) carregado com sucesso:', importMap);

    // Proteção: Bloqueia qualquer tentativa de adicionar outro importmap
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeName === 'SCRIPT' && 
              node.type === 'importmap' && 
              !node.hasAttribute('data-custom')) {
            console.warn('🛑 Bloqueando importmap indesejado');
            node.remove();
          }
        });
      });
    });

    observer.observe(document.head, { childList: true, subtree: true });
    console.log('🔒 Proteção de importmap ativada');

  } catch (error) {
    console.error('❌ Erro ao carregar importmap:', error);
  }
})();
