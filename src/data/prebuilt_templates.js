export const PREBUILT_TEMPLATES = [
  {
    id: 'p1',
    name: 'Restaurant Landing Page',
    desc: 'Warm colors, hero, menu grid, reservation form',
    category: 'Food & Restaurant',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Savoria Restaurant</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Lato', sans-serif; }
        h1, h2, h3, .serif { font-family: 'Playfair Display', serif; }
        .hero { background: linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80') center/cover; }
    </style>
</head>
<body class="bg-[#faf8f5] text-gray-800">
    <!-- Navbar -->
    <nav class="fixed w-full z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div class="text-2xl font-bold serif text-orange-600">Savoria</div>
            <div class="hidden md:flex items-center gap-8 font-medium">
                <a href="#menu" class="hover:text-orange-600 transition">Menu</a>
                <a href="#about" class="hover:text-orange-600 transition">Our Story</a>
                <a href="#reservations" class="bg-orange-600 text-white px-6 py-2 rounded-full hover:bg-orange-700 transition">Book a Table</a>
            </div>
        </div>
    </nav>

    <!-- Hero -->
    <header class="hero h-screen flex items-center pt-20">
        <div class="max-w-7xl mx-auto px-6 text-white w-full">
            <div class="max-w-2xl">
                <span class="text-orange-400 font-bold tracking-widest uppercase text-sm mb-4 block">Fine Dining Experience</span>
                <h1 class="text-6xl md:text-8xl font-bold mb-6 leading-tight">Taste the<br>Extraordinary.</h1>
                <p class="text-xl text-gray-300 mb-8 font-light">Experience culinary excellence with our seasonal menus crafted by award-winning chefs.</p>
                <div class="flex gap-4">
                    <a href="#menu" class="bg-white text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition">View Menu</a>
                    <a href="#reservations" class="border border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white/10 transition">Reservations</a>
                </div>
            </div>
        </div>
    </header>

    <!-- Simple Menu -->
    <section id="menu" class="py-24 max-w-7xl mx-auto px-6">
        <div class="text-center mb-16">
            <h2 class="text-4xl md:text-5xl font-bold mb-4">Featured Dishes</h2>
            <div class="w-24 h-1 bg-orange-600 mx-auto"></div>
        </div>
        <div class="grid md:grid-cols-2 gap-12">
            <!-- Item 1 -->
            <div class="flex gap-6 border-b border-gray-200 pb-6">
                <img src="https://images.unsplash.com/photo-1544025162-83503527fb96?auto=format&fit=crop&q=80&w=200&h=200" alt="Dish" class="w-24 h-24 object-cover rounded-lg">
                <div class="flex-1">
                    <div class="flex justify-between items-baseline mb-2">
                        <h3 class="text-xl font-bold">Truffle Risotto</h3>
                        <span class="text-orange-600 font-bold text-lg">$28</span>
                    </div>
                    <p class="text-gray-600">Arborio rice, wild mushrooms, black truffle shavings, parmesan crisp.</p>
                </div>
            </div>
            <!-- Item 2 -->
            <div class="flex gap-6 border-b border-gray-200 pb-6">
                <img src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&q=80&w=200&h=200" alt="Dish" class="w-24 h-24 object-cover rounded-lg">
                <div class="flex-1">
                    <div class="flex justify-between items-baseline mb-2">
                        <h3 class="text-xl font-bold">Pan-Seared Scallops</h3>
                        <span class="text-orange-600 font-bold text-lg">$34</span>
                    </div>
                    <p class="text-gray-600">Cauliflower purée, crispy pancetta, citrus beurre blanc, micro greens.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Reservation Form -->
    <section id="reservations" class="bg-gray-900 text-white py-24">
        <div class="max-w-4xl mx-auto px-6 text-center">
            <h2 class="text-4xl md:text-5xl font-bold mb-4">Book Your Table</h2>
            <p class="text-gray-400 mb-12">Join us for an unforgettable evening. Reservations recommended.</p>
            <form class="grid md:grid-cols-3 gap-4" onsubmit="event.preventDefault(); alert('Reservation requested!');">
                <input type="date" required class="bg-gray-800 border border-gray-700 px-4 py-3 rounded focus:outline-none focus:border-orange-500">
                <select class="bg-gray-800 border border-gray-700 px-4 py-3 rounded focus:outline-none focus:border-orange-500">
                    <option>2 People</option>
                    <option>3 People</option>
                    <option>4 People</option>
                    <option>5+ People</option>
                </select>
                <button type="submit" class="bg-orange-600 text-white px-6 py-3 rounded font-bold hover:bg-orange-700 transition">Confirm Booking</button>
            </form>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-black text-gray-500 py-12 text-center">
        <div class="text-2xl serif text-white mb-6">Savoria</div>
        <p>123 Culinary Lane, Food City, FC 90210</p>
        <p class="mt-8 text-sm opacity-50">&copy; 2026 Savoria Restaurant. All rights reserved.</p>
    </footer>
</body>
</html>`
  },
  {
    id: 'p2',
    name: 'SaaS Dashboard',
    desc: 'Minimal white, hero, features, pricing table',
    category: 'SaaS & Tech',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SaaS Dashboard Landing</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { font-family: system-ui, -apple-system, sans-serif; }
    </style>
</head>
<body class="bg-white text-gray-900 antialiased">
    <nav class="border-b border-gray-100 py-4 px-6 flex justify-between items-center max-w-6xl mx-auto">
        <div class="font-bold text-xl tracking-tighter text-indigo-600">MetricFlow</div>
        <div class="flex items-center gap-4">
            <a href="#" class="text-sm font-medium text-gray-600 hover:text-black">Log in</a>
            <a href="#" class="bg-black text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-800 transition">Get Started</a>
        </div>
    </nav>

    <header class="pt-32 pb-20 px-6 text-center max-w-4xl mx-auto">
        <h1 class="text-5xl md:text-7xl font-bold tracking-tight mb-6">Your data, visualized beautifully.</h1>
        <p class="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">Stop guessing. Start measuring. MetricFlow gives you real-time insights into your business performance without the complex setup.</p>
        <div class="flex justify-center gap-4">
            <a href="#" class="bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-medium hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">Start Free Trial</a>
            <a href="#" class="bg-gray-50 text-gray-900 border border-gray-200 px-8 py-3.5 rounded-xl font-medium hover:bg-gray-100 transition">View Demo</a>
        </div>
        
        <div class="mt-20 border border-gray-200 rounded-2xl shadow-2xl p-2 bg-gray-50 overflow-hidden relative group">
            <div class="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10"></div>
            <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80" alt="Dashboard" class="rounded-xl w-full border border-gray-200 shadow-sm relative z-0">
        </div>
    </header>

    <section class="py-24 bg-gray-50 border-t border-gray-100">
        <div class="max-w-6xl mx-auto px-6">
            <h2 class="text-3xl font-bold text-center mb-16 tracking-tight">Simple Pricing, No Surprises</h2>
            <div class="grid md:grid-cols-3 gap-8">
                <!-- Plan 1 -->
                <div class="bg-white p-8 rounded-2xl border border-gray-200 flex flex-col">
                    <h3 class="font-semibold text-gray-500 mb-4 uppercase text-sm tracking-wider">Starter</h3>
                    <div class="text-4xl font-bold mb-6">$29<span class="text-lg text-gray-400 font-normal">/mo</span></div>
                    <ul class="space-y-4 mb-8 flex-1">
                        <li class="flex items-center gap-3 text-sm"><span class="text-indigo-500">✓</span> Up to 5 users</li>
                        <li class="flex items-center gap-3 text-sm"><span class="text-indigo-500">✓</span> Basic analytics</li>
                        <li class="flex items-center gap-3 text-sm"><span class="text-indigo-500">✓</span> 24hr support response</li>
                    </ul>
                    <button class="w-full py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium hover:bg-gray-100">Subscribe</button>
                </div>
                <!-- Plan 2 -->
                <div class="bg-indigo-600 p-8 rounded-2xl border border-indigo-500 text-white shadow-xl scale-105 flex flex-col relative">
                    <div class="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-500 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">Most Popular</div>
                    <h3 class="font-semibold text-indigo-200 mb-4 uppercase text-sm tracking-wider">Pro</h3>
                    <div class="text-4xl font-bold mb-6">$99<span class="text-lg text-indigo-300 font-normal">/mo</span></div>
                    <ul class="space-y-4 mb-8 flex-1">
                        <li class="flex items-center gap-3 text-sm"><span class="text-white">✓</span> Unlimited users</li>
                        <li class="flex items-center gap-3 text-sm"><span class="text-white">✓</span> Advanced analytics</li>
                        <li class="flex items-center gap-3 text-sm"><span class="text-white">✓</span> 1hr support response</li>
                        <li class="flex items-center gap-3 text-sm"><span class="text-white">✓</span> Custom integrations</li>
                    </ul>
                    <button class="w-full py-3 bg-white text-indigo-600 rounded-xl font-bold border border-white hover:bg-gray-50 shadow-lg">Start 14-day Trial</button>
                </div>
            </div>
        </div>
    </section>

    <footer class="py-12 border-t border-gray-200 text-center text-gray-500 text-sm">
        &copy; 2026 MetricFlow Inc.
    </footer>
</body>
</html>`
  }
]
