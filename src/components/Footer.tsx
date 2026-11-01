import Link from "next/link";
export default function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <Link href="/" className="footer-name">
          Random Stuff
        </Link>
        <p>
          Selected by{" "}
          <a
            href="https://shocka.site/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Nipun / ShockaGG
          </a>
          .<br />
          Independent picks. No paid placements.
        </p>
      </div>
      <nav aria-label="Footer navigation">
        <Link href="/about">Curation & privacy</Link>
        <a href="/feed.xml">Subscribe with RSS</a>
        <Link href="/submit">Suggest a tool</Link>
        <a
          href="https://github.com/nipunyatawara-dev/random-stuff-site"
          target="_blank"
          rel="noopener noreferrer"
        >
          Contribute on GitHub
        </a>
      </nav>
    </footer>
  );
}
