let currentHex = '';

document.getElementById('pickBtn').addEventListener('click', async () => {
  if (!('EyeDropper' in window)) {
    document.getElementById('result').innerText = "EyeDropper API not supported.";
    return;
  }

  const eyeDropper = new EyeDropper();

  try {
    const result = await eyeDropper.open();
    currentHex = result.sRGBHex;

    // Display the color info
    document.getElementById('result').innerText = currentHex;
    document.getElementById('preview').style.backgroundColor = currentHex;

    // Show the copy button and reset its label
    const copyBtn = document.getElementById('copyBtn');
    copyBtn.style.display = 'block';
    copyBtn.innerText = 'Copy HEX';
  } catch (e) {
    console.log("User canceled color selection.");
  }
});

document.getElementById('copyBtn').addEventListener('click', async () => {
  if (currentHex) {
    await navigator.clipboard.writeText(currentHex);
    document.getElementById('copyBtn').innerText = 'Copied!';
  }
});