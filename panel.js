document.querySelector('button').addEventListener('click', async () => {
  // Fetch a third party URL.
  const url = document.querySelector('input[type="text"]').value;
  await fetch(url, { credentials: 'include' });
});
