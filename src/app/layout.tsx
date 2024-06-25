import Link from 'next/link'
import 'bootstrap/dist/css/bootstrap.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <Link className="navbar-brand" href="#">eink-daemon-node</Link>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <NavLink text="About" href="/"/>
                <NavLink text="Setup" href="/setup"/>
                <NavLink text="Query" href="/query"/>
              </ul>
            </div>
          </div>
        </nav>
        <main className="container pt-3">
          {children}
        </main>
      </body>
    </html>
  );
}

function NavLink(args : INavLinkArgs){
  const { href, text } = args;
  return (
    <li className="nav-item">
      <Link className="nav-link" href={href}>{text}</Link>
    </li>
  )
}

interface INavLinkArgs{
  text: string;
  href: string;
}