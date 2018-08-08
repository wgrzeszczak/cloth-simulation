import './links.css';

(() => {
    const linksContainer = document.createElement('section');
    linksContainer.className = 'links';  
    linksContainer.innerHTML = '<a href="https://github.com/wgrzeszczak/cloth-simulation" target="_blank" class="link github"></a>';
    document.body.appendChild(linksContainer);
})();