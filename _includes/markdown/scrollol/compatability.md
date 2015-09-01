### Compatability

Scrollol.js tries to rely as much as possible on the DOM API, which means it utilizes `document.querySelector/querySelectorAll`, `window.requestAnimationFrame`, `element.classList`, `element.scrollIntoView` to name a few.
Altough it tries to degrade gracefully towards the browsers lacking native functionality, it has no intent of supporting legacy browsers. This is a minimalistic library, remember.
