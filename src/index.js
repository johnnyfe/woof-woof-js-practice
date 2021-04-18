document.addEventListener("DOMContentLoaded", init)

const url=`http://localhost:3000/pups`
function init(){
    const filterDogs=document.getElementById("good-dog-filter")
    filterDogs.addEventListener('click', togglefilter)
    getPups().then(addPupsToBar)
}
function getPups () {
    return fetch (url)
    .then(resp=>resp.json())
    .catch(error=>console.log(error))
}
function getSinglePup(id){
    return fetch(url+`/${id}`)
    .then (res=>res.json())
    .catch(error=>console.log(error))
}

function createPupsSpan(pupObj){
    const dogBar=document.getElementById('dog-bar');
    const span=document.createElement('span');
    span.innerText=pupObj.name;
    span.style.height="100px"
    span.dataset.id=pupObj.id
    span.style.justifyContent="center";
    span.addEventListener('click', spanClick)
    dogBar.appendChild(span)
}
function addPupsToBar(pupArray, filter=false){
    const dogBar=document.getElementById('dog-bar');
    dogBar.innerHTML='';
    if (filter){
        pupArray.filter(dog=>dog.isGoodDog).forEach(addPupsToBar)
    }else{
        pupArray.forEach(createPupsSpan)
    }
}
function togglefilter(e){
    const filterDogs=document.getElementById("good-dog-filter")
    if(filterDogs.innerText.includes("OFF")){
        filterDogs.innerText="Filter good dogs: ON"
        updateDogBar()
    }
    else{
        filterDogs.innerText = "Filter good dogs: OFF"
        updateDogBar()
    }
}

function updateDogBar(){
    const filterDogs=document.getElementById("good-dog-filter")
    if(filterDogs.innerText.includes("OFF")){
        getPups().then(dogArray=> addPupsToBar(dogArray))
    }
    else{
        getPups().then(dogArray=> addPupsToBar(dogArray,true))
    }
}
function spanClick(e){
    getSinglePup(e.target.dataset.id)
    .then(createPupsInfo)
}

function createPupsInfo(pupObj){
    const div= document.getElementById('dog-info');
    const img=document.createElement('img')
    const h2=document.createElement('h2')
    const button=document.createElement('button')
    img.src=pupObj.image;
    img.alt="Dog Selected"
    h2.textContent=pupObj.name;
    button.innerText=pupObj.isGoodDog ? "Good Dog!" : "Bad Dog"
    button.dataset.id=pupObj.id
    button.addEventListener('click', clickOnGood)
    div.appendChild(img);
    div.appendChild(h2);
    div.appendChild(button); 
}
function clickOnGood (e){
    let value;
    if (e.target.innerText.includes("Good")){
        e.target.innerText = "Bad Dog"
        value = false
    }
    else {
        e.target.innerText = "Good Dog"
        value = true;
    }
    toggleGoodDog(e.target.dataset.id, newValue). then(updateDogBar)
}
function toggleGoodDog (id, value){
    const configObj={
            method: "PATCH",
            headers: {
              "content-type": "application/json"
            },
            body: JSON.stringify({
              isGoodDog: value
            })
    }
    return fetch(url+`/${id}`,configObj)
    .then (res=>res.json())
}