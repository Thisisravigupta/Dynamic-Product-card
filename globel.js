// ==========variants change update ============
class DynamicProductCards extends HTMLElement {
  constructor() {
    super();

    this.variantDataScript = this.querySelector('[type="application/json"]');
    if (this.variantDataScript) {
      this.variantData = JSON.parse(this.variantDataScript.textContent);
      this.addEventListener("input", this.onVariantChange.bind(this));
    }
  }

  onVariantChange() {
    let selectedOptions = [];
    this.querySelectorAll('input[type="radio"]').forEach(function (input) {
      if (input.checked) {
        selectedOptions.push(input.value);
      }
    });

    this.getCurrentVariant(selectedOptions);
  }

  getCurrentVariant(options) {
    let currentVariant = {};

    this.variantData.forEach(function (variant) {
      if (JSON.stringify(variant.options) == JSON.stringify(options)) {
        currentVariant = variant;
      }
    });

    this.updateMainId(currentVariant);
  }

  updateMainId(currentVariant) {
    this.querySelector('[name="id"]').value = currentVariant.id;

    this.getUpdatedCard(currentVariant);
  }

  getUpdatedCard(currentVariant) {
    this.sectionId = this.dataset.sectionId;
    this.productHandle = this.dataset.productHandle;

    fetch(
      `${this.productHandle}?variant=${currentVariant.id}&section_id=${this.sectionId}`
    )
      .then((response) => response.text())
      .then((responseText) => {
        const html = new DOMParser().parseFromString(responseText, "text/html");
        this.innerHTML = html.querySelector(`[data-product-handle="${this.productHandle}"]`).innerHTML;
      });
  }
}

customElements.define("dynamic-product-cards", DynamicProductCards);
