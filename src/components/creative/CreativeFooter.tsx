export default function CreativeFooter() {
  return (
    <footer className="c-footer">
      <div className="c-footer__contact">
        <div className="c-footer__brand">Don&rsquo;t Forget</div>
        <div className="c-footer__earth" aria-hidden="true" />
        <ul className="c-footer__items">
          <li>+123 456 7890</li>
          <li><a href="mailto:hello@dontforget.studio">hello@dontforget.studio</a></li>
          <li><a href="https://dontforget.studio">www.dontforget.studio</a></li>
          <li>123 Street Name, City, State, 12345</li>
        </ul>
      </div>
      <div className="c-footer__bar">
        <div className="c-footer__copy">
          <span>→</span>
          <span>©2025 Don&rsquo;t Forget Inc</span>
        </div>
        <div className="c-footer__terms">
          <a href="#">Terms of services</a>
          <a href="#">Privacy policy</a>
        </div>
      </div>
    </footer>
  );
}
