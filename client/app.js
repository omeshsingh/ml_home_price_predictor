document.querySelectorAll('.option').forEach(button => {
    button.addEventListener('click', () => {
        const siblings = button.parentNode.querySelectorAll('.option');
        siblings.forEach(sib => sib.classList.remove('active'));
        button.classList.add('active');
    });
});

function onClickedEstimatePrice() {
    const sqft = document.getElementById("uiSqft").value;
    const bhk = document.querySelector("#uiBHK .option.active")?.dataset.value;
    const bathrooms = document.querySelector("#uiBathrooms .option.active")?.dataset.value;
    const location = document.getElementById("uiLocations").value;

    if (!sqft || !bhk || !bathrooms || !location) {
        alert("Please fill all the fields!");
        return;
    }
    var url="api/predict_home_price"    
    // fetch('http://127.0.0.1:5000/predict_home_price', 
    fetch(url,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            total_sqft: parseFloat(sqft),
            bhk: parseInt(bhk),
            bath: parseInt(bathrooms),
            location: location
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const priceElement = document.getElementById("uiEstimatedPrice");
        priceElement.innerText = `Estimated Price in lakh rupees:${data.estimated_price.toLocaleString()}`;
        priceElement.style.display = "block"; 
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Failed to fetch estimated price. Please try again.");
    });
}

function onPageLoad() {
    // Fetch location names from backend
    var url1="api/get_location_names"
    // fetch('http://127.0.0.1:5000/get_location_names')
    fetch(url1)
        .then(response => response.json())
        .then(data => {
            const locations = data.locations;
            const uiLocations = document.getElementById("uiLocations");
            uiLocations.innerHTML = '';
            locations.forEach(location => {
                const opt = document.createElement('option');
                opt.value = location;
                opt.innerText = location;
                uiLocations.appendChild(opt);
            });
        })
        .catch(error => {
            console.error('Error fetching locations:', error);
        });
}

window.onload = onPageLoad;
