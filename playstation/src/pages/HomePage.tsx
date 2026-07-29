import { useEffect, useMemo, useState } from 'react';

import { games, genres, formatPrice, type Game } from '@/data/games';
import { useAuth } from '@/hooks/AuthContext';
import {
  createOrder,
  initializeStore,
  saveCartItem,
  saveWishlistItem,
} from '@/services/store';

export function HomePage() {
  const { signOut, user } = useAuth();
  const [genre, setGenre] = useState('All games');
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cart, setCart] = useState<Game[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const saved = window.localStorage.getItem('ps-store-wishlist');
    if (saved) setWishlist(JSON.parse(saved) as string[]);

    if (!user?.id) return;
    void initializeStore(user.id)
      .then((state) => {
        setWishlist(state.wishlistIds);
        setCart(games.filter((game) => state.cartIds.includes(game.id)));
        window.localStorage.setItem('ps-store-wishlist', JSON.stringify(state.wishlistIds));
      })
      .catch(() => {
        // The local copy remains usable during a temporary Fabric API outage.
      });
  }, [user?.id]);

  const visibleGames = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return games.filter((game) => {
      const matchesGenre = genre === 'All games' || game.genre === genre;
      const matchesQuery = !normalized || `${game.title} ${game.publisher} ${game.genre}`.toLowerCase().includes(normalized);
      return matchesGenre && matchesQuery;
    });
  }, [genre, query]);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 1800);
  };

  const toggleWishlist = (id: string) => {
    const next = wishlist.includes(id) ? wishlist.filter((item) => item !== id) : [...wishlist, id];
    setWishlist(next);
    window.localStorage.setItem('ps-store-wishlist', JSON.stringify(next));
    if (user?.id) void saveWishlistItem(user.id, id, next.includes(id)).catch(() => undefined);
    showToast(next.includes(id) ? 'Added to your wishlist' : 'Removed from your wishlist');
  };

  const addToCart = (game: Game) => {
    if (cart.some((item) => item.id === game.id)) {
      setCartOpen(true);
      return;
    }
    setCart((items) => [...items, game]);
    if (user?.id) void saveCartItem(user.id, game.id, true).catch(() => undefined);
    showToast(game.price === 0 ? 'Added to your library' : 'Added to cart');
  };

  const removeFromCart = (game: Game) => {
    setCart((items) => items.filter((item) => item.id !== game.id));
    if (user?.id) void saveCartItem(user.id, game.id, false).catch(() => undefined);
  };

  const checkout = async () => {
    if (!user?.id || cart.length === 0) return;
    try {
      await createOrder(user.id, total);
      await Promise.all(cart.map((game) => saveCartItem(user.id, game.id, false)));
      setCart([]);
      setCartOpen(false);
      showToast('Order created in Fabric');
    } catch {
      showToast('Checkout could not be completed');
    }
  };

  const total = cart.reduce((sum, game) => sum + game.price, 0);

  return (
    <div className="ps-store">
      <div className="sony-strip">SONY</div>
      <header className="ps-global-header">
        <a href="#top" className="ps-brand" aria-label="PlayStation Store home">
          <span className="ps-glyph">P</span><span>PlayStation</span>
        </a>
        <nav className="global-links" aria-label="PlayStation">
          <a href="#store">Store</a><a href="#games">PS5</a><a href="#games">Games</a>
          <a href="#plus">PS Plus</a><a href="#footer">Accessories</a><a href="#footer">Support</a>
        </nav>
        <div className="account-actions">
          <button className="search-trigger" onClick={() => setSearchOpen((value) => !value)} aria-label="Search store">⌕</button>
          <button className="profile-button" title={user?.email ?? 'Signed in'}>{user?.email?.slice(0, 1).toUpperCase() ?? 'U'}</button>
        </div>
      </header>

      <nav className="store-nav" id="top" aria-label="Store">
        <strong>PlayStation<span>Store</span></strong>
        <div className="store-links">
          <a className="active" href="#store">Latest</a><a href="#games">Collections</a>
          <a href="#deals">Deals</a><a href="#plus">Subscriptions</a><a href="#games">Browse</a>
        </div>
        <button className="bag-button" onClick={() => setCartOpen(true)}>Bag <span>{cart.length}</span></button>
      </nav>

      {searchOpen && (
        <div className="search-panel">
          <label htmlFor="game-search">Search PlayStation Store</label>
          <div><input id="game-search" autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search games, add-ons and more" /><button onClick={() => setSearchOpen(false)}>Done</button></div>
        </div>
      )}

      <main>
        <section className="hero" id="store">
          <span className="hero-symbol hero-triangle">△</span><span className="hero-symbol hero-circle">○</span><span className="hero-symbol hero-cross">×</span>
          <div className="hero-copy">
            <p className="eyebrow">PlayStation Store</p>
            <h1>SUMMER<br />SALE</h1>
            <p className="hero-description">Shop sizzling deals right now. Save up to 75% on blockbusters, essential indies and everything in between.</p>
            <a className="hero-cta" href="#deals">Save now <span>→</span></a>
            <small>Sale ends 13 August</small>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="sun" />
            <div className="floating-cover cover-one"><img src={games[3].image} alt="" /></div>
            <div className="floating-cover cover-two"><img src={games[8].image} alt="" /></div>
            <div className="floating-cover cover-three"><img src={games[0].image} alt="" /></div>
          </div>
          <div className="hero-progress"><b>01</b><i /><i /><i /><span>04</span></div>
        </section>

        <section className="top-chart" id="deals">
          <SectionHeader eyebrow="Trending in UAE" title="Top 10 games in your country" />
          <div className="rank-grid">
            {games.slice(0, 5).map((game, index) => (
              <button className="rank-card" key={game.id} onClick={() => setSelectedGame(game)}>
                <span className="rank-number">{String(index + 1).padStart(2, '0')}</span>
                <img src={game.image} alt={`${game.title} cover`} />
                <span className="platform-label">{game.platform}</span>
                <strong>{game.title}</strong>
                <span className="rank-price">{formatPrice(game.price)}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="catalogue" id="games">
          <div className="catalogue-heading">
            <SectionHeader eyebrow="Find your next game" title="Explore the store" />
            <span>{visibleGames.length} titles</span>
          </div>
          <div className="filter-row" role="group" aria-label="Filter games">
            {genres.map((item) => <button key={item} className={genre === item ? 'selected' : ''} onClick={() => setGenre(item)}>{item}</button>)}
          </div>
          {visibleGames.length ? (
            <div className="game-grid">
              {visibleGames.map((game) => (
                <article className="game-card" key={game.id}>
                  <div className="game-cover">
                    <button className="cover-button" onClick={() => setSelectedGame(game)} aria-label={`View ${game.title} details`}>
                      <img src={game.image} alt={`${game.title} cover`} />
                    </button>
                    {game.badge && <span className="sale-badge">{game.badge}</span>}
                    <button className={`heart-button ${wishlist.includes(game.id) ? 'liked' : ''}`} onClick={() => toggleWishlist(game.id)} aria-label={`Toggle ${game.title} wishlist`}>{wishlist.includes(game.id) ? '♥' : '♡'}</button>
                    <button className="quick-add" onClick={() => addToCart(game)}>{cart.some((item) => item.id === game.id) ? 'In your bag' : game.price === 0 ? 'Add to library' : 'Add to bag'}</button>
                  </div>
                  <span className="platform-label">{game.platform}</span>
                  <button className="game-title" onClick={() => setSelectedGame(game)}>{game.title}</button>
                  <div className="game-price"><strong>{formatPrice(game.price)}</strong>{game.oldPrice && <del>${game.oldPrice.toFixed(2)}</del>}</div>
                </article>
              ))}
            </div>
          ) : (
            <div className="no-results"><p>No results for “{query}”.</p><button onClick={() => { setQuery(''); setGenre('All games'); }}>Clear filters</button></div>
          )}
        </section>

        <section className="plus-banner" id="plus">
          <div className="plus-copy">
            <div className="plus-wordmark"><span>✦</span> PlayStation<b>Plus</b></div>
            <p className="eyebrow">Level up your play</p>
            <h2>Hundreds of games.<br />One membership.</h2>
            <p>Discover new adventures, online multiplayer, cloud streaming and exclusive PlayStation Store discounts.</p>
            <a href="#games">Explore PlayStation Plus →</a>
          </div>
          <div className="symbol-orbit" aria-hidden="true"><span>△</span><span>○</span><span>×</span><span>□</span></div>
        </section>
      </main>

      <footer id="footer">
        <div className="footer-heading"><div className="ps-brand footer-brand"><span className="ps-glyph">P</span><span>PlayStation</span></div><span>United Arab Emirates · English</span></div>
        <div className="footer-grid">
          <div><strong>About</strong><a href="#">About SIE</a><a href="#">Careers</a><a href="#">PlayStation Studios</a></div>
          <div><strong>Products</strong><a href="#">PS5</a><a href="#">PS4</a><a href="#">PS VR2</a><a href="#">PS Plus</a></div>
          <div><strong>Support</strong><a href="#">Support hub</a><a href="#">Status</a><a href="#">Repairs</a></div>
          <div><strong>Account</strong><span>{user?.email}</span><button onClick={() => void signOut()}>Sign out</button></div>
        </div>
        <p className="legal">© 2026 Sony Interactive Entertainment Europe Limited. Concept storefront for Rayfin in Microsoft Fabric.</p>
      </footer>

      {selectedGame && <GameDetails game={selectedGame} wishlisted={wishlist.includes(selectedGame.id)} onClose={() => setSelectedGame(null)} onWishlist={() => toggleWishlist(selectedGame.id)} onAdd={() => addToCart(selectedGame)} />}

      {cartOpen && (
        <>
          <button className="drawer-backdrop" onClick={() => setCartOpen(false)} aria-label="Close cart" />
          <aside className="cart-drawer" aria-label="Shopping bag">
            <div className="drawer-header"><div><p>Your bag</p><h2>{cart.length} {cart.length === 1 ? 'item' : 'items'}</h2></div><button onClick={() => setCartOpen(false)} aria-label="Close">×</button></div>
            <div className="cart-items">
              {cart.length ? cart.map((game) => (
                <div className="cart-item" key={game.id}><img src={game.image} alt="" /><div><strong>{game.title}</strong><span>{game.platform}</span><p>{formatPrice(game.price)}</p></div><button onClick={() => removeFromCart(game)} aria-label={`Remove ${game.title}`}>×</button></div>
              )) : <div className="empty-bag"><span>△ ○ × □</span><h3>Your bag is empty</h3><p>Great games are waiting for you.</p></div>}
            </div>
            {cart.length > 0 && <div className="cart-total"><div><span>Total</span><strong>${total.toFixed(2)}</strong></div><button onClick={() => void checkout()}>Continue to checkout</button></div>}
          </aside>
        </>
      )}
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return <div className="section-title"><p className="eyebrow blue">{eyebrow}</p><h2>{title}</h2></div>;
}

function GameDetails({ game, wishlisted, onClose, onWishlist, onAdd }: { game: Game; wishlisted: boolean; onClose: () => void; onWishlist: () => void; onAdd: () => void }) {
  return (
    <div className="detail-shell" role="dialog" aria-modal="true" aria-label={`${game.title} details`}>
      <button className="detail-backdrop" onClick={onClose} aria-label="Close game details" />
      <section className="detail-panel">
        <button className="detail-close" onClick={onClose} aria-label="Close">×</button>
        <div className="detail-cover"><img src={game.image} alt={`${game.title} cover`} /></div>
        <div className="detail-copy">
          <span className="platform-label">{game.platform}</span><h2>{game.title}</h2><p className="publisher">{game.publisher}</p>
          <div className="detail-price"><strong>{formatPrice(game.price)}</strong>{game.oldPrice && <del>${game.oldPrice.toFixed(2)}</del>}</div>
          <p className="detail-description">{game.description}</p>
          <div className="feature-list">{game.features.map((feature) => <span key={feature}>{feature}</span>)}</div>
          <div className="rating-row"><b>{game.rating}</b><span>Age rating<br />Digital purchase</span></div>
          <div className="detail-actions"><button className="detail-buy" onClick={onAdd}>{game.price === 0 ? 'Add to library' : 'Add to cart'}</button><button className={`detail-heart ${wishlisted ? 'liked' : ''}`} onClick={onWishlist}>{wishlisted ? '♥' : '♡'}</button></div>
          <small>Internet connection and PlayStation Network account may be required. This is a concept storefront.</small>
        </div>
      </section>
    </div>
  );
}
