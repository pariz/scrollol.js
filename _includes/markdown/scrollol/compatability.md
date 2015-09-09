### Compatability

Scrollol.js tries to rely as much as possible on the DOM API, which means it utilizes <code>document.querySelector/querySelectorAll</code><code> window.requestAnimationFrame</code><code> element.classList</code> and <code>element.scrollIntoView</code> to name a few.

As Scrollol.js is intended to be small in size and (hopefully) big in performance, it is not compatible with older browsers. If you require browser support with older browsers, there is an amazing polyfill library: https://github.com/inexorabletash. This is a minimalistic library, remember. :)
