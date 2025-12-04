/* ---  SCROLL TO TOP BUTTON --- */
const scrollBtn = document.getElementById("scrollTopBtn");

// show button on scroll after 300px
window.onscroll = function () {
    scrollFunction();
};

function scrollFunction() {
    if (
    document.body.scrollTop > 300 ||
    document.documentElement.scrollTop > 300
) {
    scrollBtn.style.display = "block";
} else {
    scrollBtn.style.display = "none";
}
}

// smoth scroll to top on click
window.topFunction = function () {
    window.scrollTo({
    top: 0,
    behavior: "smooth", 
    });
};

let currentProductId = null;
let currentUnitCost = 0; 

/* --- 1. Sidebar Cart Functionality --- */
// btn open sidebar
window.openSidebar = function(button) {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    
    // extract product data from button attributes
    const id = button.getAttribute('data-id');
    const name = button.getAttribute('data-name');
    const priceString = button.getAttribute('data-price'); // 
    const imageURL = button.getAttribute('data-image');

    currentProductId = id;
    // show only numeric part of price
    currentUnitCost = parseFloat(priceString.replace(/[^0-9.]/g, ''));

    // fill sidebar data
    document.getElementById('cart-item-image').src = imageURL;
    document.getElementById('cart-item-name').innerText = name;
    document.getElementById('cart-item-price').innerText = priceString; 
    
    // reset quantity to 1
    const qtyInput = document.getElementById('quantity');
    if (qtyInput) {
        qtyInput.value = 1;
    }

    updateTotal();

    // show sidebar
    if (sidebar && overlay) {
        sidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; 
    }
};

// btn close sidebar
window.closeSidebar = function() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    if (sidebar && overlay) {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
};

// dynamic total calculation
function updateTotal() {
    const qtyInput = document.getElementById('quantity');
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('finalTotal');

    if (qtyInput && subtotalEl && totalEl) {
        let quantity = parseInt(qtyInput.value);
        
        // force minimum quantity to 1
        if (quantity < 1 || isNaN(quantity)) {
            quantity = 1;
            qtyInput.value = 1;
        }

        // calculate total
        const totalValue = (currentUnitCost * quantity).toFixed(2); // رقمين بعد الفاصلة

        // fill the product page total
        subtotalEl.innerText = `${totalValue} USD`;
        totalEl.innerText = `${totalValue} USD`;
    }
}

// sbmit order
window.submitOrder = function(event) {
    event.preventDefault();
    
    if (typeof isLoggedIn !== 'undefined' && isLoggedIn === true) {
        const qty = document.getElementById('quantity').value;
        const total = document.getElementById('finalTotal').innerText;
        
        alert(`Order placed successfully!\nProduct ID: ${currentProductId}\nQuantity: ${qty}\nTotal: ${total}`);
        closeSidebar();
    } else {
        if(confirm("You must be logged in to place an order. Go to Login page?")) {
            window.location.href = "/login";
        }
    }
};


document.addEventListener('DOMContentLoaded', () => {
    
    const quantityInput = document.getElementById('quantity');
    if (quantityInput) {
        quantityInput.addEventListener('input', updateTotal);
        quantityInput.addEventListener('change', updateTotal);
    }

    // ---  : Navbar Scroll & Animation ---
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) header.classList.add('scrolled');
            else header.classList.remove('scrolled');
        });
    }

    // Scroll Reveal
    const revealElements = document.querySelectorAll('.product-card, .section-title, .hero-content, .about .card');
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;
        revealElements.forEach((el) => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                el.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();
});