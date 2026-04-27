export default function StatCard({ icon: Icon, label, value, tone, detail }) {
  return (
    <article className={`stat-card stat-card-${tone}`}>
      <span className="stat-icon">
        <Icon size={22} />
      </span>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        {detail ? <small>{detail}</small> : null}
      </div>
    </article>
  );
}
