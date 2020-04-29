class Title extends HTMLElement {

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `<header class="mt-5">
                                <h2 class="text-center">Waktu Shalat Indonesia</h2>
                          </header>`;
    }
}


customElements.define("title-header", Title);