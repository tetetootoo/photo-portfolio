const services = [
  "Photography",
  "Interior & Space Photography",
  "Product Photography",
  "Food Photography",
  "Creative Direction",
  "Visual Storytelling",
  "Campaign Photography",
];

export function Services() {
  return (
    <div className="page-copy">
      <h1>Services</h1>
      <ul className="services-list">
        {services.map((service) => (
          <li key={service}>{service}</li>
        ))}
      </ul>
    </div>
  );
}
