const szavakBetolt = async () => {
    const response = await fetch('/api/szavak')
    const szavak = await response.json();

    const select = document.getElementById('SelectId');
    select.innerHTML = '';


    for (let i = 0; i < szavak.length; i++)
    {
        const option = document.createElement('option');
        option.textContent = szavak[i];
        select.appendChild('option');
        
    }
}

szavakBetolt();

document.getElementById('')


