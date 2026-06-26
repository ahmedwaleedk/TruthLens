export const Footer = () => {
  return (
    <footer className="tl-footer mt-auto">
      <div className="container text-center small">
        <span className="tl-text-dim">
          &copy; {new Date().getFullYear()} TruthLens
        </span>
        <span className="mx-2 tl-text-dim">·</span>
        <span className="tl-text-muted">Multimodal Fake News Detection</span>
      </div>
    </footer>
  );
};
