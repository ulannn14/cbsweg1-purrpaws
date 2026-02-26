export function Layout(content) {
  return `
    <div class="app-layout">

      <aside class="sidebar">
        <div class="logo">
          <img src="/images/logo.png" />
        </div>

        <nav class="nav">
          <a href="/" data-link class="nav-item">
            <img src="/images/icons/shelter.png">
          </a>

          <a href="/applications" data-link class="nav-item">
            <img src="/images/icons/application.png">
          </a>

          <a href="/profile" data-link class="nav-item">
            <img src="/images/icons/profile.png">
          </a>
        </nav>
      </aside>

      <main class="main">
        ${content}
      </main>

    </div>
  `;
}