import Link from "next/link";

export default function Home() {
  return (
    <section className="home-shell">
      <div className="home-card">
        <p className="eyebrow">Eleccion presidencial</p>
        <h2>Inicio del proyecto colaborativo</h2>
        <p>
          Esta pantalla queda como portada general. La seccion de Candidatos se
          encuentra en una ruta independiente para desarrollar los perfiles y
          el contenido de los 14 aspirantes.
        </p>
        <Link className="primary-link" href="/candidatos">
          Ir a Candidatos
        </Link>
      </div>
    </section>
  );
}
