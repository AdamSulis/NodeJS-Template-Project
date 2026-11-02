
let vege = true;

const ujJatek = async () => {
    const response = await fetch('/api/ujJatek');
    const data = await response.json();

    document.getElementById('uzenet').textContent = '';
    document.getElementById('hibak').textContent = '';

    if (response.status === 400) {
        document.getElementById('szo').textContent = '';
        document.getElementById('uzenet').textContent = data.message;
        vege = true;
        return;
    }
    let megjelenit = '';

    for (let i = 0; i <data.hossz; i++)
    {
        megjelenit = megjelenit + '_ '
    }

    document.getElementById('szo').textContent = megjelenit;
    document.getElementById('hibak').textContent = 'Hibák: 0 / 6';
    vege = false;
};

ujJatek();


document.getElementById('tippForm').addEventListener('submit', async(event) =>{
    event.preventDefault();

    const betu = document.getElementById('betuText').value.toLowerCase();
    document.getElementById('betuText').value = '';

    if (vege || betu === '')
    {
        return;
    }
    const response = await fetch('/api/tipp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            betu: betu
        })
    })
    const data = await response.json();
document.getElementById('szo').textContent = data.megjelenit;
document.getElementById('hibak').textContent = 'Hibák: ' + data.hibak + ' / 6';

if (data.nyert) {
    document.getElementById('uzenet').textContent = 'Nyertél';
    vege = true;
}

if (data.vesztett) {
    document.getElementById('uzenet').textContent = 'Vesztettél';
    vege = true;
}
});

document.getElementById('ujJatekButton').addEventListener('click', () => {
    ujJatek();
})

