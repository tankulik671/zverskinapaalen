import { useParams, Link } from "react-router-dom";

const albums = {
  "mc-uboyniy-staffchik": {
    title: "МЦ УБОЙНЫЙ СТАФФЧИК EP",
    cover: "images/covers/MСUBOYNIYSTAFFChIKEP.png",
    year: 2026,
    desc: "",
  },
  elmao2: {
    title: "эльмао 2",
    cover: "images/covers/elmao2.png",
    year: 2025,
    desc: "",
  },
  elmao: {
    title: "эльмао",
    cover: "images/covers/elmao.jpg",
    year: 2025,
    desc: "",
  },
};

export default function AlbumPage() {
  const { slug } = useParams();
  const album = albums[slug];

  if (!album) {
    return (
      <div style={{ padding: 40 }}>
        <h1>Альбом не найден</h1>
        <Link to="/diskografiya">← Назад к дискографии</Link>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 980,
        margin: "40px auto",
        background: "#071017",
        border: "2px solid rgba(0,140,210,.12)",
        padding: 18,
        display: "flex",
        gap: 18,
        color: "#dff",
      }}
    >
      <div style={{ flex: "0 0 320px" }}>
        <img
          src={`/${album.cover}`}
          alt={album.title}
          style={{ width: "100%", height: 320, objectFit: "cover", borderRadius: 6 }}
        />
      </div>
      <div style={{ flex: 1 }}>
        <h2>{album.title}</h2>
        <p style={{ marginTop: 8, color: "#9fc" }}>
          zverski napalen :3 · {album.year}
        </p>
        <p style={{ marginTop: 12, lineHeight: 1.5 }}>{album.desc || "Описание будет добавлено."}</p>
        <Link
          to="/diskografiya"
          style={{ display: "inline-block", marginTop: 20, color: "#00c2ff", fontWeight: 700 }}
        >
          ← Назад к дискографии
        </Link>
      </div>
    </div>
  );
}
