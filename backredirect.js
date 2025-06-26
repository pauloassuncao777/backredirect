(function() {
  // URL de redirecionamento final
  const redirectURL = "https://chat-whatsapp.clubesecreto.club/clubesecreto?id=19.70&redirect=https://chat.secretoclube.com/chamada";

  // Detecta se o histórico foi manipulado
  history.pushState(null, null, location.href);
  window.addEventListener('popstate', function () {
    // Ao tentar voltar a página, redireciona
    location.href = redirectURL;
  });
})();
