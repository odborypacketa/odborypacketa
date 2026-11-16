(() => {
  if (sessionStorage.getItem('zo-packeta-bozp-access-granted-v1') !== 'true') {
    window.location.replace('./');
  }
})();
