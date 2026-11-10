const categoryNames = {
	electronics: "الإلكترونيات",
	mobiles: "الهواتف",
	appliances: "الأجهزة المنزلية"
};

const initialProductCount = 10;
const productGrid = document.querySelector("#product-grid");
const searchInput = document.querySelector("#search-input");
const resultsCount = document.querySelector("#results-count");
const emptyState = document.querySelector("#empty-state");
const loadMoreButton = document.querySelector("#load-more");
const cartDrawer = document.querySelector("#cart-drawer");
const cartOverlay = document.querySelector("#cart-overlay");
const toast = document.querySelector("#toast");

let products = [];
let activeCategory = "all";
let searchTerm = "";
let visibleCount = initialProductCount;
let sortMode = "featured";
let toastTimer;

function readStorage(key, fallback) {
	try {
		const value = JSON.parse(localStorage.getItem(key));
		return value ?? fallback;
	} catch {
		return fallback;
	}
}

function writeStorage(key, value) {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch {
		showToast("تعذر حفظ التغييرات على هذا الجهاز.");
	}
}

let cart = readStorage("reda-store-cart", []);
let favorites = readStorage("reda-store-favorites", []);

function formatPrice(price) {
	return new Intl.NumberFormat("ar-SA", { maximumFractionDigits: 0 }).format(price);
}

function getCategory(product) {
	return product.category || product.catetory || "electronics";
}

function getVisibleProducts() {
	const query = searchTerm.trim().toLocaleLowerCase("ar");
	const matching = products.filter((product) => {
		const category = getCategory(product);
		const matchesCategory = activeCategory === "all"
			|| (activeCategory === "deals" ? Boolean(product.old_price) : category === activeCategory);
		const searchableText = `${product.name} ${categoryNames[category] || ""}`.toLocaleLowerCase("ar");
		return matchesCategory && (!query || searchableText.includes(query));
	});

	if (sortMode === "price-asc") matching.sort((first, second) => first.price - second.price);
	if (sortMode === "price-desc") matching.sort((first, second) => second.price - first.price);
	if (sortMode === "name") matching.sort((first, second) => first.name.localeCompare(second.name, "ar"));
	return matching;
}

function productCard(product, index) {
	const category = getCategory(product);
	const favorite = favorites.includes(product.id);
	const saleBadge = product.old_price ? '<span class="product-badge">سعر خاص</span>' : "";
	const oldPrice = product.old_price
		? `<del class="old-price">${formatPrice(product.old_price)}</del>`
		: "";

	return `
		<article class="product-card" style="animation-delay:${Math.min(index, 9) * 35}ms">
			<div class="product-image-wrap">
				${saleBadge}
				<button class="favorite-button${favorite ? " is-favorite" : ""}" data-favorite="${product.id}" type="button" aria-label="${favorite ? "إزالة من" : "إضافة إلى"} المفضلة" aria-pressed="${favorite}">♡</button>
				<img class="product-image" src="${product.img}" alt="${product.name}" loading="lazy">
			</div>
			<div class="product-info">
				<p class="product-category">${categoryNames[category] || "منتجات متنوعة"}</p>
				<h3 class="product-name" title="${product.name}">${product.name}</h3>
				<div class="product-meta">
					<div><span class="product-price">${formatPrice(product.price)}<small>ر.س</small></span>${oldPrice}</div>
					<button class="add-cart-button" data-add-cart="${product.id}" type="button" aria-label="أضف ${product.name} إلى السلة">+</button>
				</div>
			</div>
		</article>`;
}

function renderProducts() {
	const matching = getVisibleProducts();
	const visibleProducts = matching.slice(0, visibleCount);
	productGrid.innerHTML = visibleProducts.map(productCard).join("");
	productGrid.classList.toggle("is-expanded", visibleCount > 8);
	resultsCount.textContent = `عرض ${formatPrice(visibleProducts.length)} من ${formatPrice(matching.length)} منتج`;
	emptyState.hidden = matching.length > 0;
	loadMoreButton.hidden = matching.length <= visibleCount;
}

function renderCart() {
	const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
	const total = cart.reduce((sum, item) => {
		const product = products.find((entry) => entry.id === item.id);
		return sum + (product ? product.price * item.quantity : 0);
	}, 0);

	document.querySelector("#cart-count").textContent = formatPrice(itemCount);
	document.querySelector("#cart-trigger").setAttribute("aria-label", `السلة، ${itemCount} منتجات`);
	document.querySelector("#cart-items").innerHTML = cart.map((item) => {
		const product = products.find((entry) => entry.id === item.id);
		if (!product) return "";
		return `<div class="cart-row">
			<img src="${product.img}" alt="${product.name}">
			<div><h3>${product.name}</h3><span class="cart-row-price">${formatPrice(product.price)} ر.س</span>
				<div class="quantity-control"><button data-quantity="${product.id}" data-change="-1" type="button" aria-label="تقليل الكمية">−</button><span>${item.quantity}</span><button data-quantity="${product.id}" data-change="1" type="button" aria-label="زيادة الكمية">+</button></div>
			</div>
			<button class="remove-item" data-remove="${product.id}" type="button" aria-label="حذف ${product.name}">×</button>
		</div>`;
	}).join("");

	document.querySelector("#cart-empty").hidden = itemCount > 0;
	document.querySelector("#cart-summary").hidden = itemCount === 0;
	document.querySelector("#cart-total").textContent = `${formatPrice(total)} ر.س`;
}

function showToast(message) {
	toast.textContent = message;
	toast.classList.add("is-visible");
	window.clearTimeout(toastTimer);
	toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2400);
}

function openCart() {
	cartDrawer.classList.add("is-open");
	cartDrawer.setAttribute("aria-hidden", "false");
	cartOverlay.hidden = false;
	document.body.classList.add("cart-open");
	requestAnimationFrame(() => cartOverlay.classList.add("is-visible"));
	document.querySelector("#close-cart").focus();
}

function closeCart() {
	cartDrawer.classList.remove("is-open");
	cartDrawer.setAttribute("aria-hidden", "true");
	cartOverlay.classList.remove("is-visible");
	document.body.classList.remove("cart-open");
	window.setTimeout(() => { cartOverlay.hidden = true; }, 250);
	document.querySelector("#cart-trigger").focus();
}

function setCategory(category) {
	activeCategory = category;
	visibleCount = initialProductCount;
	document.querySelectorAll(".filter-button").forEach((button) => {
		button.classList.toggle("is-active", button.dataset.category === category);
	});
	renderProducts();
}

document.querySelector("#search-form").addEventListener("submit", (event) => {
	event.preventDefault();
	searchTerm = searchInput.value;
	visibleCount = initialProductCount;
	renderProducts();
	document.querySelector("#products").scrollIntoView({ behavior: "smooth" });
});

searchInput.addEventListener("input", () => {
	searchTerm = searchInput.value;
	visibleCount = initialProductCount;
	renderProducts();
});

document.querySelectorAll("[data-category]").forEach((button) => {
	button.addEventListener("click", () => {
		setCategory(button.dataset.category);
		document.querySelector("#products").scrollIntoView({ behavior: "smooth" });
	});
});

document.querySelectorAll("[data-category-link]").forEach((link) => {
	link.addEventListener("click", (event) => {
		event.preventDefault();
		setCategory(link.dataset.categoryLink);
		document.querySelector("#products").scrollIntoView({ behavior: "smooth" });
	});
});

document.querySelector("#sort-select").addEventListener("change", (event) => {
	sortMode = event.target.value;
	renderProducts();
});

loadMoreButton.addEventListener("click", () => {
	visibleCount += initialProductCount;
	renderProducts();
});

document.querySelector("#reset-filters").addEventListener("click", () => {
	searchInput.value = "";
	searchTerm = "";
	setCategory("all");
});

productGrid.addEventListener("click", (event) => {
	const addButton = event.target.closest("[data-add-cart]");
	const favoriteButton = event.target.closest("[data-favorite]");

	if (addButton) {
		const id = Number(addButton.dataset.addCart);
		const item = cart.find((entry) => entry.id === id);
		if (item) item.quantity += 1;
		else cart.push({ id, quantity: 1 });
		writeStorage("reda-store-cart", cart);
		renderCart();
		showToast("أُضيف المنتج إلى سلتك.");
	}

	if (favoriteButton) {
		const id = Number(favoriteButton.dataset.favorite);
		favorites = favorites.includes(id)
			? favorites.filter((favoriteId) => favoriteId !== id)
			: [...favorites, id];
		writeStorage("reda-store-favorites", favorites);
		renderProducts();
		showToast(favorites.includes(id) ? "أُضيف إلى المفضلة." : "أُزيل من المفضلة.");
	}
});

document.querySelector("#cart-items").addEventListener("click", (event) => {
	const quantityButton = event.target.closest("[data-quantity]");
	const removeButton = event.target.closest("[data-remove]");

	if (quantityButton) {
		const id = Number(quantityButton.dataset.quantity);
		const item = cart.find((entry) => entry.id === id);
		if (item) item.quantity += Number(quantityButton.dataset.change);
		cart = cart.filter((entry) => entry.quantity > 0);
	}

	if (removeButton) {
		const id = Number(removeButton.dataset.remove);
		cart = cart.filter((entry) => entry.id !== id);
	}

	writeStorage("reda-store-cart", cart);
	renderCart();
});

document.querySelector("#cart-trigger").addEventListener("click", openCart);
document.querySelector("#close-cart").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);
document.addEventListener("keydown", (event) => {
	if (event.key === "Escape" && cartDrawer.classList.contains("is-open")) closeCart();
});

document.querySelector("#checkout-button").addEventListener("click", () => {
	showToast("الدفع الإلكتروني غير مربوط في هذه النسخة التجريبية.");
});

document.querySelector(".account-action").addEventListener("click", () => {
	showToast("خدمة الحسابات ستتوفر قريبًا.");
});

document.querySelector("#newsletter-form").addEventListener("submit", (event) => {
	event.preventDefault();
	document.querySelector("#newsletter-message").textContent = "شكرًا لاشتراكك، سنبقيك على اطلاع.";
	event.currentTarget.reset();
});

async function loadProducts() {
	try {
		const response = await fetch("products.json");
		if (!response.ok) throw new Error("تعذر تحميل كتالوج المنتجات.");
		products = await response.json();
		renderProducts();
		renderCart();
	} catch (error) {
		resultsCount.textContent = "شغّل الموقع عبر خادم محلي لعرض المنتجات.";
		productGrid.innerHTML = "";
		loadMoreButton.hidden = true;
		console.error(error);
	}
}

loadProducts();
