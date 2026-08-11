export default function Loader({ size = 'md', text = '' }) {
  return (
    <div className={size === 'page' ? 'page-loader' : 'loader-overlay'}>
      <div className={`loader-spinner ${size === 'sm' ? 'sm' : ''}`} />
      {text && <p>{text}</p>}
    </div>
  );
}
