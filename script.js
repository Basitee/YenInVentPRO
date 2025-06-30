// Data Structure
        let storeData = {
            users: [
                { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
                { id: 2, username: 'manager', password: 'manager123', role: 'manager' },
                { id: 3, username: 'cashier', password: 'cashier123', role: 'cashier' }
            ],
            products: [
                { id: 1, name: 'Laptop', category: 'Electronics', price: 999.99, stock: 15, expiry: '2025-12-31', barcode: '123456789' },
                { id: 2, name: 'Smartphone', category: 'Electronics', price: 699.99, stock: 30, expiry: '2026-06-30', barcode: '987654321' },
                { id: 3, name: 'Headphones', category: 'Electronics', price: 149.99, stock: 45, expiry: '2025-09-15', barcode: '456789123' },
                { id: 4, name: 'Notebook', category: 'Stationery', price: 4.99, stock: 100, expiry: '2027-01-01', barcode: '321654987' },
                { id: 5, name: 'Pen', category: 'Stationery', price: 1.99, stock: 200, expiry: '2026-12-31', barcode: '789123456' },
                { id: 6, name: 'Coffee Mug', category: 'Kitchen', price: 12.99, stock: 25, expiry: '2028-01-01', barcode: '654987321' },
                { id: 7, name: 'Water Bottle', category: 'Kitchen', price: 19.99, stock: 35, expiry: '2027-06-30', barcode: '147258369' },
                { id: 8, name: 'T-shirt', category: 'Clothing', price: 24.99, stock: 50, expiry: '2026-03-31', barcode: '369258147' },
                { id: 9, name: 'Jeans', category: 'Clothing', price: 49.99, stock: 20, expiry: '2026-03-31', barcode: '258369147' },
                { id: 10, name: 'Sneakers', category: 'Footwear', price: 89.99, stock: 18, expiry: '2026-12-31', barcode: '951753852' }
            ],
            sales: [],
            settings: {
                lowStockThreshold: 10,
                expiryWarningDays: 7
            }
        };

        // Current User
        let currentUser = null;
        let currentPage = 'dashboard';
        let selectedPaymentMethod = null;

        // DOM Elements
        const loginScreen = document.getElementById('login-screen');
        const loginContainer = document.getElementById('login-container');
        const loginForm = document.getElementById('login-form');
        const app = document.getElementById('app');
        const userRoleElement = document.getElementById('user-role');
        const logoutBtn = document.getElementById('logout-btn');
        const darkModeBtn = document.getElementById('dark-mode-btn');
        const toggleNavBtn = document.getElementById('toggle-nav');
        const navContainer = document.getElementById('nav-container');
        const mainContent = document.getElementById('main-content');
        const navLinks = document.querySelectorAll('.nav-link');
        const pages = document.querySelectorAll('.page');

        // Dashboard Elements
        const totalProductsElement = document.getElementById('total-products');
        const lowStockElement = document.getElementById('low-stock');
        const expiringSoonElement = document.getElementById('expiring-soon');
        const todaySalesElement = document.getElementById('today-sales');
        const weeklySalesElement = document.getElementById('weekly-sales');
        const salesChartCanvas = document.getElementById('sales-chart');

        // Inventory Elements
        const inventorySearch = document.getElementById('inventory-search');
        const addProductBtn = document.getElementById('add-product-btn');
        const inventoryTableBody = document.getElementById('inventory-table-body');
        const productModal = document.getElementById('product-modal');
        const productForm = document.getElementById('product-form');
        const saveProductBtn = document.getElementById('save-product-btn');
        const closeProductModal = document.getElementById('close-product-modal');
        const cancelProductBtn = document.getElementById('cancel-product-btn');

        // POS Elements
        const posSearch = document.getElementById('pos-search');
        const productsGrid = document.getElementById('products-grid');
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        const clearCartBtn = document.getElementById('clear-cart-btn');
        const checkoutBtn = document.getElementById('checkout-btn');
        const paymentMethods = document.querySelectorAll('.payment-method');
        let currentCart = [];

        // Reports Elements
        const reportType = document.getElementById('report-type');
        const startDate = document.getElementById('start-date');
        const endDate = document.getElementById('end-date');
        const generateReportBtn = document.getElementById('generate-report-btn');
        const reportChartCanvas = document.getElementById('report-chart');
        const reportTableBody = document.getElementById('report-table-body');
        const exportReportBtn = document.getElementById('export-report-btn');

        // Settings Elements
        const addUserBtn = document.getElementById('add-user-btn');
        const usersTableBody = document.getElementById('users-table-body');
        const userModal = document.getElementById('user-modal');
        const userForm = document.getElementById('user-form');
        const saveUserBtn = document.getElementById('save-user-btn');
        const closeUserModal = document.getElementById('close-user-modal');
        const cancelUserBtn = document.getElementById('cancel-user-btn');
        const lowStockThreshold = document.getElementById('low-stock-threshold');
        const expiryWarningDays = document.getElementById('expiry-warning-days');
        const saveSettingsBtn = document.getElementById('save-settings-btn');
        const exportProductsBtn = document.getElementById('export-products-btn');
        const exportSalesBtn = document.getElementById('export-sales-btn');
        const backupDataBtn = document.getElementById('backup-data-btn');

        // Confirmation Modal Elements
        const confirmModal = document.getElementById('confirm-modal');
        const confirmMessage = document.getElementById('confirm-message');
        const confirmBtn = document.getElementById('confirm-btn');
        const closeConfirmModal = document.getElementById('close-confirm-modal');
        const cancelConfirmBtn = document.getElementById('cancel-confirm-btn');
        let confirmCallback = null;

        // Initialize the application
        function init() {
            // Create bubbles for login screen
            createBubbles();
            
            // Load data from localStorage if available
            const savedData = localStorage.getItem('yenInventData');
            if (savedData) {
                storeData = JSON.parse(savedData);
            } else {
                // Create some sample sales data
                const today = new Date();
                const lastMonth = new Date();
                lastMonth.setMonth(lastMonth.getMonth() - 1);
                
                for (let i = 0; i < 30; i++) {
                    const date = new Date(lastMonth);
                    date.setDate(date.getDate() + i);
                    
                    const items = [];
                    const productCount = Math.floor(Math.random() * 5) + 1;
                    let total = 0;
                    
                    for (let j = 0; j < productCount; j++) {
                        const productIndex = Math.floor(Math.random() * storeData.products.length);
                        const product = storeData.products[productIndex];
                        const quantity = Math.floor(Math.random() * 3) + 1;
                        
                        items.push({
                            productId: product.id,
                            name: product.name,
                            price: product.price,
                            quantity: quantity
                        });
                        
                        total += product.price * quantity;
                    }
                    
                    // Payment method
                    const paymentMethods = ['cash', 'momo'];
                    const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
                    
                    storeData.sales.push({
                        id: i + 1,
                        date: date.toISOString().split('T')[0],
                        items: items,
                        total: parseFloat(total.toFixed(2)),
                        userId: storeData.users[Math.floor(Math.random() * storeData.users.length)].id,
                        paymentMethod: paymentMethod
                    });
                }
                
                saveData();
            }

            // Set up event listeners
            setupEventListeners();

            // Set default dates for reports
            const today = new Date().toISOString().split('T')[0];
            const lastMonth = new Date();
            lastMonth.setMonth(lastMonth.getMonth() - 1);
            const lastMonthStr = lastMonth.toISOString().split('T')[0];
            
            startDate.value = lastMonthStr;
            endDate.value = today;

            // Load settings
            lowStockThreshold.value = storeData.settings.lowStockThreshold;
            expiryWarningDays.value = storeData.settings.expiryWarningDays;

            // Initialize dark mode
            initDarkMode();
        }

        // Create bubbles for login screen animation
        function createBubbles() {
            const loginScreen = document.getElementById('login-screen');
            const bubbleCount = 15;
            
            for (let i = 0; i < bubbleCount; i++) {
                const bubble = document.createElement('div');
                bubble.classList.add('bubble');
                
                // Random size
                const size = Math.random() * 100 + 50;
                bubble.style.width = `${size}px`;
                bubble.style.height = `${size}px`;
                
                // Random position
                const left = Math.random() * 100;
                const top = Math.random() * 100;
                bubble.style.left = `${left}%`;
                bubble.style.top = `${top}%`;
                
                // Random animation duration
                const duration = Math.random() * 20 + 10;
                bubble.style.animationDuration = `${duration}s`;
                
                // Random animation delay
                const delay = Math.random() * 5;
                bubble.style.animationDelay = `-${delay}s`;
                
                loginScreen.appendChild(bubble);
            }
        }

        // Set up all event listeners
        function setupEventListeners() {
            // Login
            loginForm.addEventListener('submit', handleLogin);

            // Logout
            logoutBtn.addEventListener('click', handleLogout);

            // Dark mode toggle
            darkModeBtn.addEventListener('click', toggleDarkMode);

            // Navigation
            toggleNavBtn.addEventListener('click', toggleNav);
            navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    navigateTo(link.dataset.page);
                });
            });

            // Dashboard
            // No specific event listeners needed for dashboard

            // Inventory
            inventorySearch.addEventListener('input', filterInventory);
            addProductBtn.addEventListener('click', () => openProductModal());
            saveProductBtn.addEventListener('click', saveProduct);
            closeProductModal.addEventListener('click', () => closeModal(productModal));
            cancelProductBtn.addEventListener('click', () => closeModal(productModal));

            // POS
            posSearch.addEventListener('input', filterProducts);
            clearCartBtn.addEventListener('click', clearCart);
            checkoutBtn.addEventListener('click', checkout);
            
            // Payment method selection
            paymentMethods.forEach(method => {
                method.addEventListener('click', () => {
                    paymentMethods.forEach(m => m.classList.remove('selected'));
                    method.classList.add('selected');
                    selectedPaymentMethod = method.dataset.method;
                });
            });

            // Reports
            generateReportBtn.addEventListener('click', generateReport);
            exportReportBtn.addEventListener('click', exportReport);

            // Settings
            addUserBtn.addEventListener('click', () => openUserModal());
            saveUserBtn.addEventListener('click', saveUser);
            closeUserModal.addEventListener('click', () => closeModal(userModal));
            cancelUserBtn.addEventListener('click', () => closeModal(userModal));
            saveSettingsBtn.addEventListener('click', saveSettings);
            exportProductsBtn.addEventListener('click', exportProducts);
            exportSalesBtn.addEventListener('click', exportSales);
            backupDataBtn.addEventListener('click', backupData);

            // Confirmation Modal
            closeConfirmModal.addEventListener('click', () => closeModal(confirmModal));
            cancelConfirmBtn.addEventListener('click', () => closeModal(confirmModal));
            confirmBtn.addEventListener('click', () => {
                if (confirmCallback) confirmCallback();
                closeModal(confirmModal);
            });

            // Window resize for responsive design
            window.addEventListener('resize', handleResize);
        }

        // Handle login
        function handleLogin(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            const user = storeData.users.find(u => u.username === username && u.password === password);
            
            if (user) {
                currentUser = user;
                
                // Animate login screen out
                loginContainer.classList.add('hidden');
                
                setTimeout(() => {
                    loginScreen.style.display = 'none';
                    app.style.display = 'block';
                    
                    // Update UI for logged in user
                    userRoleElement.textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
                    
                    // Load the dashboard
                    navigateTo('dashboard');
                    
                    // Apply role-based permissions
                    applyRolePermissions();
                    
                    // Check if mobile and collapse nav by default
                    if (window.innerWidth <= 768) {
                        navContainer.classList.remove('active');
                        mainContent.classList.add('expanded');
                    }
                }, 500);
            } else {
                alert('Invalid username or password');
            }
        }

        // Apply role-based permissions
        function applyRolePermissions() {
            // Hide navigation items based on role
            document.querySelectorAll('.nav-link').forEach(link => {
                const page = link.dataset.page;
                if (currentUser.role === 'admin') {
                    link.style.display = '';
                } else if (currentUser.role === 'manager') {
                    if (['dashboard', 'inventory', 'reports'].includes(page)) {
                        link.style.display = '';
                    } else {
                        link.style.display = 'none';
                    }
                } else if (currentUser.role === 'cashier') {
                    if (['dashboard', 'pos', 'reports'].includes(page)) {
                        link.style.display = '';
                    } else {
                        link.style.display = 'none';
                    }
                }
            });

            // Hide settings page for non-admins
            if (currentUser.role !== 'admin') {
                document.querySelector('.nav-link[data-page="settings"]').style.display = 'none';
            }

            // Hide inventory management buttons for cashiers
            if (currentUser.role === 'cashier') {
                addProductBtn.style.display = 'none';
            } else {
                addProductBtn.style.display = '';
            }
        }

        // Handle logout
        function handleLogout() {
            currentUser = null;
            
            // Reset login form
            loginForm.reset();
            loginContainer.classList.remove('hidden');
            
            // Hide app and show login screen
            app.style.display = 'none';
            loginScreen.style.display = 'flex';
        }

        // Initialize dark mode
        function initDarkMode() {
            const darkMode = localStorage.getItem('yenInventDarkMode');
            if (darkMode === '1') {
                document
            .body.classList.add('dark-mode');
                            darkModeBtn.textContent = '☀️';
                        } else {
                            document.body.classList.remove('dark-mode');
                            darkModeBtn.textContent = '🌙';
                        }
                    }

                    // Toggle dark mode
                    function toggleDarkMode() {
                        document.body.classList.toggle('dark-mode');
                        const isDark = document.body.classList.contains('dark-mode');
                        localStorage.setItem('yenInventDarkMode', isDark ? '1' : '0');
                        darkModeBtn.textContent = isDark ? '☀️' : '🌙';
                    }

                    // Toggle navigation (for mobile)
                    function toggleNav() {
                        navContainer.classList.toggle('active');
                        mainContent.classList.toggle('expanded');
                    }

                    // Handle window resize for responsive nav
                    function handleResize() {
                        if (window.innerWidth > 768) {
                            navContainer.classList.remove('active');
                            mainContent.classList.remove('expanded');
                        }
                    }

                    // Save data to localStorage
                    function saveData() {
                        localStorage.setItem('yenInventData', JSON.stringify(storeData));
                    }

                    // Navigation
                    function navigateTo(page) {
                        currentPage = page;
                        pages.forEach(p => p.style.display = 'none');
                        document.getElementById(`${page}-page`).style.display = '';
                        navLinks.forEach(link => {
                            if (link.dataset.page === page) {
                                link.classList.add('active');
                            } else {
                                link.classList.remove('active');
                            }
                        });

                        // Load page-specific data
                        if (page === 'dashboard') {
                            loadDashboard();
                        } else if (page === 'inventory') {
                            loadInventory();
                        } else if (page === 'pos') {
                            loadPOS();
                        } else if (page === 'reports') {
                            generateReport();
                        } else if (page === 'settings') {
                            loadUsers();
                        }
                    }

                    // Modal helpers
                    function openModal(modal) {
                        modal.classList.add('active');
                    }
                    function closeModal(modal) {
                        modal.classList.remove('active');
                    }

                    // Inventory functions
                    function loadInventory() {
                        renderInventoryTable(storeData.products);
                    }

                    function renderInventoryTable(products) {
                        inventoryTableBody.innerHTML = '';
                        products.forEach(product => {
                            const tr = document.createElement('tr');
                            tr.innerHTML = `
                                <td>${product.id}</td>
                                <td>${product.name}</td>
                                <td>${product.category}</td>
                                <td>₵${product.price.toFixed(2)}</td>
                                <td>${product.stock}</td>
                                <td>${product.expiry || ''}</td>
                                <td>
                                    <span class="badge ${getProductStatusBadge(product)}">${getProductStatus(product)}</span>
                                </td>
                                <td>
                                    <button class="action-btn edit-btn" title="Edit" onclick="editProduct(${product.id})">✏️</button>
                                    <button class="action-btn delete-btn" title="Delete" onclick="confirmDeleteProduct(${product.id})">🗑️</button>
                                </td>
                            `;
                            inventoryTableBody.appendChild(tr);
                        });
                    }

                    function getProductStatus(product) {
                        if (product.stock <= storeData.settings.lowStockThreshold) {
                            return 'Low Stock';
                        }
                        if (product.expiry && isExpiringSoon(product.expiry)) {
                            return 'Expiring';
                        }
                        return 'OK';
                    }

                    function getProductStatusBadge(product) {
                        if (product.stock <= storeData.settings.lowStockThreshold) {
                            return 'warning';
                        }
                        if (product.expiry && isExpiringSoon(product.expiry)) {
                            return 'danger';
                        }
                        return 'success';
                    }

                    function isExpiringSoon(expiry) {
                        if (!expiry) return false;
                        const expDate = new Date(expiry);
                        const now = new Date();
                        const diff = (expDate - now) / (1000 * 60 * 60 * 24);
                        return diff <= storeData.settings.expiryWarningDays;
                    }

                    function filterInventory() {
                        const query = inventorySearch.value.toLowerCase();
                        const filtered = storeData.products.filter(p =>
                            p.name.toLowerCase().includes(query) ||
                            p.category.toLowerCase().includes(query) ||
                            (p.barcode && p.barcode.includes(query))
                        );
                        renderInventoryTable(filtered);
                    }

                    function openProductModal(product = null) {
                        productForm.reset();
                        document.getElementById('product-id').value = product ? product.id : '';
                        document.getElementById('product-name').value = product ? product.name : '';
                        document.getElementById('product-category').value = product ? product.category : '';
                        document.getElementById('product-price').value = product ? product.price : '';
                        document.getElementById('product-stock').value = product ? product.stock : '';
                        document.getElementById('product-expiry').value = product ? product.expiry : '';
                        document.getElementById('product-barcode').value = product ? product.barcode : '';
                        document.getElementById('product-modal-title').textContent = product ? 'Edit Product' : 'Add Product';
                        openModal(productModal);
                    }

                    function saveProduct(e) {
                        e.preventDefault();
                        const id = document.getElementById('product-id').value;
                        const name = document.getElementById('product-name').value;
                        const category = document.getElementById('product-category').value;
                        const price = parseFloat(document.getElementById('product-price').value);
                        const stock = parseInt(document.getElementById('product-stock').value, 10);
                        const expiry = document.getElementById('product-expiry').value;
                        const barcode = document.getElementById('product-barcode').value;

                        if (!name || !category || isNaN(price) || isNaN(stock)) {
                            alert('Please fill all required fields.');
                            return;
                        }

                        if (id) {
                            // Edit
                            const product = storeData.products.find(p => p.id == id);
                            if (product) {
                                product.name = name;
                                product.category = category;
                                product.price = price;
                                product.stock = stock;
                                product.expiry = expiry;
                                product.barcode = barcode;
                            }
                        } else {
                            // Add
                            const newId = storeData.products.length ? Math.max(...storeData.products.map(p => p.id)) + 1 : 1;
                            storeData.products.push({
                                id: newId,
                                name,
                                category,
                                price,
                                stock,
                                expiry,
                                barcode
                            });
                        }
                        saveData();
                        closeModal(productModal);
                        loadInventory();
                        loadDashboard();
                    }

                    window.editProduct = function(id) {
                        const product = storeData.products.find(p => p.id == id);
                        if (product) openProductModal(product);
                    };

                    window.confirmDeleteProduct = function(id) {
                        confirmMessage.textContent = 'Are you sure you want to delete this product?';
                        confirmCallback = function() {
                            storeData.products = storeData.products.filter(p => p.id != id);
                            saveData();
                            loadInventory();
                            loadDashboard();
                        };
                        openModal(confirmModal);
                    };

                    // POS functions
                    function loadPOS() {
                        renderProductsGrid(storeData.products);
                        renderCart();
                        selectedPaymentMethod = null;
                        paymentMethods.forEach(m => m.classList.remove('selected'));
                    }

                    function renderProductsGrid(products) {
                        productsGrid.innerHTML = '';
                        products.forEach(product => {
                            const div = document.createElement('div');
                            div.className = 'product-card';
                            div.innerHTML = `
                                <div class="product-image">${product.name.charAt(0)}</div>
                                <div class="product-info">
                                    <div class="product-name">${product.name}</div>
                                    <div class="product-price">₵${product.price.toFixed(2)}</div>
                                    <div class="product-stock">Stock: ${product.stock}</div>
                                </div>
                            `;
                            div.addEventListener('click', () => addToCart(product.id));
                            productsGrid.appendChild(div);
                        });
                    }

                    function filterProducts() {
                        const query = posSearch.value.toLowerCase();
                        const filtered = storeData.products.filter(p =>
                            p.name.toLowerCase().includes(query) ||
                            p.category.toLowerCase().includes(query) ||
                            (p.barcode && p.barcode.includes(query))
                        );
                        renderProductsGrid(filtered);
                    }

                    function addToCart(productId) {
                        const product = storeData.products.find(p => p.id == productId);
                        if (!product || product.stock <= 0) return;
                        const cartItem = currentCart.find(item => item.productId == productId);
                        if (cartItem) {
                            if (cartItem.quantity < product.stock) {
                                cartItem.quantity += 1;
                            }
                        } else {
                            currentCart.push({
                                productId: product.id,
                                name: product.name,
                                price: product.price,
                                quantity: 1
                            });
                        }
                        renderCart();
                    }

                    function renderCart() {
                        cartItems.innerHTML = '';
                        let total = 0;
                        currentCart.forEach(item => {
                            total += item.price * item.quantity;
                            const div = document.createElement('div');
                            div.className = 'cart-item';
                            div.innerHTML = `
                                <div class="cart-item-info">
                                    <div class="cart-item-name">${item.name}</div>
                                    <div class="cart-item-price">₵${item.price.toFixed(2)}</div>
                                </div>
                                <div class="cart-item-actions">
                                    <button class="action-btn" onclick="decreaseQty(${item.productId})">-</button>
                                    <input type="number" class="cart-item-qty" value="${item.quantity}" min="1" max="${getProductStock(item.productId)}" onchange="changeQty(${item.productId}, this.value)">
                                    <button class="action-btn" onclick="increaseQty(${item.productId})">+</button>
                                    <button class="action-btn delete-btn" onclick="removeFromCart(${item.productId})">🗑️</button>
                                </div>
                            `;
                            cartItems.appendChild(div);
                        });
                        cartTotal.textContent = `₵${total.toFixed(2)}`;
                    }

                    function getProductStock(productId) {
                        const product = storeData.products.find(p => p.id == productId);
                        return product ? product.stock : 0;
                    }

                    window.decreaseQty = function(productId) {
                        const item = currentCart.find(i => i.productId == productId);
                        if (item && item.quantity > 1) {
                            item.quantity -= 1;
                            renderCart();
                        }
                    };

                    window.increaseQty = function(productId) {
                        const item = currentCart.find(i => i.productId == productId);
                        const stock = getProductStock(productId);
                        if (item && item.quantity < stock) {
                            item.quantity += 1;
                            renderCart();
                        }
                    };

                    window.changeQty = function(productId, value) {
                        const item = currentCart.find(i => i.productId == productId);
                        const stock = getProductStock(productId);
                        let qty = parseInt(value, 10);
                        if (isNaN(qty) || qty < 1) qty = 1;
                        if (qty > stock) qty = stock;
                        if (item) {
                            item.quantity = qty;
                            renderCart();
                        }
                    };

                    window.removeFromCart = function(productId) {
                        currentCart = currentCart.filter(i => i.productId != productId);
                        renderCart();
                    };

                    function clearCart() {
                        currentCart = [];
                        renderCart();
                    }

                    function checkout() {
                        if (!currentCart.length) {
                            alert('Cart is empty!');
                            return;
                        }
                        if (!selectedPaymentMethod) {
                            alert('Please select a payment method.');
                            return;
                        }
                        // Check stock
                        for (const item of currentCart) {
                            const product = storeData.products.find(p => p.id == item.productId);
                            if (!product || product.stock < item.quantity) {
                                alert(`Insufficient stock for ${item.name}`);
                                return;
                            }
                        }
                        // Deduct stock
                        currentCart.forEach(item => {
                            const product = storeData.products.find(p => p.id == item.productId);
                            if (product) product.stock -= item.quantity;
                        });
                        // Add sale
                        const today = new Date().toISOString().split('T')[0];
                        const total = currentCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
                        storeData.sales.push({
                            id: storeData.sales.length ? Math.max(...storeData.sales.map(s => s.id)) + 1 : 1,
                            date: today,
                            items: JSON.parse(JSON.stringify(currentCart)),
                            total: parseFloat(total.toFixed(2)),
                            userId: currentUser.id,
                            paymentMethod: selectedPaymentMethod
                        });
                        saveData();
                        clearCart();
                        loadInventory();
                        loadDashboard();
                        alert('Sale completed!');
                    }

                    // Dashboard functions
                    function loadDashboard() {
                        totalProductsElement.textContent = storeData.products.length;
                        lowStockElement.textContent = storeData.products.filter(p => p.stock <= storeData.settings.lowStockThreshold).length;
                        expiringSoonElement.textContent = storeData.products.filter(p => p.expiry && isExpiringSoon(p.expiry)).length;

                        // Today's sales
                        const today = new Date().toISOString().split('T')[0];
                        const todaySales = storeData.sales.filter(s => s.date === today).reduce((sum, s) => sum + s.total, 0);
                        todaySalesElement.textContent = `₵${todaySales.toFixed(2)}`;

                        // Weekly sales
                        const weekAgo = new Date();
                        weekAgo.setDate(weekAgo.getDate() - 6);
                        const weekAgoStr = weekAgo.toISOString().split('T')[0];
                        const weeklySales = storeData.sales.filter(s => s.date >= weekAgoStr).reduce((sum, s) => sum + s.total, 0);
                        weeklySalesElement.textContent = `₵${weeklySales.toFixed(2)}`;

                        renderSalesChart();
                    }

                    let salesChart;
                    function renderSalesChart() {
                        const days = [];
                        const salesData = [];
                        for (let i = 6; i >= 0; i--) {
                            const d = new Date();
                            d.setDate(d.getDate() - i);
                            const dateStr = d.toISOString().split('T')[0];
                            days.push(dateStr);
                            const total = storeData.sales.filter(s => s.date === dateStr).reduce((sum, s) => sum + s.total, 0);
                            salesData.push(total);
                        }
                        if (salesChart) salesChart.destroy();
                        salesChart = new Chart(salesChartCanvas, {
                            type: 'line',
                            data: {
                                labels: days,
                                datasets: [{
                                    label: 'Sales (₵)',
                                    data: salesData,
                                    borderColor: '#3498db',
                                    backgroundColor: 'rgba(52,152,219,0.1)',
                                    fill: true,
                                    tension: 0.3
                                }]
                            },
                            options: {
                                responsive: true,
                                plugins: {
                                    legend: { display: false }
                                },
                                scales: {
                                    y: { beginAtZero: true }
                                }
                            }
                        });
                    }

                    // Reports functions
                    function generateReport() {
                        const type = reportType.value;
                        const start = startDate.value;
                        const end = endDate.value;
                        let filteredSales = storeData.sales.filter(s => s.date >= start && s.date <= end);

                        let labels = [];
                        let data = [];
                        let tableRows = '';

                        if (type === 'daily') {
                            // Group by day
                            const dateMap = {};
                            filteredSales.forEach(sale => {
                                if (!dateMap[sale.date]) dateMap[sale.date] = { total: 0, items: 0 };
                                dateMap[sale.date].total += sale.total;
                                dateMap[sale.date].items += sale.items.reduce((sum, i) => sum + i.quantity, 0);
                            });
                            labels = Object.keys(dateMap);
                            data = labels.map(d => dateMap[d].total);
                            labels.forEach(d => {
                                tableRows += `<tr>
                                    <td>${d}</td>
                                    <td>₵${dateMap[d].total.toFixed(2)}</td>
                                    <td>${dateMap[d].items}</td>
                                    <td>-</td>
                                    <td></td>
                                </tr>`;
                            });
                        } else if (type === 'monthly') {
                            // Group by month
                            const monthMap = {};
                            filteredSales.forEach(sale => {
                                const month = sale.date.slice(0, 7);
                                if (!monthMap[month]) monthMap[month] = { total: 0, items: 0 };
                                monthMap[month].total += sale.total;
                                monthMap[month].items += sale.items.reduce((sum, i) => sum + i.quantity, 0);
                            });
                            labels = Object.keys(monthMap);
                            data = labels.map(m => monthMap[m].total);
                            labels.forEach(m => {
                                tableRows += `<tr>
                                    <td>${m}</td>
                                    <td>₵${monthMap[m].total.toFixed(2)}</td>
                                    <td>${monthMap[m].items}</td>
                                    <td>-</td>
                                    <td></td>
                                </tr>`;
                            });
                        } else if (type === 'inventory') {
                            // Inventory status
                            labels = storeData.products.map(p => p.name);
                            data = storeData.products.map(p => p.stock);
                            storeData.products.forEach(p => {
                                tableRows += `<tr>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>${p.stock}</td>
                                    <td>-</td>
                                    <td></td>
                                </tr>`;
                            });
                        } else if (type === 'payment') {
                            // Group by payment method
                            const payMap = {};
                            filteredSales.forEach(sale => {
                                if (!payMap[sale.paymentMethod]) payMap[sale.paymentMethod] = { total: 0, items: 0 };
                                payMap[sale.paymentMethod].total += sale.total;
                                payMap[sale.paymentMethod].items += sale.items.reduce((sum, i) => sum + i.quantity, 0);
                            });
                            labels = Object.keys(payMap);
                            data = labels.map(m => payMap[m].total);
                            labels.forEach(m => {
                                tableRows += `<tr>
                                    <td>-</td>
                                    <td>₵${payMap[m].total.toFixed(2)}</td>
                                    <td>${payMap[m].items}</td>
                                    <td>${m}</td>
                                    <td></td>
                                </tr>`;
                            });
                        }

                        
                        // Add "View" button to each row if type is daily/monthly/payment
                        if (type === 'daily' || type === 'monthly' || type === 'payment') {
                            // Add view sales button to each row
                            setTimeout(() => {
                                Array.from(reportTableBody.children).forEach((tr, idx) => {
                                    const viewBtn = document.createElement('button');
                                    viewBtn.className = 'action-btn';
                                    viewBtn.textContent = 'View';
                                    viewBtn.onclick = function () {
                                        let filterFn;
                                        if (type === 'daily') {
                                            const date = labels[idx];
                                            filterFn = s => s.date === date;
                                        } else if (type === 'monthly') {
                                            const month = labels[idx];
                                            filterFn = s => s.date.startsWith(month);
                                        } else if (type === 'payment') {
                                            const method = labels[idx];
                                            filterFn = s => s.paymentMethod === method && s.date >= start && s.date <= end;
                                        }
                                        const sales = storeData.sales.filter(filterFn);
                                        let details = '';
                                        sales.forEach(sale => {
                                            details += `Date: ${sale.date}\nTotal: ₵${sale.total.toFixed(2)}\nPayment: ${sale.paymentMethod}\nItems:\n`;
                                            sale.items.forEach(item => {
                                                details += `  - ${item.name} x${item.quantity} (₵${item.price.toFixed(2)})\n`;
                                            });
                                            details += '\n';
                                        });
                                        if (!details) details = 'No sales found.';
                                        alert(details);
                                    };
                                    tr.children[4].innerHTML = '';
                                    tr.children[4].appendChild(viewBtn);
                                });
                            }, 0);
                        }
                        // Add "User" column to each row if type is daily/monthly/payment
                        if (type === 'daily' || type === 'monthly' || type === 'payment') {
                            setTimeout(() => {
                                Array.from(reportTableBody.children).forEach((tr, idx) => {
                                    // Find user(s) for this row
                                    let filterFn;
                                    if (type === 'daily') {
                                        const date = labels[idx];
                                        filterFn = s => s.date === date;
                                    } else if (type === 'monthly') {
                                        const month = labels[idx];
                                        filterFn = s => s.date.startsWith(month);
                                    } else if (type === 'payment') {
                                        const method = labels[idx];
                                        filterFn = s => s.paymentMethod === method && s.date >= start && s.date <= end;
                                    }
                                    const sales = storeData.sales.filter(filterFn);
                                    // Collect unique usernames
                                    const userIds = [...new Set(sales.map(s => s.userId))];
                                    const usernames = userIds.map(uid => {
                                        const user = storeData.users.find(u => u.id === uid);
                                        return user ? user.username : '';
                                    }).filter(Boolean).join(', ');
                                    // Insert username(s) as a new column (before Actions)
                                    const userTd = document.createElement('td');
                                    userTd.textContent = usernames;
                                    tr.insertBefore(userTd, tr.children[4]);

                                    // Add view button as before
                                    const viewBtn = document.createElement('button');
                                    viewBtn.className = 'action-btn';
                                    viewBtn.textContent = 'View';
                                    viewBtn.onclick = function () {
                                        let details = '';
                                        sales.forEach(sale => {
                                            const user = storeData.users.find(u => u.id === sale.userId);
                                            details += `User: ${user ? user.username : ''}\nDate: ${sale.date}\nTotal: ₵${sale.total.toFixed(2)}\nPayment: ${sale.paymentMethod}\nItems:\n`;
                                            sale.items.forEach(item => {
                                                details += `  - ${item.name} x${item.quantity} (₵${item.price.toFixed(2)})\n`;
                                            });
                                            details += '\n';
                                        });
                                        if (!details) details = 'No sales found.';
                                        alert(details);
                                    };
                                    tr.children[5].innerHTML = '';
                                    tr.children[5].appendChild(viewBtn);
                                });
                            }, 0);
                        }
                        // Render chart
                        if (window.reportChart) window.reportChart.destroy();
                        window.reportChart = new Chart(reportChartCanvas, {
                            type: 'bar',
                            data: {
                                labels: labels,
                                datasets: [{
                                    label: type === 'inventory' ? 'Stock' : 'Sales (₵)',
                                    data: data,
                                    backgroundColor: '#2980b9'
                                }]
                            },
                            options: {
                                responsive: true,
                                plugins: {
                                    legend: { display: false }
                                },
                                scales: {
                                    y: { beginAtZero: true }
                                }
                            }
                        });

                        // Render table
                        reportTableBody.innerHTML = tableRows;
                    }

                    function exportReport() {
                        let csv = 'Date,Total Sales,Items Sold,Payment Method\n';
                        Array.from(reportTableBody.children).forEach(tr => {
                            const tds = Array.from(tr.children).map(td => td.textContent);
                            csv += tds.join(',') + '\n';
                        });
                        // Export daily sales: include sale details for each day if type is 'daily'
                        if (reportType.value === 'daily') {
                            csv = 'Date,Total Sales,Items Sold,User,Payment Method,Sale Details\n';
                            const start = startDate.value;
                            const end = endDate.value;
                            const filteredSales = storeData.sales.filter(s => s.date >= start && s.date <= end);
                            // Group sales by date
                            const dateMap = {};
                            filteredSales.forEach(sale => {
                                if (!dateMap[sale.date]) dateMap[sale.date] = [];
                                dateMap[sale.date].push(sale);
                            });
                            Object.keys(dateMap).forEach(date => {
                                const salesForDate = dateMap[date];
                                const total = salesForDate.reduce((sum, s) => sum + s.total, 0);
                                const itemsCount = salesForDate.reduce((sum, s) => sum + s.items.reduce((si, i) => si + i.quantity, 0), 0);
                                // List all users and payment methods for the date
                                const users = [...new Set(salesForDate.map(s => {
                                    const u = storeData.users.find(u => u.id === s.userId);
                                    return u ? u.username : '';
                                }))].join('; ');
                                const paymentMethods = [...new Set(salesForDate.map(s => s.paymentMethod))].join('; ');
                                // Sale details
                                const saleDetails = salesForDate.map(sale => {
                                    const items = sale.items.map(i => `${i.name} x${i.quantity}`).join('|');
                                    return `[${items}]`;
                                }).join(' ; ');
                                csv += `${date},${total},${itemsCount},"${users}","${paymentMethods}","${saleDetails}"\n`;
                            });
                        }
                        downloadCSV(csv, 'report.csv');
                    }

                    // Settings functions
                    function loadUsers() {
                        usersTableBody.innerHTML = '';
                        storeData.users.forEach(user => {
                            const tr = document.createElement('tr');
                            tr.innerHTML = `
                                <td>${user.username}</td>
                                <td>${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</td>
                                <td>
                                    <button class="action-btn edit-btn" onclick="editUser(${user.id})">✏️</button>
                                    <button class="action-btn delete-btn" onclick="confirmDeleteUser(${user.id})">🗑️</button>
                                </td>
                            `;
                            usersTableBody.appendChild(tr);
                        });
                    }

                    function openUserModal(user = null) {
                        userForm.reset();
                        document.getElementById('user-id').value = user ? user.id : '';
                        document.getElementById('user-username').value = user ? user.username : '';
                        document.getElementById('user-password').value = '';
                        document.getElementById('user-role').value = user ? user.role : 'cashier';
                        document.getElementById('user-modal-title').textContent = user ? 'Edit User' : 'Add User';
                        openModal(userModal);
                    }

                    function saveUser(e) {
                        e.preventDefault();
                        const id = document.getElementById('user-id').value;
                        const username = document.getElementById('user-username').value;
                        const password = document.getElementById('user-password').value;
                        const role = document.getElementById('user-role').value;

                        if (!username || (!id && !password) || !role) {
                            alert('Please fill all required fields.');
                            return;
                        }

                        if (id) {
                            // Edit
                            const user = storeData.users.find(u => u.id == id);
                            if (user) {
                                user.username = username;
                                if (password) user.password = password;
                                user.role = role;
                            }
                        } else {
                            // Add
                            const newId = storeData.users.length ? Math.max(...storeData.users.map(u => u.id)) + 1 : 1;
                            storeData.users.push({
                                id: newId,
                                username,
                                password,
                                role
                            });
                        }
                        saveData();
                        closeModal(userModal);
                        loadUsers();
                    }

                    window.editUser = function(id) {
                        const user = storeData.users.find(u => u.id == id);
                        if (user) openUserModal(user);
                    };

                    window.confirmDeleteUser = function(id) {
                        confirmMessage.textContent = 'Are you sure you want to delete this user?';
                        confirmCallback = function() {
                            storeData.users = storeData.users.filter(u => u.id != id);
                            saveData();
                            loadUsers();
                        };
                        openModal(confirmModal);
                    };

                    function saveSettings() {
                        storeData.settings.lowStockThreshold = parseInt(lowStockThreshold.value, 10) || 10;
                        storeData.settings.expiryWarningDays = parseInt(expiryWarningDays.value, 10) || 7;
                        saveData();
                        loadDashboard();
                        loadInventory();
                        alert('Settings saved!');
                    }

                    // Data export/backup
                    function exportProducts() {
                        let csv = 'ID,Name,Category,Price,Stock,Expiry,Barcode\n';
                        storeData.products.forEach(p => {
                            csv += `${p.id},"${p.name}","${p.category}",${p.price},${p.stock},${p.expiry || ''},${p.barcode || ''}\n`;
                        });
                        downloadCSV(csv, 'products.csv');
                    }

                    function exportSales() {
                        let csv = 'ID,Date,Total,User,Payment Method,Items\n';
                        storeData.sales.forEach(s => {
                            const user = storeData.users.find(u => u.id == s.userId);
                            const items = s.items.map(i => `${i.name} x${i.quantity}`).join('; ');
                            csv += `${s.id},${s.date},${s.total},"${user ? user.username : ''}",${s.paymentMethod},"${items}"\n`;
                        });
                        downloadCSV(csv, 'sales.csv');
                    }

                    function backupData() {
                        const dataStr = JSON.stringify(storeData, null, 2);
                        const blob = new Blob([dataStr], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'yeninvent-backup.json';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                    }

                    function downloadCSV(csv, filename) {
                        const blob = new Blob([csv], { type: 'text/csv' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = filename;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                    }

                    // Initialize app on load
                    window.onload = init;

                    