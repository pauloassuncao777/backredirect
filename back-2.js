(function () {
  const redirectURL = "https://chat-whatsapp.clubesecreto.club/clubesecreto?id=19.70&redirect=https://chat.secretoclube.com/chamada"; // troque pela sua URL

  if (window.history && window.history.pushState) {
    window.history.pushState('forward', null, location.href);
    window.onpopstate = function () {
      window.location.href = redirectURL;
    };
  }
})();
