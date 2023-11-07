
document.getElementById('get-inventory').addEventListener('click', getInventory);
document.getElementById('additem').addEventListener('click', addInventory);
getInventory();
function getInventory(){
    fetch("/api/parts")
    .then(res => res.json()
    .then(data => {
        console.log(data);
        const l = document.getElementById('inventory');
        while (l.firstChild) {
            l.removeChild(l.firstChild);
        }
        data.forEach(e =>{
            const item = document.createElement('li');
            item.appendChild(document.createTextNode(`${e.name} (${e.choice}) Qty: ${e.stock}`));
            l.appendChild(item);
        });
    })
    )
}
function addInventory() {

        const nextpart = {
        name: document.getElementById('name').value,
        choice:document.getElementById('choice').value,
        stock: document.getElementById('stock').value
    }
    console.log(nextpart);

    fetch('/api/parts', {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify(nextpart)
    })
    .then(res => {
        if (res.ok) {
        res.json()
        .then(data => {
            console.log(data);
            getInventory();
            document.getElementById('status').innerText = `Created part ${data.id}: ${data.name}`;
        })
        .catch(err => console.log('Failed to get json object'))
        }
        else {
          console.log('Error: ', res.status);
          document.getElementById('status').innerText = 'Failed to add item';
      
        }
    })
    .catch()
}
