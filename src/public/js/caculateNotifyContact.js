function increaseNumberNotifyContact(className){
    let currentValue = +$(`.${className}`).find("em").text();
    currentValue++;
    if(currentValue === 0){
        $(`.${className}`).html(null);
    }
    else{
        $(`.${className}`).html(`(<em>${currentValue}</em> )`);
    }
}

function decreaseNumberNotifyContact(className){
    let currentValue = +$(`.${className}`).find("em").text();
    currentValue--;
    if(currentValue === 0){
        $(`.${className}`).html(null);
    }
    else{
        $(`.${className}`).html(`(<em>${currentValue}</em> )`);
    }
}
