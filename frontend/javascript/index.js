const szavakBetolt = async () => {
    const response = await fetch('/api/szavak')
    const szavak = await response.json();

    const select = document.getElementById('szoSelect');
    select.innerHTML = '';


    for (let i = 0; i < szavak.length; i++)
    {
        const option = document.createElement('option');
        option.textContent = szavak[i];
        select.appendChild(option);
        
    }
}

szavakBetolt();

document.getElementById('szoForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const szo = document.getElementById('szoText').value.toLowerCase();

    if (szo === ''){
        return;
    }

    const response = await fetch('/api/szavak', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            szavak: szo
        })
    });

    const data = await response.json();
    document.getElementById('uzenet').textContent = data.message;
    document.getElementById('szoText').value = '';
    szavakBetolt();
});

document.getElementById('torlesButton').addEventListener('click', async() => {
    const szo = document.getElementById('szoSelect').value;

    if (szo === '')
    {
        return;
    }

    const response = await fetch('/api/szavakTorles', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            szavak: szo
        })
    })

    const data = await response.json();
    document.getElementById('uzenet').textContent = data.message;

    szavakBetolt();
});



