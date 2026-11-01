import Link from "next/link";
export default function Offline() {
  return (
    <main id="main-content" className="content-page">
      <h1>You are offline.</h1>
      <p>
        This page has not been saved on this device. Open the cached directory,
        or reconnect and try this page again. Suggestions and external tools
        need a connection.
      </p>
      <Link className="button button-primary" href="/">
        Open the directory
      </Link>
    </main>
  );
}
