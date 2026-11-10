export default function Champ({ label, type = 'text', value, onChange, ...rest }) {
  if (type === 'textarea') {
    return (
      <label className="champ">
        <span>{label}</span>
        <textarea value={value} onChange={onChange} {...rest} />
      </label>
    )
  }

  return (
    <label className="champ">
      <span>{label}</span>
      <input type={type} value={value} onChange={onChange} {...rest} />
    </label>
  )
}
