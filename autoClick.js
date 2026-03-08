(function(){

'use strict';

console.log("🚀 Auto Button Engine Loaded");

/* ================= FIND BUTTON ================= */

function findContinueButton(){

    const buttons = document.querySelectorAll("button,a");

    for(const btn of buttons){

        const text = btn.innerText
        .replace(/\s+/g," ")
        .trim()
        .toUpperCase();

        if(
            text.includes("NHẤN ĐỂ TIẾP TỤC") ||
            text.includes("LẤY MÃ") ||
            text.includes("LINK GỐC") ||
            text.includes("GET LINK") ||
            text.includes("CONTINUE")
        ){
            return btn;
        }

    }

    return null;
}

/* ================= REAL CLICK ================= */

function realClick(el){

    if(!el) return;

    el.dispatchEvent(new MouseEvent("mouseover",{bubbles:true}));
    el.dispatchEvent(new MouseEvent("mousedown",{bubbles:true}));
    el.dispatchEvent(new MouseEvent("mouseup",{bubbles:true}));
    el.dispatchEvent(new MouseEvent("click",{bubbles:true}));

}

/* ================= AUTO CLICK LOOP ================= */

setInterval(()=>{

    const btn = findContinueButton();

    if(btn){

        console.log("✅ Found button:", btn.innerText);

        btn.scrollIntoView({
            behavior:"smooth",
            block:"center"
        });

        realClick(btn);

    }

},800);

/* ================= AUTO SCROLL ================= */

setInterval(()=>{

    const btn = findContinueButton();

    if(!btn){

        window.scrollBy({
            top:400,
            behavior:"smooth"
        });

    }

},1500);

})();
