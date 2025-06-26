// Script de Back Redirect Universal
// Funciona em smartphones e desktops

(function() {
    'use strict';
    
    // URL para onde redirecionar quando o usuário tentar voltar
    const REDIRECT_URL = 'https://chat-whatsapp.clubesecreto.club/clubesecreto?id=19.70&redirect=https://chat.secretoclube.com/chamada'; // Altere para sua URL
    
    // Configurações
    const config = {
        enableMobile: true,
        enableDesktop: true,
        delay: 100, // Delay em ms antes de ativar
        debugMode: false // Ative para ver logs no console
    };
    
    // Detecta se é dispositivo móvel
    function isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               (window.matchMedia && window.matchMedia('(max-width: 768px)').matches);
    }
    
    // Verifica se deve executar baseado no dispositivo
    function shouldExecute() {
        const mobile = isMobile();
        return (mobile && config.enableMobile) || (!mobile && config.enableDesktop);
    }
    
    // Função principal de back redirect
    function initBackRedirect() {
        if (!shouldExecute()) {
            if (config.debugMode) console.log('Back redirect não executado para este dispositivo');
            return;
        }
        
        // Adiciona entrada no histórico
        history.pushState(null, '', window.location.href);
        
        // Listener para o evento popstate (botão voltar)
        window.addEventListener('popstate', function(e) {
            if (config.debugMode) console.log('Botão voltar detectado');
            
            // Previne o comportamento padrão
            history.pushState(null, '', window.location.href);
            
            // Redireciona para a URL especificada
            window.location.href = REDIRECT_URL;
        });
        
        // Método alternativo para mobile (alguns navegadores)
        if (isMobile()) {
            // Detecta gestos de swipe para voltar
            let touchStartX = 0;
            
            document.addEventListener('touchstart', function(e) {
                touchStartX = e.touches[0].clientX;
            });
            
            document.addEventListener('touchend', function(e) {
                const touchEndX = e.changedTouches[0].clientX;
                const swipeThreshold = 50;
                
                // Swipe da esquerda para direita (gesto de voltar)
                if (touchEndX - touchStartX > swipeThreshold && touchStartX < 20) {
                    if (config.debugMode) console.log('Gesto de voltar detectado');
                    e.preventDefault();
                    window.location.href = REDIRECT_URL;
                }
            });
        }
        
        // Previne o uso de teclas de atalho para voltar
        document.addEventListener('keydown', function(e) {
            // Alt + Seta Esquerda ou Backspace
            if ((e.altKey && e.keyCode === 37) || (e.keyCode === 8 && !isInputElement(e.target))) {
                e.preventDefault();
                window.location.href = REDIRECT_URL;
            }
        });
        
        if (config.debugMode) console.log('Back redirect iniciado com sucesso');
    }
    
    // Verifica se o elemento é um campo de entrada
    function isInputElement(element) {
        const inputTags = ['INPUT', 'TEXTAREA', 'SELECT'];
        return inputTags.includes(element.tagName) || element.contentEditable === 'true';
    }
    
    // Inicializa após o carregamento da página
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(initBackRedirect, config.delay);
        });
    } else {
        setTimeout(initBackRedirect, config.delay);
    }
    
    // API pública (opcional)
    window.BackRedirect = {
        setURL: function(url) {
            REDIRECT_URL = url;
        },
        enable: function() {
            config.enableMobile = true;
            config.enableDesktop = true;
            initBackRedirect();
        },
        disable: function() {
            config.enableMobile = false;
            config.enableDesktop = false;
        }
    };
    
})();

// Exemplo de uso com confirmação (opcional)
/*
(function() {
    const originalRedirect = window.location.href;
    
    window.addEventListener('popstate', function(e) {
        if (confirm('Tem certeza que deseja sair? Você pode perder uma oferta especial!')) {
            history.back();
        } else {
            history.pushState(null, '', originalRedirect);
            window.location.href = 'https://exemplo.com/oferta-especial';
        }
    });
})();
*/
